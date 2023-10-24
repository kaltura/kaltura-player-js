import { IRemotePlayer } from './remote-player';
import { EventManager, FakeEventTarget, TextStyle, Track, Utils, getLogger } from '@playkit-js/playkit-js';
import { RemoteControl } from './remote-control';
import { RemoteSession } from './remote-session';

/**
 * Basic remote player.
 * Implements the Kaltura Player playback, ads, tracks,vr and cast APIs.
 * Remote players should extend this class and implement the needed API.
 * @class BaseRemotePlayer
 * @param {string} name - Remote player name.
 * @param {Object} config - Cast configuration.
 * @param {RemoteControl} remoteControl - Remote control.
 * @extends {FakeEventTarget}
 * @implements {IRemotePlayer}
 */
// eslint-disable-next-line  @typescript-eslint/ban-ts-comment
// @ts-ignore
class BaseRemotePlayer extends FakeEventTarget implements IRemotePlayer {
  /**
   * Default configuration of the remote player.
   * @static
   * @type {Object}
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.defaultConfig // {}
   */
  private static defaultConfig: any = {};

  /**
   * Remote player type.
   * @static
   * @type {string}
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.Type // 'BaseRemotePlayer'
   */
  private static Type: string = 'BaseRemotePlayer';

  /**
   * @static
   * @returns {boolean} - Whether the remote player is supported in the current environment.
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.isSupported() // true
   */
  public static isSupported(): boolean {
    return true;
  }

  private static _logger: any;
  private _remoteControl: RemoteControl;
  private _playerConfig: any;
  private _castConfig: any;
  private _eventManager: EventManager;
  private _isCastInitiator: boolean = false;

  constructor(name: string, castConfig: any, remoteControl: RemoteControl) {
    super();
    this._playerConfig = {};
    BaseRemotePlayer._logger = getLogger(name);
    this._remoteControl = remoteControl;
    // eslint-disable-next-line  @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._castConfig = Utils.Object.mergeDeep({}, this.constructor.defaultConfig, castConfig);
    this._eventManager = new EventManager();
    BaseRemotePlayer._logger.debug('Initialized');
  }

  /**
   * Loads a media to the receiver application.
   * @param {Object} mediaInfo - The entry media info.
   * @returns {Promise<void>} - Promise to indicate load succeed or failed.
   * @instance
   * @memberof BaseRemotePlayer
   */
  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  public loadMedia(mediaInfo: any): Promise<any> {
    return Promise.resolve();
  }

  /**
   * Sets a media to the remote player..
   * @param {Object} mediaConfig - Media configuration to set.
   * @instance
   * @returns {void}
   * @memberof BaseRemotePlayer
   */
  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  public setMedia(mediaConfig: any): void {}

  /**
   * Gets the media Info.
   * @returns {?Object} - The media info.
   * @instance
   * @memberof BaseRemotePlayer
   */
  public getMediaInfo(): any {}

  /**
   * Gets the media config.
   * @returns {?Object} - The media config.
   * @instance
   * @memberof BaseRemotePlayer
   */
  public getMediaConfig(): any {}

  /**
   * Configure the remote player
   * @param {Object} config - Configuration to set.
   * @instance
   * @returns {void}
   * @memberof BaseRemotePlayer
   */
  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  public configure(config: any = {}): void {}

  /**
   * The remote player readiness.
   * @returns {Promise<any>} - Promise which resolved when the remote player is ready.
   * @instance
   * @memberof BaseRemotePlayer
   */
  public ready(): Promise<any> {
    return Promise.resolve();
  }

  /**
   * Load the remote player.
   * @instance
   * @returns {void}
   * @memberof BaseRemotePlayer
   */
  public load(): void {}

  /**
   * Play/resume the remote player.
   * @instance
   * @returns {void}
   * @memberof BaseRemotePlayer
   */
  public play(): void {}

  /**
   * Pause the remote player.
   * @instance
   * @returns {void}
   * @memberof BaseRemotePlayer
   */
  public pause(): void {}

  /**
   * Reset the remote player.
   * @instance
   * @returns {void}
   * @memberof BaseRemotePlayer
   */
  public reset(): void {}

  /**
   * Destroy the remote player.
   * @instance
   * @returns {void}
   * @memberof BaseRemotePlayer
   */
  public destroy(): void {}

