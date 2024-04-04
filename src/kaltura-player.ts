import { EventType as UIEventType } from '@playkit-js/playkit-js-ui';
import {
  AdEventType,
  AutoPlayType,
  Error,
  EventManager,
  EventType as CoreEventType,
  FakeEvent,
  FakeEventTarget,
  getLogger,
  loadPlayer,
  LogLevel,
  TextStyle,
  ThumbnailInfo,
  Track,
  Utils,
  AbrMode,
  MediaType,
  StreamType,
  EngineType,
  EngineDecoratorProvider,
  PKSourcesConfigObject,
  PKMetadataConfigObject,
  PKMediaSourceObject,
  PKDrmDataObject,
  Player,
  IEngineDecoratorProvider,
  TrackTypes,
  PKPlayerDimensions,
  TrackType,
  StateType,
  LoggerLevels
} from '@playkit-js/playkit-js';
import {
  ProviderEntryListObject,
  ProviderMediaConfigObject,
  ProviderMediaConfigSourcesObject,
  ProviderMediaInfoObject,
  ProviderPlaylistInfoObject,
  ProviderPlaylistObject
} from '@playkit-js/playkit-js-providers/types';
import { Provider } from '@playkit-js/playkit-js-providers/ovp-provider';
import { UIWrapper } from './common/ui-wrapper';
import { AdsController, ControllerProvider } from './common/controllers';
import { BaseRemotePlayer } from './common/cast/base-remote-player';
import { BasePlugin, ConfigEvaluator, PluginManager, REGISTERED_PLUGINS_LIST_EVENT } from './common/plugins';
import { PluginReadinessMiddleware } from './common/plugins/plugin-readiness-middleware';
import { ViewabilityManager, ViewabilityType, VISIBILITY_CHANGE } from './common/utils/viewability-manager';
import { ThumbnailManager } from './common/thumbnail-manager';
import { CuePointManager } from './common/cuepoint/cuepoint-manager';
import { ServiceProvider } from './common/service-provider';
import { PlaylistManager } from './common/playlist/playlist-manager';
import { RemotePlayerManager } from './common/cast/remote-player-manager';
import {
  hasImageSource,
  hasDocumentSource,
  hasYoutubeSource,
  maybeSetStreamPriority,
  mergeProviderPluginsConfig,
  supportLegacyOptions
} from './common/utils/setup-helpers';
import { getDefaultRedirectOptions } from 'player-defaults';
import { addKalturaParams } from './common/utils/kaltura-params';
import { addKalturaPoster } from 'poster';
import { RemoteSession } from './common/cast/remote-session';
import getMediaCapabilities from './common/utils/media-capabilities';
import { CastEventType } from './common/cast/cast-event-type';
import { PlaylistEventType } from './common/playlist/playlist-event-type';
import {
  KalturaPlayerConfig,
  PlaylistConfigObject,
  KPMediaConfig,
  PluginsConfig,
  SourcesConfig,
  KPEventTypes,
  HEVCConfigObject,
  MediaCapabilitiesObject
} from './types';

export class KalturaPlayer extends FakeEventTarget {
  private static _logger: any = getLogger('KalturaPlayer' + Utils.Generator.uniqueId(5));
  private _localPlayer: Player;
  private _provider: Provider;
  private _uiWrapper: UIWrapper;
  private _controllerProvider: ControllerProvider;
  private _adsController: AdsController | undefined;
  private _eventManager: EventManager = new EventManager();
  private _attachEventManager!: EventManager;
  private _playlistManager: PlaylistManager;
  private _remotePlayerManager: RemotePlayerManager;
  private _mediaInfo: ProviderMediaInfoObject | null = null;
  public _remotePlayer: BaseRemotePlayer | null = null;
  private _pluginManager: PluginManager = new PluginManager();
  private _pluginsConfig: PluginsConfig = {};
  private _reset: boolean = true;
  private _firstPlay: boolean = true;
  private _sourceSelected: PKMediaSourceObject | null = null;
  private _pluginReadinessMiddleware!: PluginReadinessMiddleware;
  private _configEvaluator: ConfigEvaluator;
  private _appPluginConfig: PluginsConfig = {};
  private _viewabilityManager: ViewabilityManager;
  public _playbackStart: boolean;
  private _thumbnailManager: ThumbnailManager | null = null;
  private _cuepointManager: CuePointManager;
  private _serviceProvider: ServiceProvider;
  private _isVisible: boolean = false;
  private _autoPaused: boolean = false;

