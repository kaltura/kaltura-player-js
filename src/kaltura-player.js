// @flow
import {EventType as UIEventType} from '@playkit-js/playkit-js-ui';
import {Provider} from 'playkit-js-providers';
import {hasYoutubeSource, maybeSetStreamPriority, mergeProviderPluginsConfig, supportLegacyOptions} from './common/utils/setup-helpers';
import {addKalturaParams} from './common/utils/kaltura-params';
import {ViewabilityManager, ViewabilityType, VISIBILITY_CHANGE} from './common/utils/viewability-manager';
import {BasePlugin, ConfigEvaluator, PluginManager} from './common/plugins';
import {addKalturaPoster} from 'poster';
import './assets/style.css';
import {UIWrapper} from './common/ui-wrapper';
import {PlaylistManager} from './common/playlist/playlist-manager';
import {PlaylistEventType} from './common/playlist/playlist-event-type';
import {CastEventType} from './common/cast/cast-event-type';
import {RemotePlayerManager} from './common/cast/remote-player-manager';
import {BaseRemotePlayer} from './common/cast/base-remote-player';
import {RemoteSession} from './common/cast/remote-session';
import {AdsController, ControllerProvider} from './common/controllers';
import {getDefaultRedirectOptions} from 'player-defaults';
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
  EngineDecoratorProvider
} from '@playkit-js/playkit-js';
import {PluginReadinessMiddleware} from './common/plugins/plugin-readiness-middleware';
import {ThumbnailManager} from './common/thumbnail-manager';

class KalturaPlayer extends FakeEventTarget {
  static _logger: any = getLogger('KalturaPlayer' + Utils.Generator.uniqueId(5));

  _localPlayer: Player;
  _provider: Provider;
  _uiWrapper: UIWrapper;
  _controllerProvider: ControllerProvider;
  _adsController: ?AdsController;
  _eventManager: EventManager = new EventManager();
  _attachEventManager: EventManager;
  _mediaInfo: ?ProviderMediaInfoObject = null;
  _remotePlayer: ?BaseRemotePlayer = null;
  _pluginManager: PluginManager = new PluginManager();
  _pluginsConfig: KPPluginsConfigObject = {};
  _reset: boolean = true;
  _firstPlay: boolean = true;
  _sourceSelected: boolean = false;
  _pluginReadinessMiddleware: PluginReadinessMiddleware;
  _configEvaluator: ConfigEvaluator;
  _appPluginConfig: KPPluginsConfigObject = {};
  _viewabilityManager: ViewabilityManager;
  _playbackStart: boolean;
  _thumbnailManager: ?ThumbnailManager = null;

  /**
   * Whether the player browser tab is active and in the scroll view
   * @type {boolean}
   * @private
   */
  _isVisible: boolean = false;

  /**
   * Whether the player was auto paused
   * @type {boolean}
   * @private
   */
  _autoPaused: boolean = false;

  constructor(options: KPOptionsObject) {
    super();
    const {sources, plugins} = options;
    this._configEvaluator = new ConfigEvaluator();
    this._configEvaluator.evaluatePluginsConfig(plugins, options);
    this._playbackStart = false;
    const noSourcesOptions = Utils.Object.mergeDeep({}, options, {sources: null});
    delete noSourcesOptions.plugins;
    this._localPlayer = loadPlayer(noSourcesOptions);
    this._controllerProvider = new ControllerProvider(this._pluginManager);
    this._viewabilityManager = new ViewabilityManager(this.config.viewability);
    this._uiWrapper = new UIWrapper(this, Utils.Object.mergeDeep(options, {ui: {logger: {getLogger, LogLevel}}}));
    this._provider = new Provider(
      Utils.Object.mergeDeep(options.provider, {
        logger: {
          getLogger,
          LogLevel
        }
      }),
      __VERSION__
    );
    this._playlistManager = new PlaylistManager(this, options);
    Object.values(CoreEventType).forEach(coreEvent => this._eventManager.listen(this._localPlayer, coreEvent, e => this.dispatchEvent(e)));
    this._addBindings();
    this._playlistManager.configure(Utils.Object.mergeDeep({}, options.playlist, {items: null}));
    this.configure({plugins});
    //configure sources after configure finished for all components - making sure all we'll set up correctly
    this._playlistManager.configure({items: (options.playlist && options.playlist.items) || []});
    this._localPlayer.configure({sources: sources || {}});
  }

