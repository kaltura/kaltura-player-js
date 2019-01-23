/* eslint-disable require-jsdoc */
// @flow
import {KalturaPlayer} from '../../kaltura-player';
import {PlayerSnapshot} from './player-snapshot';
import {CastEventType} from './cast-event-type';
import {EventType as CoreEventType, FakeEvent, loadPlayer, TrackType, Utils} from '@playkit-js/playkit-js';
import {RemoteAvailablePayload, RemoteConnectedPayload, RemoteDisconnectedPayload} from './remote-payload';
import {UIWrapper} from '../ui-wrapper';
import getLogger from '../utils/logger';

const logger: any = getLogger('RemoteControl');

/**
 * @class RemoteControl
 * @param {KalturaPlayer} player - The Kaltura player.
 */
class RemoteControl {
  /**
   * Gets the player snapshot.
   * @returns {PlayerSnapshot} - player snapshot.
   * @memberof RemoteControl
   * @instance
   */
  getPlayerSnapshot: Function;
  /**
   * Gets the UI wrapper.
   * @returns {UIWrapper} - The UI wrapper.
   * @memberof RemoteControl
   * @instance
   */
  getUIWrapper: Function;
  /**
   * On remote device disconnected handler.
   * @param {RemoteDisconnectedPayload} payload - disconnected payload.
   * @returns {void}
   * @memberof RemoteControl
   * @instance
   */
  onRemoteDeviceDisconnected: Function;
  /**
   * On remote device connected handler.
   * @param {RemoteConnectedPayload} payload - connected payload.
   * @returns {void}
   * @memberof RemoteControl
   * @instance
   */
  onRemoteDeviceConnected: Function;
  /**
   * On remote device available handler.
   * @param {RemoteAvailablePayload} payload - available payload.
   * @returns {void}
   * @memberof RemoteControl
   * @instance
   */
  onRemoteDeviceAvailable: Function;
  /**
   * On remote device connecting handler.
   * @returns {void}
   * @memberof RemoteControl
   * @instance
   * @fires CastEventType:CAST_SESSION_STARTING
   */
  onRemoteDeviceConnecting: Function;
  /**
   * On remote device disconnecting handler.
   * @returns {void}
   * @memberof RemoteControl
   * @instance
   */
  onRemoteDeviceDisconnecting: Function;
  /**
   * On remote device connect failed handler.
   * @returns {void}
   * @memberof RemoteControl
   * @instance
   */
  onRemoteDeviceConnectFailed: Function;

  constructor(player: KalturaPlayer) {
    this.getPlayerSnapshot = getPlayerSnapshot.bind(player);
    this.getUIWrapper = getUIWrapper.bind(player);
    this.onRemoteDeviceAvailable = onRemoteDeviceAvailable.bind(player);
    this.onRemoteDeviceConnected = onRemoteDeviceConnected.bind(player);
    this.onRemoteDeviceDisconnected = onRemoteDeviceDisconnected.bind(player);
    this.onRemoteDeviceConnecting = onRemoteDeviceConnecting.bind(player);
    this.onRemoteDeviceDisconnecting = onRemoteDeviceDisconnecting.bind(player);
    this.onRemoteDeviceConnectFailed = onRemoteDeviceConnectFailed.bind(player);
  }
}

function onRemoteDeviceConnecting(): void {
  logger.debug('onRemoteDeviceConnecting');
  this.dispatchEvent(new FakeEvent(CastEventType.CAST_SESSION_STARTING));
}

function onRemoteDeviceConnected(payload: RemoteConnectedPayload): void {
  logger.debug('onRemoteDeviceConnected', payload);
  const {player, ui, session} = payload;
  // After remote player is connected, clean all listeners and bounce the remote player events forward
  this._eventManager.removeAll();
  Object.values(CoreEventType).forEach(coreEvent => this._eventManager.listen(player, coreEvent, e => this.dispatchEvent(e)));
  // Use the current config with the remote player presets on the new ui wrapper
  const config = this.config;
  if (ui) {
    Utils.Object.mergeDeep(config, {ui: {customPreset: ui.uis}});
  }
  this.configure({
    playback: {
      muted: this.muted,
      volume: this.volume
    }
  });
  // Reset the local player, create new ui wrapper and set the remote player
  this._localPlayer.reset();
  this._uiWrapper.destroy();
  this._remotePlayer = player;
  this._uiWrapper = new UIWrapper(this, config);
  // Dispatch the cast started event
  this.dispatchEvent(
    new FakeEvent(CastEventType.CAST_SESSION_STARTED, {
      session: session
    })
  );
}

function onRemoteDeviceDisconnecting(): void {
  logger.debug('onRemoteDeviceDisconnecting');
  this.dispatchEvent(new FakeEvent(CastEventType.CAST_SESSION_ENDING));
}