  constructor(options: KalturaPlayerConfig) {
    super();
    const { sources, plugins } = options;
    this._configEvaluator = new ConfigEvaluator();
    this._configEvaluator.evaluatePluginsConfig(plugins, options);
    this._playbackStart = false;
    const noSourcesOptions = Utils.Object.mergeDeep({}, options);
    delete noSourcesOptions.plugins;
    delete noSourcesOptions.sources;
    this._localPlayer = loadPlayer(noSourcesOptions);
    this._controllerProvider = new ControllerProvider(this._pluginManager);
    this._viewabilityManager = new ViewabilityManager(this.config.viewability);
    this._uiWrapper = new UIWrapper(
      this,
      Utils.Object.mergeDeep(options, {
        ui: { logger: { getLogger, LogLevel } }
      })
    );
    this._serviceProvider = new ServiceProvider(this);
    this._cuepointManager = new CuePointManager(this);
    this._provider = new Provider(
      Utils.Object.mergeDeep(options.provider, {
        logger: { getLogger, LogLevel }
      }),
      __VERSION__
    );
    this._playlistManager = new PlaylistManager(this, options);
    Object.values(CoreEventType).forEach((coreEvent) => this._eventManager.listen(this._localPlayer, coreEvent, (e) => this.dispatchEvent(e)));

    this._addBindings();
    const playlistConfig = Utils.Object.mergeDeep({}, options.playlist, {
      items: null
    });
    this._playlistManager.configure(playlistConfig);
    this.configure({ plugins });
    //configure sources after configure finished for all components - making sure all we'll set up correctly
    this._playlistManager.configure({
      items: (options.playlist && options.playlist.items) || []
    });
    this._remotePlayerManager = new RemotePlayerManager();
    // "@ts-expect-error - ???
    this._localPlayer.setSources(sources || {});
  }

  public async loadMedia(mediaInfo: ProviderMediaInfoObject, mediaOptions?: SourcesConfig): Promise<any> {
    KalturaPlayer._logger.debug('loadMedia', mediaInfo);
    this._mediaInfo = mediaInfo;
    this.reset();
    this._localPlayer.loadingMedia = true;
    this._uiWrapper.setLoadingSpinnerState(true);
    try {
      const providerMediaConfig: ProviderMediaConfigObject = await this._provider.getMediaConfig(mediaInfo);
      const mediaConfig = Utils.Object.copyDeep(providerMediaConfig);
      if (mediaOptions) {
        mediaConfig.sources = mediaConfig.sources || {};
        mediaConfig.sources = Utils.Object.mergeDeep(mediaConfig.sources, mediaOptions);
      }
      const mergedPluginsConfigAndFromApp = mergeProviderPluginsConfig(mediaConfig.plugins, this.config.plugins);
      mediaConfig.plugins = mergedPluginsConfigAndFromApp[0];
      this._appPluginConfig = mergedPluginsConfigAndFromApp[1];
      this.configure(getDefaultRedirectOptions({ sources: this.sources }, mediaConfig));
      this.setMedia(mediaConfig);
      return mediaConfig;
    } catch (e) {
      const category = this._getErrorCategory(e);
      const error = new Error(Error.Severity.CRITICAL, category, Error.Code.LOAD_FAILED, e);
      this._localPlayer.dispatchEvent(new FakeEvent(CoreEventType.ERROR, error));
      throw e;
    }
  }

  private _getErrorCategory(error: Error): number {
    if (error.category === 2) { // category is Service from provider - BE issue
      if (error.code === 2001) { // block action
        const code = error.data?.messages ? error.data?.messages[0].code : '';
        if (code === 'SESSION_RESTRICTED') {
          return Error.Category.MEDIA_UNAVAILABLE;
        }
        if (code === 'COUNTRY_RESTRICTED') {
          return Error.Category.GEO_LOCATION;
        }
      }
      if (error.code === 2002) { // media is not ready
        return Error.Category.MEDIA_NOT_READY;
      }
    }
    return Error.Category.PLAYER;
  }

  public setMedia(mediaConfig: KPMediaConfig): void {
    KalturaPlayer._logger.debug('setMedia', mediaConfig);
    this.reset(true);
    const playerConfig = Utils.Object.copyDeep(mediaConfig);
    //merge the current sources from player to keep the sources passed from constructor earlier
    const sources = Utils.Object.mergeDeep({}, playerConfig.sources, this._localPlayer.sources);
    if (playerConfig.sources.type === MediaType.VOD && this._localPlayer.sources.mediaEntryType?.toString() === MediaType.LIVE) {
      sources.id = playerConfig.sources.id;
    }
    delete playerConfig.sources;
    Utils.Object.mergeDeep(playerConfig.session, this._localPlayer.config.session);
    playerConfig.plugins = playerConfig.plugins || {};
    Object.keys(this._pluginsConfig).forEach((name) => {
      playerConfig.plugins[name] = playerConfig.plugins[name] || {};
    });
    this.configure({ session: mediaConfig.session });
    if (hasYoutubeSource(sources) || hasImageSource(sources) || hasDocumentSource(sources)) {
      this._thumbnailManager = null;
    } else {
      this._thumbnailManager = new ThumbnailManager(this, this.config.ui, mediaConfig);
    }
    this.updateKalturaPoster(sources, mediaConfig.sources, this._localPlayer.dimensions);
    addKalturaParams(this, { ...playerConfig, sources });
    const playback = maybeSetStreamPriority(this, sources);
    if (playback) {
      playerConfig.playback = playback;
    }
    this.configure({ ...playerConfig, sources });
  }