  /**
   * @returns {boolean} - Whether the current playback is a live playback.
   * @instance
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.prototype.isLive() // false
   */
  public isLive(): boolean {
    return false;
  }

  /**
   * @returns {boolean} - Whether the current live playback has DVR window. In case of non-live playback will return false.
   * @instance
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.prototype.isDvr() // false
   */
  public isDvr(): boolean {
    return false;
  }

  /**
   * Seeks to the live edge.
   * @instance
   * @returns {void}
   * @memberof BaseRemotePlayer
   */
  public seekToLiveEdge(): void {}

  /**
   * @returns {number} - The start time of the DVR window.
   * @instance
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.prototype.getStartTimeOfDvrWindow() // 0
   */
  public getStartTimeOfDvrWindow(): number {
    return 0;
  }

  /**
   * @param {string} [type] - Track type.
   * @returns {Array<Track>} - The remote player tracks.
   * @instance
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.prototype.getTracks() // []
   */
  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  public getTracks(type?: string): Array<Track> {
    return [];
  }

  /**
   * @returns {Object} - The remote player active tracks.
   * @instance
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.prototype.getTracks() // {audio: undefined, video: undefined, text: undefined}
   */
  public getActiveTracks(): any {
    return { audio: undefined, video: undefined, text: undefined };
  }

  /**
   * Select a certain track to be active.
   * @param {Track} track - The track to activate.
   * @returns {void}
   * @instance
   * @memberof BaseRemotePlayer
   */
  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  public selectTrack(track: Track): void {}

  /**
   * Hides the active text track.
   * @returns {void}
   * @instance
   * @memberof BaseRemotePlayer
   */
  public hideTextTrack(): void {}

  /**
   * @function enableAdaptiveBitrate
   * @description Enables automatic adaptive bitrate switching.
   * @returns {void}
   * @instance
   * @memberof BaseRemotePlayer
   */
  public enableAdaptiveBitrate(): void {}

  /**
   * @function isAdaptiveBitrateEnabled
   * @returns {boolean} - Whether adaptive bitrate is enabled.
   * @instance
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.prototype.isAdaptiveBitrateEnabled() // true
   */
  public isAdaptiveBitrateEnabled(): boolean {
    return true;
  }

  /**
   * Sets the text display settings.
   * @function setTextDisplaySettings
   * @param {Object} settings - Text settings.
   * @instance
   * @memberof BaseRemotePlayer
   * @returns {void}
   */
  // eslint-disable-next-line  @typescript-eslint/no-unused-vars
  public setTextDisplaySettings(settings: any): void {}

  /**
   * Start casting.
   * @returns {Promise<any>} - A promise to indicate session is starting, or failed
   * @instance
   * @memberof BaseRemotePlayer
   */
  public startCasting(): Promise<void> {
    return Promise.reject('startCasting method was not overridden');
  }

  /**
   * Stops the current cast session.
   * @returns {void}
   * @instance
   * @memberof BaseRemotePlayer
   */
  public stopCasting(): void {}

  /**
   * @returns {boolean} - Whether casting is currently active.
   * @instance
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.prototype.isCasting() // true
   */
  public isCasting(): boolean {
    return true;
  }

  /**
   * @returns {boolean} - Whether casting is available.
   * @instance
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.prototype.isCastAvailable() // true
   */
  public isCastAvailable(): boolean {
    return true;
  }

  /**
   * Gets the current remote session.
   * @returns {RemoteSession} - The remote session.
   * @instance
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.prototype.getCastSession() // new RemoteSession('', '')
   */
  public getCastSession(): RemoteSession {
    return new RemoteSession('', '');
  }

  /**
   * @returns {boolean} - Whether the current media is of VR type (360 content).
   * @instance
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.prototype.isVr() // false
   */
  public isVr(): boolean {
    return false;
  }

  /**
   * Toggles VR mode on the current content.
   * @instance
   * @returns {void}
   * @memberof BaseRemotePlayer
   */
  public toggleVrStereoMode(): void {}

  /**
   * @returns {boolean} - Whether the current content displayed in VR mode.
   * @instance
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.prototype.isInVrStereoMode() // false
   */
  public isInVrStereoMode(): boolean {
    return false;
  }

  /**
   * The remote player ads controller.
   * @type {?Object}
   * @instance
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.prototype.ads // null
   */
  public get ads(): any {
    return null;
  }