  /**
   * Loads a media.
   * @param {ProviderMediaInfoObject} mediaInfo - The media info.
   * @param {PKSourcesConfigObject} [mediaOptions] - The media options.
   * @returns {Promise<*>} - Promise which resolves when the media is loaded, or rejected if error occurs.
   * @instance
   * @memberof KalturaPlayer
   * @example
   * kalturaPlayer.loadMedia({entryId: 'entry123'}, {startTime: 5, poster: 'my/poster/url'});
   */
  loadMedia(mediaInfo: ProviderMediaInfoObject, mediaOptions?: PKSourcesConfigObject): Promise<*> {
    KalturaPlayer._logger.debug('loadMedia', mediaInfo);
    this._mediaInfo = mediaInfo;
    this.reset();
    this._localPlayer.loadingMedia = true;
    this._uiWrapper.setLoadingSpinnerState(true);
    return new Promise((resolve, reject) => {
      this._provider
        .getMediaConfig(mediaInfo)
        .then(
          (providerMediaConfig: ProviderMediaConfigObject) => {
            const mediaConfig = Utils.Object.copyDeep(providerMediaConfig);
            if (mediaOptions) {
              mediaConfig.sources = mediaConfig.sources || {};
              mediaConfig.sources = Utils.Object.mergeDeep(mediaConfig.sources, mediaOptions);
            }
            const mergedPluginsConfigAndFromApp = mergeProviderPluginsConfig(mediaConfig.plugins, this.config.plugins);
            mediaConfig.plugins = mergedPluginsConfigAndFromApp[0];
            this._appPluginConfig = mergedPluginsConfigAndFromApp[1];
            this.configure(getDefaultRedirectOptions(this.config, mediaConfig));
            this.setMedia(mediaConfig);
            return mediaConfig;
          },
          e => {
            const error = new Error(Error.Severity.CRITICAL, Error.Category.PLAYER, Error.Code.LOAD_FAILED, e);
            this._localPlayer.dispatchEvent(new FakeEvent(CoreEventType.ERROR, error));
            reject(e);
          }
        )
        .then(mediaConfig => {
          this._maybeSetEmbedConfig();
          resolve(mediaConfig);
        });
    });
  }

  setMedia(mediaConfig: KPMediaConfig): void {
    KalturaPlayer._logger.debug('setMedia', mediaConfig);
    this.reset();
    const playerConfig = Utils.Object.copyDeep(mediaConfig);
    Utils.Object.mergeDeep(playerConfig.sources, this._localPlayer.config.sources);
    Utils.Object.mergeDeep(playerConfig.session, this._localPlayer.config.session);
    playerConfig.plugins = playerConfig.plugins || {};
    Object.keys(this._pluginsConfig).forEach(name => {
      playerConfig.plugins[name] = playerConfig.plugins[name] || {};
    });
    addKalturaPoster(playerConfig.sources, mediaConfig.sources, this._localPlayer.dimensions);
    addKalturaParams(this, playerConfig);
    maybeSetStreamPriority(this, playerConfig);
    if (!hasYoutubeSource(playerConfig.sources)) {
      this._thumbnailManager = new ThumbnailManager(this._localPlayer, this.config.ui, mediaConfig);
    }
    this.configure(playerConfig);
  }

  /**
   * Loads a playlist by id.
   * @param {ProviderPlaylistInfoObject} playlistInfo - The playlist info.
   * @param {KPPlaylistConfigObject} [playlistConfig] - The playlist config.
   * @returns {Promise<ProviderPlaylistObject>} - The playlist data from the provider.
   * @instance
   * @memberof KalturaPlayer
   * @example
   * kalturaPlayer.loadPlaylist({playlistId: '123456'}, {options: {autoContinue: false}});
   */
  loadPlaylist(playlistInfo: ProviderPlaylistInfoObject, playlistConfig: ?KPPlaylistConfigObject): Promise<ProviderPlaylistObject> {
    KalturaPlayer._logger.debug('loadPlaylist', playlistInfo);
    this._uiWrapper.setLoadingSpinnerState(true);
    return new Promise((resolve, reject) => {
      this._provider.getPlaylistConfig(playlistInfo).then(
        playlistData => {
          this.setPlaylist(playlistData, playlistConfig);
          resolve(playlistData);
        },
        e => {
          const error = new Error(Error.Severity.CRITICAL, Error.Category.PLAYER, Error.Code.LOAD_FAILED, e);
          this._localPlayer.dispatchEvent(new FakeEvent(CoreEventType.ERROR, error));
          reject(e);
        }
      );
    });
  }