function onRemoteDeviceDisconnected(payload: RemoteDisconnectedPayload): void {
  logger.debug('onRemoteDeviceDisconnected', payload);
  const {player, snapshot} = payload;
  if (this._remotePlayer && this._remotePlayer === player) {
    // After remote player is disconnected, clean all listeners and bounce the remote player events forward
    this._eventManager.removeAll();
    reconstructPlayerComponents.call(this, snapshot);
    if (snapshot) {
      this.dispatchEvent(new FakeEvent(CastEventType.CAST_SESSION_ENDED));
      const originPlaybackConfig = this.config.playback;
      const shouldPause = !snapshot.config.playback.autoplay;
      const mediaInfo = snapshot.mediaInfo;
      snapshot.config.playback.autoplay = true;
      configurePlayback.call(this, snapshot.config.playback);
      if (mediaInfo) {
        this.loadMedia(mediaInfo).then(() => {
          this._eventManager.listenOnce(this, this.Event.Core.FIRST_PLAYING, () => {
            this.textStyle = snapshot.textStyle;
            configurePlayback.call(this, originPlaybackConfig);
            setInitialTracks.call(this, snapshot);
            if (shouldPause) {
              this.pause();
            }
          });
        });
      }
    }
  }
}

function onRemoteDeviceAvailable(payload: RemoteAvailablePayload): void {
  logger.debug('onRemoteDeviceAvailable', payload);
  const {player, available} = payload;
  this.dispatchEvent(
    new FakeEvent(CastEventType.CAST_AVAILABLE, {
      type: player.type,
      available: available
    })
  );
}

function onRemoteDeviceConnectFailed(): void {
  logger.debug('onRemoteDeviceConnectFailed');
  this.dispatchEvent(new FakeEvent(CastEventType.CAST_SESSION_START_FAILED));
}

function getPlayerSnapshot(): PlayerSnapshot {
  const snapshot = new PlayerSnapshot(this);
  logger.debug('getPlayerSnapshot', snapshot);
  return snapshot;
}

function getUIWrapper(): UIWrapper {
  logger.debug('getUIWrapper');
  return this._uiWrapper;
}

function reconstructPlayerComponents(snapshot: PlayerSnapshot): void {
  // Destroy the remote ui wrapper
  this._uiWrapper.destroy();
  const playerConfig = this._localPlayer.config;
  // If the local player config contains ima, needs to destroy the player and create it from scratch
  if (playerConfig.plugins && playerConfig.plugins.ima) {
    let imaConfig = {};
    // If it's a VAST ad we are empty the ad tag so ads won't play and configure it later
    if (playerConfig.cast.advertising && playerConfig.cast.advertising.vast) {
      if (snapshot.config.playback.startTime > 0) {
        const adTagUrl = playerConfig.plugins.ima.adTagUrl;
        imaConfig = {
          adTagUrl: ''
        };
        this._eventManager.listen(this, CoreEventType.FIRST_PLAYING, () => this.configure({plugins: {ima: {adTagUrl: adTagUrl}}}));
      }
    } else {
      imaConfig = {
        // Needs to wait for engine to create the new ads container
        delayInitUntilSourceSelected: true
      };
    }
    Utils.Object.mergeDeep(playerConfig, {plugins: {ima: imaConfig}});
    // Destroy the local player and load new one
    this._localPlayer.destroy();
    this._remotePlayer = null;
    this._localPlayer = loadPlayer(playerConfig);
  } else {
    this._remotePlayer = null;
  }
  // Listen on the local player events and bounce its events forward
  Object.values(CoreEventType).forEach(coreEvent => this._eventManager.listen(this._localPlayer, coreEvent, e => this.dispatchEvent(e)));
  // Create new ui wrapper with an updated state for the isCastAvailable prop
  this._uiWrapper = new UIWrapper(this, this.config);
  this._uiWrapper.setConfig({isCastAvailable: this.isCastAvailable()}, 'engine');
}

function configurePlayback(playbackConfig: Object): void {
  const {autoplay, startTime} = playbackConfig;
  this.configure({
    playback: {
      startTime,
      autoplay
    }
  });
}

function setInitialTracks(playbackConfig: Object): void {
  if (playbackConfig.audioLanguage) {
    const audioTrack = this.getTracks(TrackType.AUDIO).find(t => t.language === playbackConfig.audioLanguage);
    this.selectTrack(audioTrack);
  }
  if (playbackConfig.textLanguage) {
    const textTrack = this.getTracks(TrackType.TEXT).find(t => t.language === playbackConfig.textLanguage);
    this.selectTrack(textTrack);
  }
}

export {RemoteControl};