  public async loadPlaylist(playlistInfo: ProviderPlaylistInfoObject, playlistConfig: PlaylistConfigObject): Promise<ProviderPlaylistObject> {
    KalturaPlayer._logger.debug('loadPlaylist', playlistInfo);
    this._uiWrapper.setLoadingSpinnerState(true);
    try {
      const playlistData = await this._provider.getPlaylistConfig(playlistInfo);

      this.setPlaylist(playlistData, playlistConfig);
      return playlistData;
    } catch (e) {
      const error = new Error(Error.Severity.CRITICAL, Error.Category.PLAYER, Error.Code.LOAD_FAILED, e);
      this._localPlayer.dispatchEvent(new FakeEvent(CoreEventType.ERROR, error));
      throw e;
    }
  }

  public async loadPlaylistByEntryList(entryList: ProviderEntryListObject, playlistConfig: PlaylistConfigObject): Promise<ProviderPlaylistObject> {
    KalturaPlayer._logger.debug('loadPlaylistByEntryList', entryList);
    this._uiWrapper.setLoadingSpinnerState(true);
    try {
      const playlistData = await this._provider.getEntryListConfig(entryList);
      this.setPlaylist(playlistData, playlistConfig, entryList);
      return playlistData;
    } catch (e) {
      const error = new Error(Error.Severity.CRITICAL, Error.Category.PLAYER, Error.Code.LOAD_FAILED, e);
      this._localPlayer.dispatchEvent(new FakeEvent(CoreEventType.ERROR, error));
      throw e;
    }
  }