  /**
   * Loads a playlist by entry list.
   * @param {ProviderEntryListObject} entryList - The playlist info.
   * @param {KPPlaylistConfigObject} [playlistConfig] - The playlist config.
   * @returns {Promise<ProviderPlaylistObject>} - The playlist data from the provider.
   * @instance
   * @memberof KalturaPlayer
   * @example
   * kalturaPlayer.loadPlaylistByEntryList({entries: [{entryId: '01234'}, {entryId: '56789'}]}, {options: {autoContinue: false}});
   */
  loadPlaylistByEntryList(entryList: ProviderEntryListObject, playlistConfig: ?KPPlaylistConfigObject): Promise<ProviderPlaylistObject> {
    KalturaPlayer._logger.debug('loadPlaylistByEntryList', entryList);
    this._uiWrapper.setLoadingSpinnerState(true);
    return new Promise((resolve, reject) => {
      this._provider.getEntryListConfig(entryList).then(
        playlistData => {
          this.setPlaylist(playlistData, playlistConfig, entryList);
          resolve(playlistData);
        },
        e => {
          const error = new Error(Error.Severity.CRITICAL, Error.Category.PLAYER, Error.Code.LOAD_FAILED, e);
          this._localPlayer.dispatchEvent(new FakeEvent(CoreEventType.ERROR, error));
          reject(e);
        }
      );
    });
  }

  setPlaylist(playlistData: ProviderPlaylistObject, playlistConfig: ?KPPlaylistConfigObject, entryList: ?ProviderEntryListObject): void {
    KalturaPlayer._logger.debug('setPlaylist', playlistData);
    const config = {playlist: playlistData, plugins: {}};
    Object.keys(this._pluginsConfig).forEach(name => {
      config.plugins[name] = {};
    });
    this._configEvaluator.evaluatePluginsConfig(config.plugins, config);
    this._configureOrLoadPlugins(config.plugins);
    this._playlistManager.load(playlistData, playlistConfig, entryList);
  }

  getMediaInfo(): ?ProviderMediaInfoObject {
    return Utils.Object.copyDeep(this._mediaInfo);
  }

  getMediaConfig(): ?KPMediaConfig {
    const mediaConfig = {
      sources: this._localPlayer.config.sources,
      plugins: this._pluginsConfig
    };
    return Utils.Object.copyDeep(mediaConfig);
  }

  /**
   * Config the player.
   * @param {Object} [config={}] - The player config.
   * @returns {void}
   * @instance
   * @memberof KalturaPlayer
   * @example
   * kalturaPlayer.configure({playback: {autoplay: true}});
   */
  configure(config: Object = {}): void {
    config = supportLegacyOptions(config);
    const configDictionary = Utils.Object.mergeDeep({}, this.config, config);
    this._configEvaluator.evaluatePluginsConfig(config.plugins, configDictionary);
    this._configureOrLoadPlugins(config.plugins);
    const localPlayerConfig = Utils.Object.mergeDeep({}, config);
    delete localPlayerConfig.plugins;
    this._localPlayer.configure(localPlayerConfig);
    const uiConfig = config.ui;
    if (uiConfig) {
      this._configEvaluator.evaluateUIConfig(uiConfig, this.config);
      this._uiWrapper.setConfig(uiConfig);
    }
    if (config.playlist) {
      this._playlistManager.configure(config.playlist);
    }
  }

  ready(): Promise<*> {
    return this._localPlayer.ready();
  }

  load(): void {
    this._localPlayer.load();
  }

  play(): void {
    this._localPlayer.play();
  }

