import { Error, EventManager, FakeEvent, FakeEventTarget, TextStyle, ThumbnailInfo, Track } from '@playkit-js/playkit-js';
import { KalturaPlayerConfig } from './types/kaltura-player-options';
import { UIWrapper } from './common/ui-wrapper';
import { AdsController, ControllerProvider } from './common/controllers';
import { Provider } from '@playkit-js/playkit-js-providers';
import { ProviderMediaInfo } from './types/provider/media-info';
import { BaseRemotePlayer } from './common/cast/base-remote-player';
import { BasePlugin, ConfigEvaluator, PluginManager } from './common/plugins';
import { PluginsConfig } from './types/plugins-config';
import { MediaSourceObject } from './types/media-source';
import { PluginReadinessMiddleware } from './common/plugins/plugin-readiness-middleware';
import { ViewabilityManager } from './common/utils/viewability-manager';
import { ThumbnailManager } from './common/thumbnail-manager';
import { CuePointManager } from './common/cuepoint/cuepoint-manager';
import { ServiceProvider } from './common/service-provider';
import { PlaylistManager } from './common/playlist/playlist-manager';
import { RemotePlayerManager } from './common/cast/remote-player-manager';
import { SourcesConfig } from './types/sources-config';
import { ProviderMediaConfigSources } from './types/provider/provider-media-config';
import { KPMediaConfig } from './types/media-config';
import { ProviderPlaylistInfoObject } from './types/provider/playlist-info';
import { ProviderPlaylistObject } from './types/provider/provider-playlist-config';
import { ProviderEntryListObject } from './types/provider/entry-list';
import { PlaylistConfigObject } from './types/playlist/playlist- config-object';
import { DrmDataObject } from './types/drm-data';
import { MetadataConfig } from './types/metadata-config';
import { RemoteSession } from './common/cast/remote-session';
import { PlayerDimensions } from './types/dimensions-config';
import { HEVCConfigObject, MediaCapabilitiesObject } from './types/media-capabilities';
import { KPEventTypes } from './types/events/event-types';
export declare class KalturaPlayer extends FakeEventTarget {
  static _logger: any;
  _localPlayer: any;
  _provider: any;
  _uiWrapper: UIWrapper;
  _controllerProvider: ControllerProvider;
  _adsController: AdsController | undefined;
  _eventManager: EventManager;
  _attachEventManager: EventManager;
  private _playlistManager;
  private _remotePlayerManager;
  _mediaInfo: ProviderMediaInfo;
  _remotePlayer: BaseRemotePlayer;
  _pluginManager: PluginManager;
  _pluginsConfig: PluginsConfig;
  _reset: boolean;
  _firstPlay: boolean;
  _sourceSelected: MediaSourceObject;
  _pluginReadinessMiddleware: PluginReadinessMiddleware;
  _configEvaluator: ConfigEvaluator;
  _appPluginConfig: PluginsConfig;
  _viewabilityManager: ViewabilityManager;
  _playbackStart: boolean;
  _thumbnailManager: ThumbnailManager | null;
  _cuepointManager: CuePointManager;
  _serviceProvider: ServiceProvider;
  _isVisible: boolean;
  _autoPaused: boolean;
  constructor(options: KalturaPlayerConfig);
  loadMedia(mediaInfo: ProviderMediaInfo, mediaOptions?: SourcesConfig): Promise<any>;
  setMedia(mediaConfig: KPMediaConfig): void;
  loadPlaylist(playlistInfo: ProviderPlaylistInfoObject, playlistConfig: PlaylistConfigObject): Promise<ProviderPlaylistObject>;
  loadPlaylistByEntryList(entryList: ProviderEntryListObject, playlistConfig: PlaylistConfigObject): Promise<ProviderPlaylistObject>;
  setPlaylist(playlistData: ProviderPlaylistObject, playlistConfig: PlaylistConfigObject, entryList: ProviderEntryListObject): void;
  configure(config?: Partial<KalturaPlayerConfig>): void;
  updateKalturaPoster(playerSources: SourcesConfig, mediaSources: ProviderMediaConfigSources, dimensions: PlayerDimensions): void;
  shouldAddKs(mediaConfig?: KPMediaConfig): boolean;
  getMediaInfo(): ProviderMediaInfo;
  getDrmInfo(): DrmDataObject;
  getMediaConfig(): KPMediaConfig;
  setSourcesMetadata(sourcesMetadata: MetadataConfig): void;
  ready(): Promise<void>;
  load(): void;
  play(): void;
  pause(): void;
  getView(): HTMLElement;
  getVideoElement(): HTMLVideoElement;
  reset(isChangeMedia?: boolean): void;
  destroy(): void;
  isLive(): boolean;
  isOnLiveEdge(): boolean;
  isDvr(): boolean;
  isUntimedImg(): boolean;
  isImage(): boolean;
  isAudio(): boolean;
  seekToLiveEdge(): void;
  getStartTimeOfDvrWindow(): number;
  getTracks(type?: string): Array<Track>;
  getActiveTracks(): Object;
  selectTrack(track: Track): void;
  hideTextTrack(): void;
  showTextTrack(): void;
  enableAdaptiveBitrate(): void;
  isAdaptiveBitrateEnabled(): boolean;
  setTextDisplaySettings(settings: Object): void;
  get textDisplaySetting(): Object;
  isFullscreen(): boolean;
  notifyEnterFullscreen(): void;
  notifyExitFullscreen(): void;
  enterFullscreen(fullScreenElementId?: string): void;
  exitFullscreen(): void;
  enterPictureInPicture(): void;
  exitPictureInPicture(): void;
  isInPictureInPicture(): boolean;
  isPictureInPictureSupported(): boolean;
  getLogLevel(name?: string): Object;
  startCasting(type: string): Promise<void>;
  setIsCastInitiator(type: string, isCastInitiator: boolean): void;
  isCastAvailable(type?: string): boolean;
  getCastSession(): RemoteSession | null;
  stopCasting(): void;
  isCasting(): boolean;
  isVr(): boolean;
  toggleVrStereoMode(): void;
  isInVrStereoMode(): boolean;
  setLogLevel(level: Object, name?: string): void;
  getThumbnail(time?: number): ThumbnailInfo | null;
  set textStyle(style: TextStyle);
  get textStyle(): TextStyle;
  get buffered(): TimeRanges;
  get stats(): any;
  set currentTime(to: number);
  get currentTime(): number;
  get duration(): number;
  get liveDuration(): number;
  /**
   * In VOD playback this setter is like the regular `currentTime` setter.
   * In live playback this setter normalizes the seek point to be relative to the start of the DVR window.
   * This setter is useful to display a seekbar presents the available seek range only.
   * @param {Number} to - The number to set in seconds (from 0 to the normalized duration).
   */
  set normalizedCurrentTime(to: number);
  /**
   * In VOD playback this getter is like the regular `currentTime` getter.
   * In live playback this getter normalizes the current time to be relative to the start of the DVR window.
   * This getter is useful to display a seekbar presents the available seek range only.
   */
  get normalizedCurrentTime(): number;
  /**
   * In VOD playback this getter is like the regular `duration` getter.
   * In live playback this getter normalizes the duration to be relative to the start of the DVR window.
   * This getter is useful to display a seekbar presents the available seek range only.
   */
  get normalizedDuration(): number;
  set volume(vol: number);
  get volume(): number;
  get paused(): boolean;
  get seeking(): boolean;
  set playsinline(playsinline: boolean);
  get playsinline(): boolean;
  set muted(mute: boolean);
  get muted(): boolean;
  get src(): string;
  get videoHeight(): number | undefined;
  get videoWidth(): number | undefined;
  set dimensions(dimensions: PlayerDimensions);
  get dimensions(): PlayerDimensions;
  get poster(): string;
  get ended(): boolean;
  set playbackRate(rate: number);
  get playbackRate(): number;
  get playbackRates(): Array<number>;
  get defaultPlaybackRate(): number;
  get engineType(): string;
  get streamType(): string;
  get env(): Object;
  get selectedSource(): MediaSourceObject;
  get sources(): SourcesConfig;
  get config(): KalturaPlayerConfig;
  get hasUserInteracted(): boolean;
  set loadingMedia(loading: boolean);
  get ads(): AdsController | undefined;
  get plugins(): {
    [name: string]: BasePlugin;
  };
  get provider(): Provider;
  get ui(): UIWrapper;
  /**
   * The playlist controller.
   * @type {PlaylistManager}
   * @instance
   * @memberof KalturaPlayer
   * @example
   * KalturaPlayer.playlist.playNext();
   */
  get playlist(): PlaylistManager;
  get Event(): KPEventTypes;
  get TextStyle(): typeof TextStyle;
  get ViewabilityType(): {
    [type: string]: string;
  };
  get State(): any;
  get Track(): any;
  get LogLevelType(): any;
  get LogLevel(): any;
  get AbrMode(): any;
  get MediaType(): any;
  get StreamType(): any;
  get EngineType(): any;
  get Error(): typeof Error;
  _addBindings(): void;
  _onChangeSourceEnded(): void;
  _onPlayerReset(): void;
  _onChangeSourceStarted(): void;
  _onEnded(): void;
  _onPlaybackEnded(): void;
  _onAdStarted(): void;
  _onAdAutoplayFailed(event: FakeEvent): void;
  _configureOrLoadPlugins(pluginsConfig?: Object): void;
  _maybeCreateAdsController(): void;
  attachMediaSource(): void;
  detachMediaSource(): void;
  _resetProviderPluginsConfig(): void;
  /**
   * Set crossOrigin attribute.
   * @param {?string} crossOrigin - 'anonymous', 'use-credentials' or null to remove attribute
   * anonymous: CORS requests for this element will not have the credentials flag set.
   * use-credentials: CORS requests for this element will have the credentials flag set; this means the request will provide credentials.
   */
  set crossOrigin(crossOrigin: string);
  /**
   * Get crossOrigin attribute.
   * @returns {?string} - 'anonymous' or 'use-credentials'
   */
  get crossOrigin(): string;
  /**
   * Gets the player visibility state
   * @returns {boolean} - whether the player is in the active browser tab and visible in the view port
   * @public
   */
  get isVisible(): boolean;
  /**
   * Gets the player viewability manager service
   * @returns {ViewabilityManager} - player viewability manager
   * @public
   */
  get viewabilityManager(): ViewabilityManager;
  _handleVisibilityChange(visible: boolean): void;
  _handleAutoPause(visible: boolean): void;
  /**
   * Gets a registered service of that name
   * @param {string} name - the service name
   * @returns {Object} - the service object
   */
  getService(name: string): Object | void;
  /**
   * Checks if a service of that name has been registered
   * @param {string} name - the service name
   * @returns {boolean} - if the service exist
   */
  hasService(name: string): boolean;
  /**
   * Registers a service to be used across the player
   * @param {string} name - the service name
   * @param {Object} service - the service object
   * @returns {void}
   */
  registerService(name: string, service: Object): void;
  get cuePointManager(): CuePointManager;
  /**
   * Add text track
   * @function addTextTrack
   * @param {string} kind - Specifies the kind of text track.
   * @param {?string} label - A string specifying the label for the text track.
   * @returns {?TextTrack} - A TextTrack Object, which represents the new text track.
   * @public
   */
  addTextTrack(kind: string, label?: string): TextTrack;
  /**
   * get the native text tracks
   * @function getNativeTextTracks
   * @returns {Array<TextTrack>} - The native TextTracks array.
   * @public
   */
  getNativeTextTracks(): Array<TextTrack>;
  get remotePlayerManager(): RemotePlayerManager;
  /**
   * get the media capabilities
   * @function getMediaCapabilities
   * @param {HEVCConfigObject} hevcConfig - The HEVC configuration to check (optional).
   * @returns {Promise<MediaCapabilitiesObject>} - The media capabilities object.
   * @public
   */
  getMediaCapabilities(hevcConfig?: HEVCConfigObject): Promise<MediaCapabilitiesObject>;
}
//# sourceMappingURL=kaltura-player.d.ts.map
