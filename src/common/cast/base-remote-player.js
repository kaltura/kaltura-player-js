// @flow
/* eslint no-unused-vars: 0 */
import {IRemotePlayer} from './remote-player';
import {EventManager, FakeEventTarget, TextStyle, Track, Utils} from 'playkit-js';
import {RemoteControl} from './remote-control';
import getLogger from '../utils/logger';
import {RemoteSession} from './remote-session';

class BaseRemotePlayer extends FakeEventTarget implements IRemotePlayer {
  static defaultConfig: Object = {};

  static Type: string = 'BaseRemotePlayer';

  static isSupported(): boolean {
    return true;
  }

  _remoteControl: RemoteControl;
  _config: Object;
  _logger: any;
  _eventManager: EventManager;

  constructor(name: string, config: Object, remoteControl: RemoteControl) {
    super();
    this._logger = getLogger(name);
    this._remoteControl = remoteControl;
    this._config = Utils.Object.mergeDeep({}, this.constructor.defaultConfig, config);
    this._eventManager = new EventManager();
    this._logger.debug(`Initialized`);
  }

  loadMedia(mediaInfo: Object): Promise<*> {
    return Promise.resolve();
  }

  setMedia(mediaConfig: Object): void {}

  getMediaInfo(): ?Object {}

  configure(config: Object = {}): void {}

  ready(): Promise<*> {
    return Promise.resolve();
  }

  load(): void {}

  play(): void {}

  pause(): void {}

  reset(): void {}

  destroy(): void {}

  isLive(): boolean {
    return false;
  }

  isDvr(): boolean {
    return false;
  }

  seekToLiveEdge(): void {}

  getStartTimeOfDvrWindow(): number {
    return 0;
  }

  getTracks(type?: string): Array<Track> {
    return [];
  }

  getActiveTracks(): Object {
    return {audio: undefined, video: undefined, text: undefined};
  }

  selectTrack(track: ?Track): void {}

  hideTextTrack(): void {}

  enableAdaptiveBitrate(): void {}

  isAdaptiveBitrateEnabled(): boolean {
    return true;
  }

  setTextDisplaySettings(settings: Object): void {}

  skipAd(): void {}

  playAdNow(adTagUrl: string): void {}

  startCasting(): void {}

  stopCasting(): void {}

  isCasting(): boolean {
    return true;
  }

  isCastAvailable(): boolean {
    return true;
  }

  getCastSession(): RemoteSession {
    return new RemoteSession();
  }

  isVr(): boolean {
    return false;
  }

  toggleVrStereoMode(): void {}

  isInVrStereoMode(): boolean {
    return false;
  }

  set textStyle(style: TextStyle): void {}

  get textStyle(): TextStyle {
    return new TextStyle();
  }

  get buffered(): Array<any> {
    return [];
  }

  set currentTime(to: number): void {}

  get currentTime(): number {
    return 0;
  }

  get duration(): number {
    return 0;
  }

  set volume(vol: number): void {}

  get volume(): number {
    return 1;
  }

  get paused(): boolean {
    return false;
  }

  get ended(): boolean {
    return false;
  }

  get seeking(): boolean {
    return false;
  }

  set muted(mute: boolean): void {}

  get muted(): boolean {
    return false;
  }

  get src(): string {
    return '';
  }

  get poster(): string {
    return '';
  }

  set playbackRate(rate: number): void {}

  get playbackRate(): number {
    return 1;
  }

  get engineType(): string {
    return '';
  }

  get streamType(): string {
    return '';
  }

  get config(): Object {
    return this._config;
  }

  get type(): string {
    return BaseRemotePlayer.Type;
  }
}

export {BaseRemotePlayer};