  pause(): void {
    this._localPlayer.pause();
  }

  getView(): HTMLElement {
    return this._localPlayer.getView();
  }

  getVideoElement(): ?HTMLVideoElement {
    return this._localPlayer.getVideoElement();
  }

  reset(): void {
    if (!this._reset) {
      this._reset = true;
      this._firstPlay = true;
      if (this._attachEventManager) {
        this._attachEventManager.removeAll();
      }
      this._uiWrapper.reset();
      this._resetProviderPluginsConfig();
      this._pluginManager.reset();
      this._localPlayer.reset();
    }
  }

  destroy(): void {
    const targetId = this.config.ui.targetId;
    this._reset = true;
    this._playbackStart = false;
    this._firstPlay = true;
    this._uiWrapper.destroy();
    this._pluginManager.destroy();
    this._playlistManager.destroy();
    this._localPlayer.destroy();
    this._eventManager.destroy();
    this._viewabilityManager.destroy();
    RemotePlayerManager.destroy();
    this._pluginsConfig = {};
    const targetContainer = document.getElementById(targetId);
    if (targetContainer && targetContainer.parentNode) {
      Utils.Dom.removeChild(targetContainer.parentNode, targetContainer);
    }
  }

  isLive(): boolean {
    return this._localPlayer.isLive();
  }

  isOnLiveEdge(): boolean {
    return this._localPlayer.isOnLiveEdge();
  }

  isDvr(): boolean {
    return this._localPlayer.isDvr();
  }

  seekToLiveEdge(): void {
    this._localPlayer.seekToLiveEdge();
  }

  getStartTimeOfDvrWindow(): number {
    return this._localPlayer.getStartTimeOfDvrWindow();
  }

  getTracks(type?: string): Array<Track> {
    return this._localPlayer.getTracks(type);
  }

  getActiveTracks(): Object {
    return this._localPlayer.getActiveTracks();
  }

  selectTrack(track: ?Track): void {
    this._localPlayer.selectTrack(track);
  }

  hideTextTrack(): void {
    this._localPlayer.hideTextTrack();
  }

  enableAdaptiveBitrate(): void {
    this._localPlayer.enableAdaptiveBitrate();
  }

  isAdaptiveBitrateEnabled(): boolean {
    return this._localPlayer.isAdaptiveBitrateEnabled();
  }

  setTextDisplaySettings(settings: Object): void {
    this._localPlayer.setTextDisplaySettings(settings);
  }

  get textDisplaySetting(): Object {
    return this._localPlayer.textDisplaySetting;
  }

  isFullscreen(): boolean {
    return this._localPlayer.isFullscreen();
  }

  notifyEnterFullscreen(): void {
    this._localPlayer.notifyEnterFullscreen();
  }

  notifyExitFullscreen(): void {
    this._localPlayer.notifyExitFullscreen();
  }

  enterFullscreen(fullScreenElementId: ?string): void {
    const elementId = fullScreenElementId ? fullScreenElementId : this.config.ui.targetId;
    this._localPlayer.enterFullscreen(elementId);
  }

  exitFullscreen(): void {
    this._localPlayer.exitFullscreen();
  }

  enterPictureInPicture(): void {
    this._localPlayer.enterPictureInPicture();
  }

  exitPictureInPicture(): void {
    this._localPlayer.exitPictureInPicture();
  }

  isInPictureInPicture(): boolean {
    return this._localPlayer.isInPictureInPicture();
  }

  isPictureInPictureSupported(): boolean {
    return this._localPlayer.isPictureInPictureSupported();
  }

  getLogLevel(name?: string): Object {
    return this._localPlayer.getLogLevel(name);
  }

  startCasting(type?: string): Promise<*> {
    return RemotePlayerManager.startCasting(type);
  }

  isCastAvailable(type?: string): boolean {
    return RemotePlayerManager.isCastAvailable(type);
  }

  getCastSession(): ?RemoteSession {
    return null;
  }

  stopCasting(): void {
    // Empty implementation
  }

  isCasting(): boolean {
    return false;
  }

  isVr(): boolean {
    return this._localPlayer.isVr();
  }