  /**
   * Setter.
   * @param {TextStyle} style - The text style to set.
   * @returns {void}
   * @instance
   * @memberof BaseRemotePlayer
   */
  public set textStyle(style: TextStyle) {}

  /**
   * Getter.
   * @returns {TextStyle} - The current text style.
   * @instance
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.prototype.textStyle // new TextStyle()
   */
  public get textStyle(): TextStyle {
    return new TextStyle();
  }

  /**
   * Gets the first buffered range of the remote player.
   * @returns {Array<any>} - First buffered range in seconds.
   * @public
   * @instance
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.prototype.buffered // []
   */
  public get buffered(): Array<any> {
    return [];
  }

  /**
   * Setter.
   * @param {number} to - The number to set in seconds.
   * @returns {void}
   * @instance
   * @memberof BaseRemotePlayer
   */
  public set currentTime(to: number) {}

  /**
   * Getter.
   * @returns {number} - The current time in seconds.
   * @instance
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.prototype.currentTime // 0
   */
  public get currentTime(): number {
    return 0;
  }

  /**
   * @returns {number} - The duration in seconds.
   * @instance
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.prototype.duration // 0
   */
  public get duration(): number {
    return 0;
  }

  /**
   * @returns {number} - The live duration in seconds.
   * @instance
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.prototype.liveDuration // NaN
   */
  public get liveDuration(): number {
    return NaN;
  }

  /**
   * Setter.
   * @param {number} vol - The volume to set in the range of 0-1.
   * @returns {void}
   * @instance
   * @memberof BaseRemotePlayer
   */
  public set volume(vol: number) {}

  /**
   * Getter.
   * @returns {number} - The current volume in the range of 0-1.
   * @instance
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.prototype.volume // 1
   */
  public get volume(): number {
    return 1;
  }

  /**
   * @returns {boolean} - Whether the cast player is in paused state.
   * @instance
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.prototype.paused // false
   */
  public get paused(): boolean {
    return false;
  }

  /**
   * @returns {boolean} - Whether the cast player is in ended state.
   * @instance
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.prototype.ended // false
   */
  public get ended(): boolean {
    return false;
  }

  /**
   * @returns {boolean} - Whether the cast player is in seeking state.
   * @instance
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.prototype.seeking // false
   */
  public get seeking(): boolean {
    return false;
  }

  /**
   * Setter.
   * @param {boolean} mute - The mute value to set.
   * @returns {void}
   * @instance
   * @memberof BaseRemotePlayer
   */
  public set muted(mute: boolean) {}

  /**
   * Getter.
   * @returns {boolean} - The muted state.
   * @instance
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.prototype.muted // false
   */
  public get muted(): boolean {
    return false;
  }

  /**
   * @returns {string} - The current playing source url.
   * @instance
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.prototype.src // ''
   */
  public get src(): string {
    return '';
  }

  /**
   * @returns {string} - The current poster url.
   * @instance
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.prototype.poster // ''
   */
  public get poster(): string {
    return '';
  }

  /**
   * Setter.
   * @param {number} rate - The playback rate to set.
   * @instance
   * @memberof BaseRemotePlayer
   */
  public set playbackRate(rate: number) {}

  /**
   * @returns {string} - The current playback rate.
   * @instance
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.prototype.playbackRate // 1
   */
  public get playbackRate(): number {
    return 1;
  }

  /**
   * @returns {string} - The active engine type.
   * @instance
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.prototype.engineType // ''
   */
  public get engineType(): string {
    return '';
  }

  /**
   * @returns {string} - The active stream type.
   * @instance
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.prototype.streamType // ''
   */
  public get streamType(): string {
    return '';
  }

  /**
   * @returns {string} - The remote player type.
   * @instance
   * @memberof BaseRemotePlayer
   * @example
   * BaseRemotePlayer.prototype.type // BaseRemotePlayer.Type
   */
  public get type(): string {
    return BaseRemotePlayer.Type;
  }

  /**
   * @returns {KPOptionsObject} - The runtime remote player config.
   * @instance
   * @memberof BaseRemotePlayer
   */
  public get config(): any {
    return this._playerConfig;
  }

  public set isCastInitiator(isCastInitiator: boolean) {
    this._isCastInitiator = isCastInitiator;
  }

  public get isCastInitiator(): boolean {
    return this._isCastInitiator;
  }
}

export { BaseRemotePlayer };
