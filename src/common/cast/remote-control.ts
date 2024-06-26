import { EventType as CoreEventType, FakeEvent, loadPlayer, TrackType, Utils, getLogger } from '@playkit-js/playkit-js';
import { KalturaPlayer } from '../../kaltura-player';
import { PlayerSnapshot } from './player-snapshot';
import { CastEventType } from './cast-event-type';
import { RemoteAvailablePayload, RemoteConnectedPayload, RemoteDisconnectedPayload } from './remote-payload';
import { UIWrapper } from '../ui-wrapper';
import { SourcesConfig, PlaybackConfig } from '../../types';

/**
 * @class RemoteControl
 * @param {KalturaPlayer} player - The Kaltura player.
 */
class RemoteControl {
  public static _logger: any = getLogger('RemoteControl');
  /**
   * Gets the player snapshot.
   * @returns {PlayerSnapshot} - player snapshot.
   * @memberof RemoteControl
   * @instance
   */
  public getPlayerSnapshot: () => void;
  /**
   * Gets the UI wrapper.
   * @returns {UIWrapper} - The UI wrapper.
   * @memberof RemoteControl
   * @instance
   */
  public getUIWrapper: () => void;
  /**
   * On remote device disconnected handler.
   * @param {RemoteDisconnectedPayload} payload - disconnected payload.
   * @returns {void}
   * @memberof RemoteControl
   * @instance
   */
  public onRemoteDeviceDisconnected: () => void;
  /**
   * On remote device connected handler.
   * @param {RemoteConnectedPayload} payload - connected payload.
   * @returns {void}
   * @memberof RemoteControl
   * @instance
   */
  public onRemoteDeviceConnected: () => void;
  /**
   * On remote device available handler.
   * @param {RemoteAvailablePayload} payload - available payload.
   * @returns {void}
   * @memberof RemoteControl
   * @instance
   */
  public onRemoteDeviceAvailable: () => void;
  /**
   * On remote device connecting handler.
   * @returns {void}
   * @memberof RemoteControl
   * @instance
   * @fires CastEventType:CAST_SESSION_STARTING
   */
  public onRemoteDeviceConnecting: () => void;
  /**
   * On remote device disconnecting handler.
   * @returns {void}
   * @memberof RemoteControl
   * @instance
   */
  public onRemoteDeviceDisconnecting: () => void;
  /**
   * On remote device connect failed handler.
   * @returns {void}
   * @memberof RemoteControl
   * @instance
   */
  public onRemoteDeviceConnectFailed: () => void;

  /**
   * Gets the player source selected.
   * @returns {object} - player source.
   * @memberof RemoteControl
   * @instance
   */
  public getPlayerSelectedSource: () => void;

  constructor(player: KalturaPlayer) {
    this.getPlayerSnapshot = getPlayerSnapshot.bind(player);
    this.getUIWrapper = getUIWrapper.bind(player);
    this.onRemoteDeviceAvailable = onRemoteDeviceAvailable.bind(player);
    this.onRemoteDeviceConnected = onRemoteDeviceConnected.bind(player);
    this.onRemoteDeviceDisconnected = onRemoteDeviceDisconnected.bind(player);
    this.onRemoteDeviceConnecting = onRemoteDeviceConnecting.bind(player);
    this.onRemoteDeviceDisconnecting = onRemoteDeviceDisconnecting.bind(player);
    this.onRemoteDeviceConnectFailed = onRemoteDeviceConnectFailed.bind(player);
    this.getPlayerSelectedSource = getPlayerSelectedSource.bind(player);
  }
}

function onRemoteDeviceConnecting(): void {
  RemoteControl._logger.debug('onRemoteDeviceConnecting');
  this.dispatchEvent(new FakeEvent(CastEventType.CAST_SESSION_STARTING));
}