  toggleVrStereoMode(): void {
    const vrPlugin: ?BasePlugin = this._pluginManager.get('vr');
    if (vrPlugin && typeof vrPlugin.toggleVrStereoMode === 'function') {
      vrPlugin.toggleVrStereoMode();
    }
  }

  isInVrStereoMode(): boolean {
    const vrPlugin: ?BasePlugin = this._pluginManager.get('vr');
    if (vrPlugin && typeof vrPlugin.isInStereoMode === 'function') {
      return vrPlugin.isInStereoMode();
    }
    return false;
  }

  setLogLevel(level: Object, name?: string) {
    this._localPlayer.setLogLevel(level, name);
  }

  getThumbnail(time?: number): ?ThumbnailInfo {
    if (!time) {
      // If time isn't supplied, return thumbnail for player's current time
      if (!isNaN(this.currentTime)) {
        time = this.currentTime;
      } else {
        return null;
      }
    }
    time = this.isLive() ? time + this.getStartTimeOfDvrWindow() : time;
    if (this._thumbnailManager) {
      return this._thumbnailManager.getThumbnail(time);
    }
  }

  set textStyle(style: TextStyle): void {
    this._localPlayer.textStyle = style;
  }

  get textStyle(): ?TextStyle {
    return this._localPlayer.textStyle;
  }

  get buffered(): ?TimeRanges {
    return this._localPlayer.buffered;
  }

  get stats(): PKStatsObject {
    return this._localPlayer.stats;
  }

  set currentTime(to: number): void {
    this._localPlayer.currentTime = to;
  }

  get currentTime(): number {
    return this._localPlayer.currentTime;
  }

  get duration(): number {
    return this._localPlayer.duration;
  }

  set volume(vol: number): void {
    this._localPlayer.volume = vol;
  }

  get volume(): number {
    return this._localPlayer.volume;
  }

  get paused(): boolean {
    return this._localPlayer.paused;
  }

  get seeking(): boolean {
    return this._localPlayer.seeking;
  }

  set playsinline(playsinline: boolean): void {
    this._localPlayer.playsinline = playsinline;
  }

  get playsinline(): boolean {
    return this._localPlayer.playsinline;
  }

  set muted(mute: boolean): void {
    this._localPlayer.muted = mute;
  }

  get muted(): boolean {
    return this._localPlayer.muted;
  }

  get src(): string {
    return this._localPlayer.src;
  }

  set dimensions(dimensions?: PKPlayerDimensions) {
    this._localPlayer.dimensions = dimensions;
  }

  get dimensions(): PKPlayerDimensions {
    return this._localPlayer.dimensions;
  }

  get poster(): string {
    return this._localPlayer.poster;
  }

  get ended(): boolean {
    return this._localPlayer.ended;
  }

  set playbackRate(rate: number): void {
    this._localPlayer.playbackRate = rate;
  }

  get playbackRate(): number {
    return this._localPlayer.playbackRate;
  }

  get playbackRates(): Array<number> {
    return this._localPlayer.playbackRates;
  }

  get defaultPlaybackRate(): number {
    return this._localPlayer.defaultPlaybackRate;
  }

  get engineType(): string {
    return this._localPlayer.engineType;
  }

  get streamType(): string {
    return this._localPlayer.streamType;
  }

  get env(): Object {
    return this._localPlayer.env;
  }

  get config(): Object {
    return {...this._localPlayer.config, plugins: this._pluginsConfig};
  }

  get hasUserInteracted(): boolean {
    return this._localPlayer.hasUserInteracted;
  }

  set loadingMedia(loading: boolean): void {
    this._localPlayer.loadingMedia = loading;
  }

  get ads(): ?AdsController {
    return this._adsController;
  }

  get plugins(): {[name: string]: BasePlugin} {
    return this._pluginManager.getAll();
  }

  get provider(): Provider {
    return this._provider;
  }

