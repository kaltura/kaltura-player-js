import { FakeEvent, TextStyle, Track } from '@playkit-js/playkit-js';
import { ProviderMediaInfoObject } from '@playkit-js/playkit-js-providers/types';
import { RemoteSession } from './remote-session';
import { KPMediaConfig } from '../../types';

/**
 * @interface IRemotePlayer
 *
 */
export interface IRemotePlayer {
  /**
   * @type {TextStyle}
   * @instance
   * @memberof IRemotePlayer
   */
  textStyle: TextStyle;
  /**
   * @type {boolean}
   * @instance
   * @memberof IRemotePlayer
   */
  muted: boolean;
  /**
   * @type {number}
   * @instance
   * @memberof IRemotePlayer
   */
  playbackRate: number;
  /**
   * @type {number}
   * @instance
   * @memberof IRemotePlayer
   */
  volume: number;
  /**
   * @type {number}
   * @instance
   * @memberof IRemotePlayer
   */
  currentTime: number;
  /**
   * @readonly
   * @type {number}
   * @instance
   * @memberof IRemotePlayer
   */
  buffered: Array<any>;
  /**
   * @readonly
   * @type {number}
   * @instance
   * @memberof IRemotePlayer
   */
  duration: number;
  /**
   * @readonly
   * @type {number}
   * @instance
   * @memberof IRemotePlayer
   */
  liveDuration: number;
  /**
   * @readonly
   * @type {boolean}
   * @instance
   * @memberof IRemotePlayer
   */
  paused: boolean;
  /**
   * @readonly
   * @type {boolean}
   * @instance
   * @memberof IRemotePlayer
   */
  ended: boolean;
  /**
   * @readonly
   * @type {boolean}
   * @instance
   * @memberof IRemotePlayer
   */
  seeking: boolean;
  /**
   * @readonly
   * @type {string}
   * @instance
   * @memberof IRemotePlayer
   */
  src: string;
  /**
   * @readonly
   * @type {string}
   * @instance
   * @memberof IRemotePlayer
   */
  poster: string;
  /**
   * @readonly
   * @type {string}
   * @instance
   * @memberof IRemotePlayer
   */
  engineType: string;
  /**
   * @readonly
   * @type {string}
   * @instance
   * @memberof IRemotePlayer
   */
  streamType: string;
  /**
   * @readonly
   * @type {string}
   * @instance
   * @memberof IRemotePlayer
   */
  type: string;
  /**
   * @readonly
   * @type {Object}
   * @memberof IRemotePlayer
   * @instance
   */
  ads: any;
  /**
   * @readonly
   * @type {KPOptionsObject}
   * @instance
   * @memberof IRemotePlayer
   */
  config: any;

  /**
   * @method
   * @param {string} type
   * @param {Function} listener
   * @instance
   * @memberof IRemotePlayer
   */
  addEventListener(type: string, listener: () => any): void;

  /**
   * @method
   * @param {string} type
   * @param {Function} listener
   * @instance
   * @memberof IRemotePlayer
   */
  removeEventListener(type: string, listener: () => any): void;

  /**
   * @method
   * @param {FakeEvent} event
   * @instance
   * @memberof IRemotePlayer
   */
  dispatchEvent(event: FakeEvent): void;

  /**
   * @method
   * @param {Object} mediaInfo
   * @instance
   * @memberof IRemotePlayer
   */
  loadMedia(mediaInfo: any): Promise<any>;

  /**
   * @method
   * @param {Object} mediaConfig
   * @instance
   * @memberof IRemotePlayer
   */
  setMedia(mediaConfig: any): void;

  /**
   * @method
   * @returns {Object}
   * @instance
   * @memberof IRemotePlayer
   */
  getMediaInfo(): ProviderMediaInfoObject;

  /**
   * @method
   * @returns {Object}
   * @instance
   * @memberof IRemotePlayer
   */
  getMediaConfig(): KPMediaConfig;

  /**
   * @method
   * @param {Object} config
   * @instance
   * @memberof IRemotePlayer
   */
  configure(config: any): void;

  /**
   * @method
   * @returns {Promise<any>}
   * @instance
   * @memberof IRemotePlayer
   */
  ready(): Promise<any>;

  /**
   * @method
   * @instance
   * @memberof IRemotePlayer
   */
  load(): void;

  /**
   * @method
   * @instance
   * @memberof IRemotePlayer
   */
  play(): void;

  /**
   * @method
   * @instance
   * @memberof IRemotePlayer
   */
  pause(): void;

  /**
   * @method
   * @instance
   * @memberof IRemotePlayer
   */
  reset(): void;

  /**
   * @method
   * @instance
   * @memberof IRemotePlayer
   */
  destroy(): void;

  /**
   * @method
   * @returns {boolean}
   * @instance
   * @memberof IRemotePlayer
   */
  isLive(): boolean;

  /**
   * @method
   * @returns {boolean}
   * @instance
   * @memberof IRemotePlayer
   */
  isDvr(): boolean;

  /**
   * @method
   * @instance
   * @memberof IRemotePlayer
   */
  seekToLiveEdge(): void;

  /**
   * @method
   * @returns {number}
   * @instance
   * @memberof IRemotePlayer
   */
  getStartTimeOfDvrWindow(): number;

  /**
   * @method
   * @param {string} [type]
   * @returns {Array<Track>}
   * @instance
   * @memberof IRemotePlayer
   */
  getTracks(type?: string): Array<Track>;

  /**
   * @method
   * @returns {Object}
   * @instance
   * @memberof IRemotePlayer
   */
  getActiveTracks(): any;

  /**
   * @method
   * @param {Track} track
   * @instance
   * @memberof IRemotePlayer
   */
  selectTrack(track: Track): void;

  /**
   * @method
   * @instance
   * @memberof IRemotePlayer
   */
  hideTextTrack(): void;

  /**
   * @method
   * @instance
   * @memberof IRemotePlayer
   */
  enableAdaptiveBitrate(): void;

  /**
   * @method
   * @returns {boolean}
   * @instance
   * @memberof IRemotePlayer
   */
  isAdaptiveBitrateEnabled(): boolean;

  /**
   * @method
   * @param {Object} settings
   * @instance
   * @memberof IRemotePlayer
   */
  setTextDisplaySettings(settings: any): void;

  /**
   * @method
   * @instance
   * @memberof IRemotePlayer
   */
  startCasting(): void;

  /**
   * @method
   * @instance
   * @memberof IRemotePlayer
   */
  stopCasting(): void;

  /**
   * @method
   * @returns {boolean}
   * @instance
   * @memberof IRemotePlayer
   */
  isCasting(): boolean;

  /**
   * @method
   * @returns {boolean}
   * @instance
   * @memberof IRemotePlayer
   */
  isCastAvailable(): boolean;

  /**
   * @method
   * @returns {RemoteSession}
   * @instance
   * @memberof IRemotePlayer
   */
  getCastSession(): RemoteSession;

  /**
   * @method
   * @returns {boolean}
   * @instance
   * @memberof IRemotePlayer
   */
  isVr(): boolean;

  /**
   * @method
   * @instance
   * @memberof IRemotePlayer
   */
  toggleVrStereoMode(): void;

  /**
   * @method
   * @returns {boolean}
   * @instance
   * @memberof IRemotePlayer
   */
  isInVrStereoMode(): boolean;
}
