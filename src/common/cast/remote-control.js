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

class RemoteControl {
  getPlayerSnapshot: Function;
  getUIWrapper: Function;
  onRemoteDeviceDisconnected: Function;
  onRemoteDeviceConnected: Function;
  onRemoteDeviceAvailable: Function;
  onRemoteDeviceConnecting: Function;
  onRemoteDeviceDisconnecting: Function;
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

/**
 * On remote device connecting handler.
 * @returns {void}
 */
function onRemoteDeviceConnecting(): void {
  logger.debug('onRemoteDeviceConnecting');
  this.dispatchEvent(new FakeEvent(CastEventType.CAST_SESSION_STARTING));
}

/**
 * On remote device connected handler.
 * @param {RemoteConnectedPayload} payload - connected payload.
 * @returns {void}
 */
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

/**
 * On remote device disconnecting handler.
 * @returns {void}
 */
function onRemoteDeviceDisconnecting(): void {
  logger.debug('onRemoteDeviceDisconnecting');
  this.dispatchEvent(new FakeEvent(CastEventType.CAST_SESSION_ENDING));
}

/**
 * On remote device disconnected handler.
 * @param {RemoteDisconnectedPayload} payload - disconnected payload.
 * @returns {void}
 */
function onRemoteDeviceDisconnected(payload: RemoteDisconnectedPayload): void {
  logger.debug('onRemoteDeviceDisconnected', payload);
  const {player, snapshot} = payload;
  if (this._remotePlayer && this._remotePlayer === player) {
    // After remote player is disconnected, clean all listeners and bounce the remote player events forward
    this._eventManager.removeAll();
    reconstructPlayerComponents.call(this, snapshot);
    if (snapshot && snapshot.mediaInfo) {
      this.dispatchEvent(new FakeEvent(CastEventType.CAST_SESSION_ENDED));
      const mediaInfo = snapshot.mediaInfo;
      const originPlaybackConfig = this.config.playback;
      configurePlayback.call(this, snapshot);
      this.loadMedia(mediaInfo).then(() => {
        this._eventManager.listenOnce(this, this.Event.Core.PLAYBACK_STARTED, () => {
          setInitialAttributes.call(this, snapshot);
          setInitialTracks.call(this, snapshot);
          configurePlayback.call(this, originPlaybackConfig);
        });
      });
    }
  }
}

/**
 * On remote device available handler.
 * @param {RemoteAvailablePayload} payload - available payload.
 * @returns {void}
 */
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

/**
 * On remote device connect failed handler.
 * @returns {void}
 */
function onRemoteDeviceConnectFailed(): void {
  logger.debug('onRemoteDeviceConnectFailed');
  this.dispatchEvent(new FakeEvent(CastEventType.CAST_SESSION_START_FAILED));
}

/**
 * Gets the player snapshot.
 * @returns {PlayerSnapshot} - player snapshot.
 */
function getPlayerSnapshot(): PlayerSnapshot {
  const snapshot = new PlayerSnapshot(this);
  logger.debug('getPlayerSnapshot', snapshot);
  return snapshot;
}

/**
 * Gets the UI wrapper.
 * @returns {UIWrapper} - The UI wrapper.
 */
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
    // Configure ima such that continuous playback with ads will be start properly
    Utils.Object.mergeDeep(playerConfig, {
      plugins: {
        ima: {
          // Needs to wait for engine to create the new ads container
          delayInitUntilSourceSelected: true,
          adsRenderingSettings: {
            // We don't want to play ads that already played in the receiver
            playAdsAfterTime: snapshot.startTime
          }
        }
      }
    });
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

function configurePlayback(config: PKPlaybackConfigObject): void {
  const {autoplay, startTime} = config;
  this.configure({
    playback: {
      startTime,
      autoplay
    }
  });
}

function setInitialAttributes(snapshot: PlayerSnapshot): void {
  this.volume = snapshot.volume;
  this.muted = snapshot.muted;
  this.textStyle = snapshot.textStyle;
}

function setInitialTracks(snapshot: PlayerSnapshot): void {
  if (snapshot.audioLanguage) {
    const audioTrack = this.getTracks(TrackType.AUDIO).find(t => t.language === snapshot.audioLanguage);
    this.selectTrack(audioTrack);
  }
  if (snapshot.textLanguage) {
    const textTrack = this.getTracks(TrackType.TEXT).find(t => t.language === snapshot.textLanguage);
    this.selectTrack(textTrack);
  }
}

export {RemoteControl};