  get ui(): UIWrapper {
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
  get playlist(): PlaylistManager {
    return this._playlistManager;
  }

  get Event(): KPEventTypes {
    return {
      Cast: CastEventType,
      Core: CoreEventType,
      Playlist: PlaylistEventType,
      UI: UIEventType,
      // For backward compatibility
      ...CoreEventType,
      VISIBILITY_CHANGE
    };
  }

  get TextStyle(): typeof TextStyle {
    return this._localPlayer.TextStyle;
  }

  get ViewabilityType(): {[type: string]: string} {
    return ViewabilityType;
  }

  get State(): PKStateTypes {
    return this._localPlayer.State;
  }

  get Track(): PKTrackTypes {
    return this._localPlayer.Track;
  }

  get LogLevelType(): PKLogLevelTypes {
    return this._localPlayer.LogLevelType;
  }

  get LogLevel(): PKLogLevels {
    return this._localPlayer.LogLevel;
  }

  get AbrMode(): PKAbrModes {
    return this._localPlayer.AbrMode;
  }

  get MediaType(): PKMediaTypes {
    return this._localPlayer.MediaType;
  }

  get StreamType(): PKStreamTypes {
    return this._localPlayer.StreamType;
  }

  get EngineType(): PKEngineTypes {
    return this._localPlayer.EngineType;
  }

  get Error(): typeof Error {
    return this._localPlayer.Error;
  }

  _addBindings(): void {
    this._eventManager.listen(this, CoreEventType.CHANGE_SOURCE_STARTED, () => this._onChangeSourceStarted());
    this._eventManager.listen(this, CoreEventType.CHANGE_SOURCE_ENDED, () => this._onChangeSourceEnded());
    this._eventManager.listen(this, CoreEventType.PLAYER_RESET, () => this._onPlayerReset());
    this._eventManager.listen(this, CoreEventType.ENDED, () => this._onEnded());
    this._eventManager.listen(this, CoreEventType.FIRST_PLAY, () => (this._firstPlay = false));
    this._eventManager.listen(this, CoreEventType.SOURCE_SELECTED, () => (this._sourceSelected = true));
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
          payload: {ad}
        } = event;
        if (ad && ad.linear && ad.position === 1 && !ad.inStream) {
          this._attachEventManager.listenOnce(this, AdEventType.AD_BREAK_START, () => this.detachMediaSource());
          this._attachEventManager.listenOnce(this, AdEventType.AD_BREAK_END, () => this.attachMediaSource());
          this._attachEventManager.listenOnce(this, AdEventType.AD_ERROR, () => this.attachMediaSource());
        } else {
          this._attachEventManager.removeAll();
        }
      });
    }
  }

  _onChangeSourceEnded(): void {
    if (Utils.Object.getPropertyPath(this.config, 'ui.targetId')) {
      this._viewabilityManager.observe(Utils.Dom.getElementById(this.config.ui.targetId), this._handleVisibilityChange.bind(this));
    } else {
      KalturaPlayer._logger.warn('Cannot observe visibility change without config.ui.targetId');
    }
  }

  _onPlayerReset(): void {
    this._playbackStart = false;
    if (Utils.Object.getPropertyPath(this.config, 'ui.targetId')) {
      this._viewabilityManager.unObserve(Utils.Dom.getElementById(this.config.ui.targetId), this._handleVisibilityChange.bind(this));
    }
  }

  _onChangeSourceStarted(): void {
    this._configureOrLoadPlugins(this._pluginsConfig);
    this.reset();
    this._pluginManager.loadMedia();
    this._reset = false;
  }

  _onEnded(): void {
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

  _onPlaybackEnded(): void {
    if (this.config.playback.loop) {
      this.currentTime = 0;
      this.play();
    }
  }

  _onAdStarted(): void {
    if (this._firstPlay) {
      this._localPlayer.posterManager.hide();
      this._localPlayer.hideBlackCover();
    }
  }

  _onAdAutoplayFailed(event: FakeEvent): void {
    if (this._firstPlay && this.config.playback.autoplay) {
      this._localPlayer.posterManager.show();
      this.dispatchEvent(new FakeEvent(CoreEventType.AUTOPLAY_FAILED, event.payload));
    }
  }

  _configureOrLoadPlugins(pluginsConfig: Object = {}): void {
    const middlewares = [];
    const uiComponents = [];
    const plugins = [];
    Object.keys(pluginsConfig).forEach(name => {
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
            this.dispatchEvent(new FakeEvent(Error.Code.ERROR, error));
          }
          let plugin = this._pluginManager.get(name);
          if (plugin) {
            plugins.push(plugin);
            pluginsConfig[name] = plugin.getConfig();
            if (typeof plugin.getMiddlewareImpl === 'function') {
              // push the bumper middleware to the end, to play the bumper right before the content
              plugin.name === 'bumper' ? middlewares.push(plugin.getMiddlewareImpl()) : middlewares.unshift(plugin.getMiddlewareImpl());
            }

            if (typeof plugin.getUIComponents === 'function') {
              uiComponents.push(...(plugin.getUIComponents() || []));
            }

            if (typeof plugin.getEngineDecorator === 'function') {
              this._localPlayer.registerEngineDecoratorProvider(new EngineDecoratorProvider(plugin));
            }
          }
        } else {
          delete pluginsConfig[name];
        }
      }
    });
    uiComponents.forEach(component => this._uiWrapper.addComponent(component));
    // First in the middleware chain is the plugin readiness to insure plugins are ready before load / play
    if (!this._pluginReadinessMiddleware) {
      this._pluginReadinessMiddleware = new PluginReadinessMiddleware(plugins);
      this._localPlayer.playbackMiddleware.use(this._pluginReadinessMiddleware);
    }
    this._maybeCreateAdsController();
    middlewares.forEach(middleware => this._localPlayer.playbackMiddleware.use(middleware));
    Utils.Object.mergeDeep(this._pluginsConfig, pluginsConfig);
  }

  _maybeCreateAdsController(): void {
    if (!this._adsController) {
      const adsPluginControllers = this._controllerProvider.getAdsControllers();
      if (adsPluginControllers.length) {
        this._adsController = new AdsController(this, adsPluginControllers);
        this._localPlayer.playbackMiddleware.use(this._adsController.getMiddleware());
        this._eventManager.listen(this._adsController, AdEventType.ALL_ADS_COMPLETED, event => {
          this.dispatchEvent(event);
        });
      }
    }
  }

  /**
   * set the share config
   * @returns {void}
   * @private
   */
  _maybeSetEmbedConfig(): void {
    const ui = this.config.ui;
    if (ui && ui.components && ui.components.share) {
      this._configEvaluator.evaluateUIConfig(ui, this.config);
      this._uiWrapper.setConfig(ui);
    }
  }

  attachMediaSource(): void {
    this._localPlayer.attachMediaSource();
  }

  detachMediaSource(): void {
    this._localPlayer.detachMediaSource();
  }

  _resetProviderPluginsConfig(): void {
    this.configure({plugins: this._appPluginConfig});
    this._appPluginConfig = {};
  }

  /**
   * Set crossOrigin attribute.
   * @param {?string} crossOrigin - 'anonymous', 'use-credentials' or null to remove attribute
   * anonymous: CORS requests for this element will not have the credentials flag set.
   * use-credentials: CORS requests for this element will have the credentials flag set; this means the request will provide credentials.
   */
  set crossOrigin(crossOrigin: ?string): void {
    this._localPlayer.crossOrigin = crossOrigin;
  }

  /**
   * Get crossOrigin attribute.
   * @returns {?string} - 'anonymous' or 'use-credentials'
   */
  get crossOrigin(): ?string {
    return this._localPlayer.crossOrigin;
  }

  /**
   * Gets the player visibility state
   * @returns {boolean} - whether the player is in the active browser tab and visible in the view port
   * @public
   */
  get isVisible(): boolean {
    return this._isVisible;
  }

  /**
   * Gets the player viewability manager service
   * @returns {ViewabilityManager} - player viewability manager
   * @public
   */
  get viewabilityManager(): ViewabilityManager {
    return this._viewabilityManager;
  }

  _handleVisibilityChange(visible: boolean) {
    this._isVisible = visible;
    this.dispatchEvent(new FakeEvent(VISIBILITY_CHANGE, {visible: this._isVisible}));

    if (this.config.playback.autoplay === AutoPlayType.IN_VIEW && this._isVisible && !this._playbackStart) {
      this._localPlayer.play({programmatic: true});
    }
    if (this.config.playback.autopause === true) {
      this._handleAutoPause(visible);
    }
  }

  _handleAutoPause(visible: boolean) {
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
}

export {KalturaPlayer};
