// @flow
import {KalturaPlayer} from '../../kaltura-player';
import {PlayerSnapshot} from './player-snapshot';
import {CastEventType} from './cast-event-type';
import {EventManager, EventType as CoreEventType, FakeEvent, TrackType, Utils} from 'playkit-js';
import {RemoteAvailablePayload, RemoteConnectedPayload, RemoteDisconnectedPayload} from './remote-payload';
import {UIWrapper} from '../ui-wrapper';
import getLogger from '../utils/logger';

const eventManager: EventManager = new EventManager();
const logger: any = getLogger('RemoteControl');

class RemoteControl {
  getPlayerSnapshot: Function;
  onRemoteDeviceDisconnected: Function;
  onRemoteDeviceConnected: Function;
  onRemoteDeviceAvailable: Function;
  onRemoteDeviceConnecting: Function;
  onRemoteDeviceDisconnecting: Function;
  onRemoteDeviceConnectFailed: Function;

  constructor(player: KalturaPlayer) {
    this.getPlayerSnapshot = getPlayerSnapshot.bind(player);
    this.onRemoteDeviceAvailable = onRemoteDeviceAvailable.bind(player);
    this.onRemoteDeviceConnected = onRemoteDeviceConnected.bind(player);
    this.onRemoteDeviceDisconnected = onRemoteDeviceDisconnected.bind(player);
    this.onRemoteDeviceConnecting = onRemoteDeviceConnecting.bind(player);
    this.onRemoteDeviceDisconnecting = onRemoteDeviceDisconnecting.bind(player);
    this.onRemoteDeviceConnectFailed = onRemoteDeviceConnectFailed.bind(player);
  }
}

/**
 * @returns {void}
 */
function onRemoteDeviceConnecting(): void {
  logger.debug('onRemoteDeviceConnecting');
  this.dispatchEvent(new FakeEvent(CastEventType.CAST_SESSION_STARTING));
}

/**
 * @param {RemoteConnectedPayload} payload - connected payload.
 * @returns {void}
 */
function onRemoteDeviceConnected(payload: RemoteConnectedPayload): void {
  logger.debug('onRemoteDeviceConnected', payload);
  const {player, ui, session} = payload;
  Object.values(CoreEventType).forEach(coreEvent => eventManager.listen(player, coreEvent, e => this.dispatchEvent(e)));
  let config = this.config;
  if (ui) {
    Utils.Object.mergeDeep(config, {ui: {customPreset: ui.uis}});
  }
  this._localPlayer.reset();
  this._uiWrapper.destroy();
  this._remotePlayer = player;
  this._uiWrapper = new UIWrapper(this, config);
  this.dispatchEvent(
    new FakeEvent(CastEventType.CAST_SESSION_STARTED, {
      session: session
    })
  );
}

/**
 * @returns {void}
 */
function onRemoteDeviceDisconnecting(): void {
  logger.debug('onRemoteDeviceDisconnecting');
  this.dispatchEvent(new FakeEvent(CastEventType.CAST_SESSION_ENDING));
}

/**
 * @param {RemoteDisconnectedPayload} payload - disconnected payload.
 * @returns {void}
 */
function onRemoteDeviceDisconnected(payload: RemoteDisconnectedPayload): void {
  logger.debug('onRemoteDeviceDisconnected', payload);
  const {player, snapshot} = payload;
  if (this._remotePlayer && this._remotePlayer === player) {
    this.dispatchEvent(new FakeEvent(CastEventType.CAST_SESSION_ENDED));
    this._uiWrapper.destroy();
    this._remotePlayer = null;
    this._uiWrapper = new UIWrapper(this, this.config);
    this._uiWrapper.setConfig({isCastAvailable: this.isCastAvailable()}, 'engine');
    if (snapshot && snapshot.mediaInfo) {
      const mediaInfo = snapshot.mediaInfo;
      const configurePlayer = (config: Object): void => {
        const {autoplay, startTime} = config;
        this.configure({
          playback: {
            startTime,
            autoplay
          }
        });
      };
      const originPlaybackConfig = this.config.playback;
      configurePlayer(snapshot);
      this.loadMedia(mediaInfo).then(() => {
        eventManager.listenOnce(this, this.Event.Core.PLAYBACK_STARTED, () => {
          this.volume = snapshot.volume;
          this.muted = snapshot.muted;
          this.textStyle = snapshot.textStyle;
          if (snapshot.audioLanguage) {
            const audioTrack = this.getTracks(TrackType.AUDIO).find(t => t.language === snapshot.audioLanguage);
            this.selectTrack(audioTrack);
          }
          if (snapshot.textLanguage) {
            const textTrack = this.getTracks(TrackType.TEXT).find(t => t.language === snapshot.textLanguage);
            this.selectTrack(textTrack);
          }
          configurePlayer(originPlaybackConfig);
        });
      });
    }
    eventManager.removeAll();
  }
}

/**
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
 * @returns {void}
 */
function onRemoteDeviceConnectFailed(): void {
  logger.debug('onRemoteDeviceConnectFailed');
  this.dispatchEvent(new FakeEvent(CastEventType.CAST_SESSION_START_FAILED));
}

/**
 * @returns {PlayerSnapshot} - player snapshot.
 */
function getPlayerSnapshot(): PlayerSnapshot {
  const snapshot = new PlayerSnapshot(this);
  logger.debug('getPlayerSnapshot', snapshot);
  return snapshot;
}

export {RemoteControl};
