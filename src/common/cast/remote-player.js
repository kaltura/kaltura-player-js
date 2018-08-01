// @flow
import {FakeEvent, TextStyle, Track} from 'playkit-js';
import {RemoteSession} from './remote-session';

export interface IRemotePlayer {
  textStyle: ?TextStyle;
  muted: boolean;
  playbackRate: number;
  volume: number;
  currentTime: number;
  +buffered: Array<any>;
  +duration: number;
  +paused: boolean;
  +seeking: boolean;
  +src: string;
  +poster: string;
  +config: Object;
  +engineType: string;
  +streamType: string;
  +type: string;

  static +Type: string;

  static isSupported(): boolean;

  addEventListener(type: string, listener: Function): void;

  removeEventListener(type: string, listener: Function): void;

  dispatchEvent(event: FakeEvent): void;

  loadMedia(mediaInfo: Object): Promise<*>;

  setMedia(mediaConfig: Object): void;

  getMediaInfo(): ?Object;

  configure(config: Object): void;

  ready(): Promise<*>;

  load(): void;

  play(): void;

  pause(): void;

  reset(): void;

  destroy(): void;

  isLive(): boolean;

  isDvr(): boolean;

  seekToLiveEdge(): void;

  getStartTimeOfDvrWindow(): number;

  getTracks(type?: string): Array<Track>;

  getActiveTracks(): Object;

  selectTrack(track: ?Track): void;

  hideTextTrack(): void;

  enableAdaptiveBitrate(): void;

  isAdaptiveBitrateEnabled(): boolean;

  setTextDisplaySettings(settings: Object): void;

  skipAd(): void;

  playAdNow(adTagUrl: string): void;

  startCasting(): void;

  stopCasting(): void;

  isCasting(): boolean;

  isCastAvailable(): boolean;

  getCastSession(): RemoteSession;

  isVr(): boolean;

  toggleVrStereoMode(): void;

  isInVrStereoMode(): boolean;
}