function onRemoteDeviceConnected(payload: RemoteConnectedPayload): void {
  RemoteControl._logger.debug('onRemoteDeviceConnected', payload);
  const { player, ui, session } = payload;
  // After remote player is connected, clean all listeners and bounce the remote player events forward
  this._eventManager.removeAll();
  Object.values(CoreEventType).forEach((coreEvent) => this._eventManager.listen(player, coreEvent, (e) => this.dispatchEvent(e)));
  // Use the current config with the remote player presets on the new ui wrapper
  const config = this.config;
  if (ui) {
    Utils.Object.mergeDeep(config, { ui: { customPreset: ui.uis } });
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
  RemoteControl._logger.debug('onRemoteDeviceDisconnecting');
  this.dispatchEvent(new FakeEvent(CastEventType.CAST_SESSION_ENDING));
}

function onRemoteDeviceDisconnected(payload: RemoteDisconnectedPayload): void {
  RemoteControl._logger.debug('onRemoteDeviceDisconnected', payload);
  const { player, snapshot } = payload;
  if (this._remotePlayer && this._remotePlayer === player) {
    // After remote player is disconnected, clean all listeners and bounce the remote player events forward
    this._eventManager.removeAll();
    reconstructPlayerComponents.call(this, snapshot);
    if (snapshot) {
      this.dispatchEvent(new FakeEvent(CastEventType.CAST_SESSION_ENDED));
      const originConfig = this.config;
      const shouldPause = !snapshot.config.playback.autoplay;
      const mediaInfo = snapshot.mediaInfo;
      const mediaConfig = snapshot.mediaConfig;
      snapshot.config.playback.autoplay = true;
      configurePlayback.call(this, snapshot.config);
      this._eventManager.listenOnce(this, this.Event.Core.CHANGE_SOURCE_ENDED, () => {
        configureTracks.call(this, snapshot.config.sources);
      });
      let mediaPromise;
      if (mediaInfo) {
        mediaPromise = this.loadMedia(mediaInfo);
      } else if (mediaConfig) {
        mediaPromise = Promise.resolve();
        this.setMedia(mediaConfig);
      }
      mediaPromise &&
        mediaPromise.then(() => {
          this._eventManager.listenOnce(this, this.Event.Core.FIRST_PLAYING, () => {
            this.textStyle = snapshot.textStyle;
            configurePlayback.call(this, originConfig);
            setInitialTracks.call(this, snapshot.config.playback);
            if (shouldPause) {
              this.pause();
            }
          });
        });
    }
  }
}

function onRemoteDeviceAvailable(payload: RemoteAvailablePayload): void {
  RemoteControl._logger.debug('onRemoteDeviceAvailable', payload);
  const { player, available } = payload;
  this.dispatchEvent(
    new FakeEvent(CastEventType.CAST_AVAILABLE, {
      type: player.type,
      available: available
    })
  );
}

function onRemoteDeviceConnectFailed(): void {
  RemoteControl._logger.debug('onRemoteDeviceConnectFailed');
  this.dispatchEvent(new FakeEvent(CastEventType.CAST_SESSION_START_FAILED));
}

function getPlayerSnapshot(): PlayerSnapshot {
  const snapshot = new PlayerSnapshot(this);
  RemoteControl._logger.debug('getPlayerSnapshot', snapshot);
  return snapshot;
}

function getPlayerSelectedSource(): PlayerSnapshot {
  const sourceSelected = this._sourceSelected;
  const sourceUrl = sourceSelected?.url ? sourceSelected.url : window.sessionStorage.getItem('sourceUrl');
  window.sessionStorage.setItem('sourceUrl', sourceUrl);
  RemoteControl._logger.debug('getPlayerSelectedSource', sourceUrl);
  return sourceUrl;
}

function getUIWrapper(): UIWrapper {
  RemoteControl._logger.debug('getUIWrapper');
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
      if (snapshot.config.sources.startTime > 0) {
        const adTagUrl = playerConfig.plugins.ima.adTagUrl;
        imaConfig = {
          adTagUrl: ''
        };
        this._eventManager.listen(this, CoreEventType.FIRST_PLAYING, () => this.configure({ plugins: { ima: { adTagUrl: adTagUrl } } }));
      }
    } else {
      imaConfig = {
        // Needs to wait for engine to create the new ads container
        delayInitUntilSourceSelected: true
      };
    }
    Utils.Object.mergeDeep(playerConfig, { plugins: { ima: imaConfig } });
    // Destroy the local player and load new one
    this._localPlayer.destroy();
    this._remotePlayer = null;
    this._localPlayer = loadPlayer(playerConfig);
  } else {
    this._remotePlayer = null;
  }
  // Listen on the local player events and bounce its events forward
  Object.values(CoreEventType).forEach((coreEvent) => this._eventManager.listen(this._localPlayer, coreEvent, (e) => this.dispatchEvent(e)));
  // Create new ui wrapper with an updated state for the isCastAvailable prop
  this._uiWrapper = new UIWrapper(this, this.config);
  this._uiWrapper.setConfig({ isCastAvailable: this.isCastAvailable() }, 'engine');
}

function configurePlayback(config: any): void {
  const { startTime } = config.sources;
  const { autoplay } = config.playback;
  this.configure({
    sources: {
      startTime
    },
    playback: {
      autoplay
    }
  });
}

function configureTracks(sourcesConfig: SourcesConfig): void {
  if (sourcesConfig.captions?.length) {
    const { captions } = sourcesConfig;
    this.configure({
      sources: {
        captions
      }
    });
  }
}

function setInitialTracks(playbackConfig: PlaybackConfig): void {
  if (playbackConfig.audioLanguage) {
    const audioTrack = this.getTracks(TrackType.AUDIO).find((t) => t.language === playbackConfig.audioLanguage);
    this.selectTrack(audioTrack);
  }
  if (playbackConfig.textLanguage) {
    const textTrack = this.getTracks(TrackType.TEXT).find((t) => t.language === playbackConfig.textLanguage);
    this.selectTrack(textTrack);
  }
}

export { RemoteControl };