  public setPlaylist(playlistData: ProviderPlaylistObject, playlistConfig: PlaylistConfigObject, entryList?: ProviderEntryListObject): void {
    KalturaPlayer._logger.debug('setPlaylist', playlistData);
    const config = { playlist: playlistData, plugins: {} };
    Object.keys(this._pluginsConfig).forEach((name) => {
      config.plugins[name] = {};
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._configEvaluator.evaluatePluginsConfig(config.plugins, config);
    this._configureOrLoadPlugins(config.plugins);
    this._playlistManager.load(playlistData, playlistConfig, entryList);
  }

  public configure(config: Partial<KalturaPlayerConfig> = {}): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    config = supportLegacyOptions(config);
    const configDictionary = Utils.Object.mergeDeep({}, this.config, config);
    this._configEvaluator.evaluatePluginsConfig(config.plugins, configDictionary);
    this._configureOrLoadPlugins(config.plugins);
    const localPlayerConfig = Utils.Object.mergeDeep({}, config);
    delete localPlayerConfig.plugins;
    if (localPlayerConfig.sources) {
      const { sources } = localPlayerConfig;
      delete localPlayerConfig.sources;
      this._localPlayer.configure(localPlayerConfig);
      this._localPlayer.setSources(sources || {});
    } else {
      this._localPlayer.configure(localPlayerConfig);
    }
    const uiConfig = config.ui;
    if (uiConfig) {
      this._uiWrapper.setConfig(configDictionary.ui);
    }
    if (config.playlist) {
      this._playlistManager.configure(config.playlist);
    }
  }

  public updateKalturaPoster(
    playerSources: PKSourcesConfigObject,
    mediaSources: ProviderMediaConfigSourcesObject,
    dimensions: PKPlayerDimensions
  ): void {
    addKalturaPoster(playerSources, mediaSources, dimensions, this.shouldAddKs() ? this.config?.session?.ks : '');
  }

  public shouldAddKs(mediaConfig?: KPMediaConfig): boolean {
    return !!(this.config?.provider?.loadThumbnailWithKs && (mediaConfig || this.config)?.session?.isAnonymous === false);
  }

  public getMediaInfo(): ProviderMediaInfoObject {
    return Utils.Object.copyDeep(this._mediaInfo);
  }

  public getDrmInfo(): PKDrmDataObject | null {
    return this._localPlayer.getDrmInfo();
  }

  public getMediaConfig(): KPMediaConfig {
    const mediaConfig = {
      sources: this._localPlayer.sources,
      plugins: this._pluginsConfig
    };
    return Utils.Object.copyDeep(mediaConfig);
  }

  public setSourcesMetadata(sourcesMetadata: PKMetadataConfigObject): void {
    this._localPlayer.setSourcesMetadata(sourcesMetadata);
  }

  public ready(): Promise<void> {
    return this._localPlayer.ready();
  }

  public load(): void {
    this._localPlayer.load();
  }

  public play(): void {
    this._localPlayer.play();
  }

  public pause(): void {
    this._localPlayer.pause();
  }

  public getView(): HTMLElement {
    return this._localPlayer.getView();
  }

  public getVideoElement(): HTMLVideoElement | undefined {
    return this._localPlayer.getVideoElement();
  }

  public reset(isChangeMedia: boolean = false): void {
    if (!this._reset) {
      this._reset = true;
      this._firstPlay = true;
      this._sourceSelected = null;
      if (this._attachEventManager) {
        this._attachEventManager.removeAll();
      }
      this._uiWrapper.reset();
      this._resetProviderPluginsConfig();
      this._pluginManager.reset();
      this._cuepointManager.reset();
      this._localPlayer.reset(isChangeMedia);
      this._thumbnailManager?.destroy();
    }
  }

  public destroy(): void {
    const targetId = this.config.ui.targetId;
    this._reset = true;
    this._playbackStart = false;
    this._firstPlay = true;
    this._uiWrapper.destroy();
    this._pluginManager.destroy();
    this._cuepointManager.destroy();
    this._playlistManager.destroy();
    this._localPlayer.destroy();
    this._eventManager.destroy();
    this._thumbnailManager?.destroy();
    this._viewabilityManager.destroy();
    this._remotePlayerManager.destroy();
    this._pluginsConfig = {};
    const targetContainer = document.getElementById(targetId);
    if (targetContainer && targetContainer.parentNode) {
      Utils.Dom.removeChild(targetContainer.parentNode, targetContainer);
    }
  }

  public isLive(): boolean {
    return this._localPlayer.isLive();
  }

  public isOnLiveEdge(): boolean {
    return this._localPlayer.isOnLiveEdge();
  }

  public isDvr(): boolean {
    return this._localPlayer.isDvr();
  }

  public isUntimedImg(): boolean {
    return hasImageSource(this.sources) && !(typeof this.config.sources.duration === 'number' && this.config.sources.duration > 0);
  }

  public isUntimedDocument(): boolean {
    return hasDocumentSource(this.sources) && !(typeof this.config.sources.duration === 'number' && this.config.sources.duration > 0);
  }

  public isImage(): boolean {
    return hasImageSource(this.sources);
  }

  public isDocument(): boolean {
    return hasDocumentSource(this.sources);
  }

  public isAudio(): boolean {
    return this._localPlayer.isAudio();
  }

  public seekToLiveEdge(): void {
    this._localPlayer.seekToLiveEdge();
  }

  public getStartTimeOfDvrWindow(): number {
    return this._localPlayer.getStartTimeOfDvrWindow();
  }

  public getTracks(type?: TrackTypes): Array<Track> {
    return this._localPlayer.getTracks(type);
  }

  public getActiveTracks(): any {
    return this._localPlayer.getActiveTracks();
  }

  public selectTrack(track: Track): void {
    this._localPlayer.selectTrack(track);
  }

  public hideTextTrack(): void {
    this._localPlayer.hideTextTrack();
  }

  public showTextTrack(): void {
    this._localPlayer.showTextTrack();
  }

  public enableAdaptiveBitrate(): void {
    this._localPlayer.enableAdaptiveBitrate();
  }

  public isAdaptiveBitrateEnabled(): boolean {
    return this._localPlayer.isAdaptiveBitrateEnabled();
  }

  public setTextDisplaySettings(settings: any): void {
    this._localPlayer.setTextDisplaySettings(settings);
  }

  public get textDisplaySetting(): any {
    return this._localPlayer.textDisplaySetting;
  }

  public isFullscreen(): boolean {
    return this._localPlayer.isFullscreen();
  }

  public notifyEnterFullscreen(): void {
    this._localPlayer.notifyEnterFullscreen();
  }

  public notifyExitFullscreen(): void {
    this._localPlayer.notifyExitFullscreen();
  }

  public enterFullscreen(fullScreenElementId?: string): void {
    const elementId = fullScreenElementId ? fullScreenElementId : this.config.ui.targetId;
    this._localPlayer.enterFullscreen(elementId);
  }

  public exitFullscreen(): void {
    this._localPlayer.exitFullscreen();
  }

  public enterPictureInPicture(): void {
    this._localPlayer.enterPictureInPicture();
  }

  public exitPictureInPicture(): void {
    this._localPlayer.exitPictureInPicture();
  }

  public isInPictureInPicture(): boolean {
    return this._localPlayer.isInPictureInPicture();
  }

  public isPictureInPictureSupported(): boolean {
    return this._localPlayer.isPictureInPictureSupported();
  }

  public getLogLevel(name?: string): any {
    return this._localPlayer.getLogLevel(name);
  }

  public startCasting(type: string): Promise<void> {
    this.setIsCastInitiator(type, true);
    return new Promise((resolve, reject) => {
      this.remotePlayerManager
        .startCasting(type)
        .then(resolve)
        .catch(() => {
          this.setIsCastInitiator(type, false);
          reject();
        });
    });
  }

  public setIsCastInitiator(type: string, isCastInitiator: boolean): void {
    this._remotePlayerManager.setIsCastInitiator(type, isCastInitiator);
  }

  public isCastAvailable(type?: string): boolean {
    return this._remotePlayerManager.isCastAvailable(type);
  }

  public getCastSession(): RemoteSession | null {
    return null;
  }

  public stopCasting(): void {}

  public isCasting(): boolean {
    return false;
  }

  public isVr(): boolean {
    return this._localPlayer.isVr();
  }

  public toggleVrStereoMode(): void {
    const vrPlugin: BasePlugin | undefined = this._pluginManager.get('vr');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (vrPlugin && typeof vrPlugin.toggleVrStereoMode === 'function') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      vrPlugin.toggleVrStereoMode();
    }
  }

  public isInVrStereoMode(): boolean {
    const vrPlugin: BasePlugin | undefined = this._pluginManager.get('vr');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (vrPlugin && typeof vrPlugin.isInStereoMode === 'function') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return vrPlugin.isInStereoMode();
    }
    return false;
  }

  public setLogLevel(level: any, name?: string): void {
    this._localPlayer.setLogLevel(level, name);
  }

  public getThumbnail(time?: number): ThumbnailInfo | null {
    if (!time) {
      // If time isn't supplied, return thumbnail for player's current time
      if (!isNaN(this.currentTime!)) {
        time = this.currentTime!;
      } else {
        return null;
      }
    }
    time = this.isLive() ? time! + this.getStartTimeOfDvrWindow() : time;
    if (this._thumbnailManager) {
      return this._thumbnailManager.getThumbnail(time!);
    }
    return null;
  }

  public set textStyle(style: TextStyle) {
    this._localPlayer.textStyle = style;
  }

  public get textStyle(): TextStyle {
    return this._localPlayer.textStyle;
  }

  public get buffered(): TimeRanges | null {
    return this._localPlayer.buffered;
  }

  // TODO - imported from playkit
  public get stats(): any {
    return this._localPlayer.stats;
  }

  public set currentTime(to: number) {
    this._localPlayer.currentTime = to;
  }

  public get currentTime(): number | null {
    return this._localPlayer.currentTime;
  }

  public get duration(): number | null {
    return this._localPlayer.duration;
  }

  public get liveDuration(): number | null {
    return this._localPlayer.liveDuration;
  }

  /**
   * In VOD playback this setter is like the regular `currentTime` setter.
   * In live playback this setter normalizes the seek point to be relative to the start of the DVR window.
   * This setter is useful to display a seekbar presents the available seek range only.
   * @param {Number} to - The number to set in seconds (from 0 to the normalized duration).
   */
  public set normalizedCurrentTime(to: number) {
    this.isLive() ? (this.currentTime = to + this.getStartTimeOfDvrWindow()) : (this.currentTime = to);
  }

  /**
   * In VOD playback this getter is like the regular `currentTime` getter.
   * In live playback this getter normalizes the current time to be relative to the start of the DVR window.
   * This getter is useful to display a seekbar presents the available seek range only.
   */
  public get normalizedCurrentTime(): number | null {
    return this.isLive() ? this.currentTime! - this.getStartTimeOfDvrWindow() : this.currentTime;
  }

  /**
   * In VOD playback this getter is like the regular `duration` getter.
   * In live playback this getter normalizes the duration to be relative to the start of the DVR window.
   * This getter is useful to display a seekbar presents the available seek range only.
   */
  public get normalizedDuration(): number | null {
    return this.isLive() ? this.liveDuration! - this.getStartTimeOfDvrWindow() : this.duration;
  }

  public set volume(vol: number) {
    this._localPlayer.volume = vol;
  }

  public get volume(): number | null {
    return this._localPlayer.volume;
  }

  public get paused(): boolean | null {
    return this._localPlayer.paused;
  }

  public get seeking(): boolean | null {
    return this._localPlayer.seeking;
  }

  public set playsinline(playsinline: boolean) {
    this._localPlayer.playsinline = playsinline;
  }

  public get playsinline(): boolean | null {
    return this._localPlayer.playsinline;
  }

  public set muted(mute: boolean) {
    this._localPlayer.muted = mute;
  }

  public get muted(): boolean | null {
    return this._localPlayer.muted;
  }

  public get src(): string | null {
    return this._localPlayer.src;
  }

  public get videoHeight(): number | null {
    return this._localPlayer.videoHeight;
  }

  public get videoWidth(): number | null {
    return this._localPlayer.videoWidth;
  }

  public set dimensions(dimensions: PKPlayerDimensions) {
    this._localPlayer.dimensions = dimensions;
  }

  public get dimensions(): PKPlayerDimensions {
    return this._localPlayer.dimensions;
  }

  public get poster(): string {
    return this._localPlayer.poster;
  }

  public get ended(): boolean | null {
    return this._localPlayer.ended;
  }

  public set playbackRate(rate: number) {
    this._localPlayer.playbackRate = rate;
  }

  public get playbackRate(): number | null {
    return this._localPlayer.playbackRate;
  }

  public get playbackRates(): Array<number> {
    return this._localPlayer.playbackRates;
  }

  public get defaultPlaybackRate(): number {
    return this._localPlayer.defaultPlaybackRate;
  }

  public get engineType(): string {
    return this._localPlayer.engineType;
  }

  public get streamType(): string {
    return this._localPlayer.streamType;
  }

  public get env(): any {
    return this._localPlayer.env;
  }

  public get selectedSource(): PKMediaSourceObject | null {
    return this._sourceSelected;
  }

  public get sources(): PKSourcesConfigObject {
    return { ...this._localPlayer.sources };
  }

  public get config(): KalturaPlayerConfig {
    return {
      ...this._localPlayer.config,
      plugins: this._pluginsConfig,
      sources: this._localPlayer.sources
    };
  }

  public get hasUserInteracted(): boolean {
    return this._localPlayer.hasUserInteracted;
  }

  public set loadingMedia(loading: boolean) {
    this._localPlayer.loadingMedia = loading;
  }

  public get ads(): AdsController | undefined {
    return this._adsController;
  }

  public get plugins(): { [name: string]: BasePlugin } {
    return this._pluginManager.getAll();
  }

  public get provider(): Provider {
    return this._provider;
  }

  public get ui(): UIWrapper {
    return this._uiWrapper;
  }

  /**
   * The playlist controller.
   * @type {PlaylistManager}
   * @instance
   * @memberof KalturaPlayer
   * @example
   * KalturaPlayer.playlist.playNext();
   */
  public get playlist(): PlaylistManager {
    return this._playlistManager;
  }

  public get Event(): KPEventTypes {
    return {
      Cast: CastEventType,
      Core: CoreEventType,
      Playlist: PlaylistEventType,
      UI: UIEventType,
      VISIBILITY_CHANGE,
      REGISTERED_PLUGINS_LIST_EVENT,
      // For backward compatibility
      ...CoreEventType
    };
  }

  public get TextStyle(): typeof TextStyle {
    return this._localPlayer.TextStyle;
  }

  public get ViewabilityType(): typeof ViewabilityType {
    return ViewabilityType;
  }

  public get State(): typeof StateType {
    return this._localPlayer.State;
  }

  public get Track(): typeof TrackType {
    return this._localPlayer.Track;
  }

  public get LogLevelType(): Record<keyof LoggerLevels, keyof LoggerLevels> {
    return this._localPlayer.LogLevelType;
  }

  public get LogLevel(): LoggerLevels {
    return this._localPlayer.LogLevel;
  }

  public get AbrMode(): typeof AbrMode {
    return this._localPlayer.AbrMode;
  }

  public get MediaType(): typeof MediaType {
    return this._localPlayer.MediaType;
  }

  public get StreamType(): typeof StreamType {
    return this._localPlayer.StreamType;
  }

  public get EngineType(): typeof EngineType {
    return this._localPlayer.EngineType;
  }

  public get Error(): typeof Error {
    return this._localPlayer.Error;
  }

  private _addBindings(): void {
    this._eventManager.listen(this, CoreEventType.CHANGE_SOURCE_STARTED, () => this._onChangeSourceStarted());
    this._eventManager.listen(this, CoreEventType.CHANGE_SOURCE_ENDED, () => this._onChangeSourceEnded());
    this._eventManager.listen(this, CoreEventType.PLAYER_RESET, () => this._onPlayerReset());
    this._eventManager.listen(this, CoreEventType.ENDED, () => this._onEnded());
    this._eventManager.listen(this, CoreEventType.FIRST_PLAY, () => (this._firstPlay = false));
    this._eventManager.listen(this, CoreEventType.SOURCE_SELECTED, (event: FakeEvent) => (this._sourceSelected = event.payload.selectedSource[0]));
    this._eventManager.listen(this, CoreEventType.PLAYBACK_ENDED, () => this._onPlaybackEnded());
    this._eventManager.listen(this, CoreEventType.PLAYBACK_START, () => {
      this._playbackStart = true;
    });
    this._eventManager.listen(this, AdEventType.AD_AUTOPLAY_FAILED, (event: FakeEvent) => this._onAdAutoplayFailed(event));
    this._eventManager.listen(this, AdEventType.AD_STARTED, () => this._onAdStarted());
    if (this.config.playback.playAdsWithMSE) {
      this._attachEventManager = new EventManager();
      this._eventManager.listen(this, AdEventType.AD_LOADED, (event: FakeEvent) => {
        const {
          payload: { ad }
        } = event;
        // source set only after media loaded
        if (ad && ad.linear && ad.position === 1 && !ad.inStream && this.src) {
          this._attachEventManager.listenOnce(this, AdEventType.AD_BREAK_START, () => this.detachMediaSource());
          this._attachEventManager.listenOnce(this, AdEventType.AD_BREAK_END, () => this.attachMediaSource());
          this._attachEventManager.listenOnce(this, AdEventType.AD_ERROR, () => this.attachMediaSource());
        } else {
          this._attachEventManager.removeAll();
        }
      });
    }
    this._eventManager.listen(this, CoreEventType.ERROR, (event: FakeEvent) => {
      if (event.payload.severity === Error.Severity.CRITICAL) {
        this._reset = false;
      }
    });
  }

  private _onChangeSourceEnded(): void {
    if (Utils.Object.getPropertyPath(this.config, 'ui.targetId')) {
      this._viewabilityManager.observe(document.getElementById(this.config.ui.targetId)!, this._handleVisibilityChange.bind(this));
    } else {
      KalturaPlayer._logger.warn('Cannot observe visibility change without config.ui.targetId');
    }
  }

  private _onPlayerReset(): void {
    this._playbackStart = false;
    if (Utils.Object.getPropertyPath(this.config, 'ui.targetId')) {
      this._viewabilityManager.unObserve(document.getElementById(this.config.ui.targetId)!, this._handleVisibilityChange.bind(this));
    }
  }

  private _onChangeSourceStarted(): void {
    this._configureOrLoadPlugins(this._pluginsConfig);
    this.reset();
    this._pluginManager.loadMedia();
    this._reset = false;
    this.dispatchEvent(new FakeEvent(REGISTERED_PLUGINS_LIST_EVENT, this._pluginManager.getRegisterdPluginsList()));
  }

  private _onEnded(): void {
    // Make sure the all ENDED listeners have been invoked
    setTimeout(() => {
      if (this._adsController && !this._adsController.allAdsCompleted) {
        this._eventManager.listenOnce(this._adsController, AdEventType.ALL_ADS_COMPLETED, () => {
          this.dispatchEvent(new FakeEvent(CoreEventType.PLAYBACK_ENDED));
        });
      } else {
        this.dispatchEvent(new FakeEvent(CoreEventType.PLAYBACK_ENDED));
      }
    });
  }

  private _onPlaybackEnded(): void {
    if (this.config.playback.loop) {
      this.currentTime = 0;
      this.play();
    }
  }

  private _onAdStarted(): void {
    if (this._firstPlay) {
      this._localPlayer.posterManager.hide();
      this._localPlayer.hideBlackCover();
    }
  }

  private _onAdAutoplayFailed(event: FakeEvent): void {
    if (this._firstPlay && this.config.playback.autoplay) {
      this._localPlayer.posterManager.show();
      this.dispatchEvent(new FakeEvent(CoreEventType.AUTOPLAY_FAILED, event.payload));
    }
  }

  private _configureOrLoadPlugins(pluginsConfig: any = {}): void {
    const middlewares = [];
    const uiComponents = [];
    const plugins = [];
    Object.keys(pluginsConfig).forEach((name) => {
      // If the plugin is already exists in the registry we are updating his config
      const plugin = this._pluginManager.get(name);
      if (plugin) {
        plugin.updateConfig(pluginsConfig[name]);
        pluginsConfig[name] = plugin.getConfig();
      } else {
        // We allow to load pluginsConfig as long as the player has no engine
        if (!this._sourceSelected) {
          try {
            this._pluginManager.load(name, this, pluginsConfig[name]);
          } catch (error) {
            //bounce the plugin load error up
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.dispatchEvent(new FakeEvent(Error.Code.ERROR, error));
          }
          const plugin = this._pluginManager.get(name);
          if (plugin) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            plugins.push(plugin);
            pluginsConfig[name] = plugin.getConfig();
            if (typeof plugin['getMiddlewareImpl'] === 'function') {
              plugin.name === 'bumper'
                ? // push the bumper middleware to the end, to play the bumper right before the content
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  middlewares.push(plugin.getMiddlewareImpl())
                : // push the bumper middleware to the end, to play the bumper right before the content
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  middlewares.unshift(plugin.getMiddlewareImpl());
            }

            if (typeof plugin['getUIComponents'] === 'function') {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              uiComponents.push(...(plugin.getUIComponents() || []));
            }
            if (typeof plugin['getEngineDecorator'] === 'function') {
              this._localPlayer.registerEngineDecoratorProvider(new EngineDecoratorProvider(plugin as unknown as IEngineDecoratorProvider));
            }
          }
        } else {
          delete pluginsConfig[name];
        }
      }
    });
    uiComponents.forEach((component) => this._uiWrapper.addComponent(component));
    // First in the middleware chain is the plugin readiness to insure plugins are ready before load / play
    if (!this._pluginReadinessMiddleware) {
      this._pluginReadinessMiddleware = new PluginReadinessMiddleware(plugins);
      this._localPlayer.playbackMiddleware.use(this._pluginReadinessMiddleware);
    }
    this._maybeCreateAdsController();
    middlewares.forEach((middleware) => this._localPlayer.playbackMiddleware.use(middleware));
    Utils.Object.mergeDeep(this._pluginsConfig, pluginsConfig);
  }

  private _maybeCreateAdsController(): void {
    if (!this._adsController) {
      const adsPluginControllers = this._controllerProvider.getAdsControllers();
      if (adsPluginControllers.length) {
        this._adsController = new AdsController(this, adsPluginControllers);
        this._localPlayer.playbackMiddleware.use(this._adsController.getMiddleware());
        this._eventManager.listen(this._adsController, AdEventType.ALL_ADS_COMPLETED, (event) => {
          this.dispatchEvent(event);
        });
      }
    }
  }

  public attachMediaSource(): void {
    this._localPlayer.attachMediaSource();
  }

  public detachMediaSource(): void {
    this._localPlayer.detachMediaSource();
  }

  private _resetProviderPluginsConfig(): void {
    this.configure({ plugins: this._appPluginConfig });
    this._appPluginConfig = {};
  }

  /**
   * Set crossOrigin attribute.
   * @param {?string} crossOrigin - 'anonymous', 'use-credentials' or null to remove attribute
   * anonymous: CORS requests for this element will not have the credentials flag set.
   * use-credentials: CORS requests for this element will have the credentials flag set; this means the request will provide credentials.
   */
  public set crossOrigin(crossOrigin: string) {
    this._localPlayer.crossOrigin = crossOrigin;
  }

  /**
   * Get crossOrigin attribute.
   * @returns {?string} - 'anonymous' or 'use-credentials'
   */
  public get crossOrigin(): string | null {
    return this._localPlayer.crossOrigin;
  }

  /**
   * Gets the player visibility state
   * @returns {boolean} - whether the player is in the active browser tab and visible in the view port
   * @public
   */
  public get isVisible(): boolean {
    return this._isVisible;
  }

  /**
   * Gets the player viewability manager service
   * @returns {ViewabilityManager} - player viewability manager
   * @public
   */
  public get viewabilityManager(): ViewabilityManager {
    return this._viewabilityManager;
  }

  private _handleVisibilityChange(visible: boolean): void {
    this._isVisible = visible;
    this.dispatchEvent(new FakeEvent(VISIBILITY_CHANGE, { visible: this._isVisible }));
    if (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.config.playback.autoplay === AutoPlayType.IN_VIEW &&
      this._isVisible &&
      !this._playbackStart
    ) {
      this._localPlayer.play({ programmatic: true });
    }
    if (this.config.playback.autopause === true) {
      this._handleAutoPause(visible);
    }
  }

  private _handleAutoPause(visible: boolean): void {
    const isPlayingPlaybackOrAd = !this.paused || (this._adsController && this._adsController.isAdPlaying());
    const shouldAutoPause = !this.isInPictureInPicture() && this._playbackStart && isPlayingPlaybackOrAd;
    if (!visible) {
      if (shouldAutoPause) {
        this.pause();
        this._autoPaused = true;
      }
    } else if (this._autoPaused) {
      if (this.paused) {
        this.play();
      }
      this._autoPaused = false;
    }
  }
  /**
   * Gets a registered service of that name
   * @param {string} name - the service name
   * @returns {Object} - the service object
   */
  public getService(name: string): any | void {
    return this._serviceProvider.get(name);
  }

  /**
   * Checks if a service of that name has been registered
   * @param {string} name - the service name
   * @returns {boolean} - if the service exist
   */
  public hasService(name: string): boolean {
    return this._serviceProvider.has(name);
  }

  /**
   * Registers a service to be used across the player
   * @param {string} name - the service name
   * @param {Object} service - the service object
   * @returns {void}
   */
  public registerService(name: string, service: any): void {
    this._serviceProvider.register(name, service);
  }

  public get cuePointManager(): CuePointManager {
    return this._cuepointManager;
  }

  /**
   * Add text track
   * @function addTextTrack
   * @param {string} kind - Specifies the kind of text track.
   * @param {?string} label - A string specifying the label for the text track.
   * @returns {?TextTrack} - A TextTrack Object, which represents the new text track.
   * @public
   */
  public addTextTrack(kind: TextTrackKind, label?: string): TextTrack | undefined {
    return this._localPlayer.addTextTrack(kind, label);
  }

  /**
   * get the native text tracks
   * @function getNativeTextTracks
   * @returns {Array<TextTrack>} - The native TextTracks array.
   * @public
   */
  public getNativeTextTracks(): Array<TextTrack> {
    return this._localPlayer.getNativeTextTracks();
  }

  public get remotePlayerManager(): RemotePlayerManager {
    return this._remotePlayerManager;
  }

  /**
   * get the media capabilities
   * @function getMediaCapabilities
   * @param {HEVCConfigObject} hevcConfig - The HEVC configuration to check (optional).
   * @returns {Promise<MediaCapabilitiesObject>} - The media capabilities object.
   * @public
   */
  public async getMediaCapabilities(hevcConfig?: HEVCConfigObject): Promise<MediaCapabilitiesObject> {
    return getMediaCapabilities(hevcConfig);
  }
}
