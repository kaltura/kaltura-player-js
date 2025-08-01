import { setDefaultAnalyticsPlugin } from 'player-defaults';
import {
  Env,
  TextStyle,
  Utils,
  setCapabilities,
  EngineType,
  DrmScheme,
  getLogger,
  LogLevel,
  setLogHandler,
  setLogLevel as _setLogLevel,
  ILogLevel,
  ILogHandler,
  PKSourcesConfigObject
} from '@playkit-js/playkit-js';
import { ProviderOptionsObject } from '@playkit-js/playkit-js-providers/types';
import { ValidationErrorType } from './validation-error';
import LocalStorageManager from '../storage/local-storage-manager';
import { KalturaPlayer } from '../../kaltura-player';
import { addClientTag, addReferrer, updateSessionIdInUrl } from './kaltura-params';
import { DEFAULT_OBSERVED_THRESHOLDS, DEFAULT_PLAYER_THRESHOLD } from './viewability-manager';
import SessionStorageManager from '../storage/session-storage-manager';
import { BaseStorageManager } from '../storage/base-storage-manager';
import { BasePlugin } from '../plugins';
import { KalturaPlayerConfig, LegacyPartialKPOptionsObject, PartialKPOptionsObject, PluginsConfig, PlaybackConfig } from '../../types';
import { SessionIdGenerator } from './session-id-generator';
import { UiConfIdSingleton } from './ui-conf-id-singleton';

const setupMessages: Array<any> = [];
const CONTAINER_CLASS_NAME: string = 'kaltura-player-container';
const KALTURA_PLAYER_DEBUG_QS: string = 'debugKalturaPlayer';
const KALTURA_PLAYER_START_TIME_QS: string = 'kalturaStartTime';
const KALTURA_PLAYER_END_TIME_QS: string = 'kalturaEndTime';
const KALTURA_PLAYER_CLIP_START_TIME_QS: string = 'kalturaSeekFrom';
const KALTURA_PLAYER_CLIP_END_TIME_QS: string = 'kalturaClipTo';
const KAVA_DEFAULT_PARTNER = 2504201;
// eslint-disable-next-line max-len
const KAVA_DEFAULT_IMPRESSION = `https://analytics.kaltura.com/api_v3/index.php?service=analytics&action=trackEvent&apiVersion=3.3.0&format=1&eventType=1&partnerId=${KAVA_DEFAULT_PARTNER}&entryId=1_3bwzbc9o&&eventIndex=1&position=0`;

declare let __CONFIG_DOCS_URL__: string;

const logHandlers: Array<(messages: any[], context: object) => void> = [];
const LOG_BUFFER_SIZE = 1000;
const logBuffer: string[] = [];

const logHandler = (messages: any[], ctx: { name: string }): void => {
  logHandlers.forEach((handler: ILogHandler): void => {
    handler(messages, { ...ctx, level: LogLevel.INFO });
  });
};

/**
 * Validate the initial user config.
 * @private
 * @param {PartialKPOptionsObject} options - partial kaltura player options.
 * @returns {void}
 */
function validateConfig(options: PartialKPOptionsObject): void {
  if (!options) {
    throw new Error(ValidationErrorType.INITIAL_CONFIG_REQUIRED);
  }
  validateTargetId(options.targetId);
}

/**
 * Validate the user input for target id.
 * @private
 * @param {string} targetId - The DOM element id which the player will be append to.
 * @returns {void}
 */
function validateTargetId(targetId: string): void {
  if (!targetId) {
    throw new Error(ValidationErrorType.TARGET_ID_REQUIRED);
  }
  const targetIdElement = document.getElementById(targetId);
  if (!targetIdElement) {
    throw new Error(ValidationErrorType.DOM_ELEMENT_WITH_TARGET_ID_REQUIRED + targetId);
  }
  if (targetIdElement.getElementsByClassName(CONTAINER_CLASS_NAME).length > 0) {
    throw new Error(ValidationErrorType.TARGET_ID_ALREADY_USED + targetId);
  }
}

/**
 * @param {string} url - url
 * @param {string} productVersion - product version
 * @return {string} - the url with the product version appended in the query params
 * @private
 */
function addProductVersion(url: string, productVersion?: string): string {
  if (productVersion) {
    url += `&clientVer=${productVersion}`;
  }
  return url;
}

/**
 * Validate the initial user input for the provider options.
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function validateProviderConfig(options: KalturaPlayerConfig): void {
  const { provider: providerOptions }: { provider: ProviderOptionsObject } = options;
  const productVersion: string = getServerUIConf()?.productVersion;
  if (!providerOptions.partnerId || providerOptions.partnerId === KAVA_DEFAULT_PARTNER) {
    //create source object as a 'hack' to be able to use utility functions on url
    const source = {
      url: KAVA_DEFAULT_IMPRESSION,
      mimetype: ''
    };
    source.url = addProductVersion(source.url, productVersion);
    source.url = addReferrer(source.url);
    source.url = addClientTag(source.url, productVersion);
    source.url = updateSessionIdInUrl(null, source.url, SessionIdGenerator.next());
    navigator.sendBeacon && navigator.sendBeacon(source.url);
  }
}

/**
 * Creates the player container dom element.
 * @private
 * @param {string} targetId - The div id which the player will append to.
 * @returns {string} - The player container id.
 */
function createKalturaPlayerContainer(targetId: string): string {
  const el = document.createElement('div');
  el.id = Utils.Generator.uniqueId(5);
  el.className = CONTAINER_CLASS_NAME;
  el.setAttribute('tabindex', '-1');
  const parentNode = document.getElementById(targetId);
  if (parentNode && el) {
    parentNode.appendChild(el);
  }
  return el.id;
}

/**
 * Initializes the storage managers.
 * @private
 * @returns {void}
 */
function initializeStorageManagers(): void {
  LocalStorageManager.initialize();
  SessionStorageManager.initialize();
}

/**
 * Sets the storage config on the player config if certain conditions are met.
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function setStorageConfig(options: KalturaPlayerConfig): void {
  if (!options.disableUserCache) {
    BaseStorageManager.setStorageConfig(options);
  }
}

/**
 * Applies cache support if it's supported by the environment.
 * @private
 * @param {KalturaPlayer} player - The Kaltura player.
 * @returns {void}
 */
function applyStorageSupport(player: KalturaPlayer): void {
  BaseStorageManager.attachAll(player);
}

/**
 * Loads the registered remote players.
 * @private
 * @param {KalturaPlayerConfig} defaultOptions - The kaltura player options.
 * @param {KalturaPlayer} player - The Kaltura player.
 * @returns {void}
 */
function applyCastSupport(defaultOptions: KalturaPlayerConfig, player: KalturaPlayer): void {
  if (defaultOptions.cast) {
    player.remotePlayerManager.load(defaultOptions.cast, player);
  }
}

/**
 * Sets the player text style from storage.
 * @private
 * @param {KalturaPlayer} player - The Kaltura player.
 * @returns {void}
 */
function setStorageTextStyle(player: KalturaPlayer): void {
  if (!player.config.disableUserCache && LocalStorageManager.isStorageAvailable()) {
    const textStyleObj = LocalStorageManager.getPlayerTextStyle();
    if (textStyleObj) {
      player.textStyle = Utils.Object.mergeDeep(new TextStyle(), textStyleObj);
    }
  }
}

/**
 * Call to setCapabilities on the first UI_CLICKED event
 * @private
 * @param {Player} player - The Kaltura player.
 * @returns {void}
 */
function attachToFirstClick(player: KalturaPlayer): void {
  if (Env.isIOS || Env.isIPadOS) {
    const onUIClicked = (): void => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      player.removeEventListener(player.Event.UI.UI_CLICKED, onUIClicked);
      setCapabilities(EngineType.HTML5, { autoplay: true });
    };
    const onSourceSelected = (): void => {
      player.removeEventListener(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        player.Event.SOURCE_SELECTED,
        onSourceSelected
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      player.addEventListener(player.Event.UI.UI_CLICKED, onUIClicked);
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    player.addEventListener(player.Event.SOURCE_SELECTED, onSourceSelected);
  }
}

/**
 * check the player debug mode according to config or URL query string params
 * @private
 * @returns {boolean} - if to set debug mode or not
 */
function isDebugMode(): boolean {
  let isDebugMode = false;
  if (window.DEBUG_KALTURA_PLAYER === true) {
    isDebugMode = true;
  } else {
    isDebugMode = getUrlParameter(KALTURA_PLAYER_DEBUG_QS) === '';
  }
  return isDebugMode;
}

/**
 * get the parameter for start time
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function maybeApplyStartTimeQueryParam(options: KalturaPlayerConfig): void {
  const startTime = parseFloat(<string>getUrlParameter(KALTURA_PLAYER_START_TIME_QS));
  if (!isNaN(startTime)) {
    Utils.Object.createPropertyPath(options, 'sources.startTime', startTime);
  }
}

/**
 * get the parameter for end time
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function maybeApplyEndTimeQueryParam(options: KalturaPlayerConfig): void {
  const endTime = parseFloat(<string>getUrlParameter(KALTURA_PLAYER_END_TIME_QS));
  if (!isNaN(endTime)) {
    Utils.Object.createPropertyPath(options, 'sources.endTime', endTime);
  }
}

/**
 * get the parameters for seekFrom and clipTo
 * @private
 * @param {KPOptionsObject} options - kaltura player options
 * @returns {void}
 */
function maybeApplyClipQueryParams(options: KalturaPlayerConfig): void {
  const seekFrom = parseFloat(getUrlParameter(KALTURA_PLAYER_CLIP_START_TIME_QS)!);
  if (!isNaN(seekFrom)) {
    Utils.Object.createPropertyPath(options, 'sources.seekFrom', seekFrom);
  }
  const clipTo = parseFloat(getUrlParameter(KALTURA_PLAYER_CLIP_END_TIME_QS)!);
  if (!isNaN(clipTo)) {
    Utils.Object.createPropertyPath(options, 'sources.clipTo', clipTo);
  }
}

/**
 * set the logger
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function setLogOptions(options: KalturaPlayerConfig): void {
  function getFormattedMessage(messages: any[], ctx: any): string {
    const messagesStr = [...messages]
      .map((msg) => {
        try {
          // stringify objects, but protect against errors (e.g. circular references)
          return typeof msg === 'string' ? msg : JSON.stringify(msg);
        } catch (e) {
          return msg;
        }
      })
      .join(' ');

    return `[${(ctx as { name: string }).name}] ${messagesStr}`;
  }

  if (!Utils.Object.getPropertyPath(options, 'ui.log')) {
    Utils.Object.createPropertyPath(options, 'ui.log', {});
  }
  if (!Utils.Object.getPropertyPath(options, 'provider.log')) {
    Utils.Object.createPropertyPath(options, 'provider.log', {});
  }
  if (!Utils.Object.getPropertyPath(options, 'log')) {
    Utils.Object.createPropertyPath(options, 'log', {});
  }
  if (Utils.Object.getPropertyPath(options, 'log.useDebugInfo') === undefined) {
    options.log!.useDebugInfo = true;
  }

  logHandlers.push((messages, ctx) => {
    // when we use a handler, we have to explicitly print the message to console
    // eslint-disable-next-line no-console
    console.log(getFormattedMessage(messages, ctx));
  });

  if (options.log && (options.log as any).useDebugInfo) {
    logHandlers.push((messages, ctx) => {
      const message = getFormattedMessage(messages, ctx);

      if (logBuffer.length === LOG_BUFFER_SIZE) {
        logBuffer.shift();
      }

      logBuffer.push(`${new Date().toLocaleString()} ${message} \n`);
    });
  }
  // add custom log handlers
  if (options.log && typeof options.log.handler === 'function') {
    logHandlers.push(options.log.handler);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  setLogHandler(logHandler);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  options.ui.log.handler = options.provider.log.handler = logHandler;

  let logLevelObj: ILogLevel = LogLevel.ERROR;
  if (options.log && isDebugMode()) {
    logLevelObj = LogLevel.DEBUG;
    options.log.level = LogLevel.DEBUG.name;
  } else if (options.log && options.log.level && LogLevel[options.log.level]) {
    logLevelObj = LogLevel[options.log.level];
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  options.ui.log.level = options.provider.log.level = logLevelObj.name;
  _setLogLevel(logLevelObj);
}

/**
 * gets the url query string parameter
 * @private
 * @param {string} name - name of query string param
 * @returns {?string} - value of the query string param or null if doesn't exist
 */
function getUrlParameter(name: string): string | null {
  const getUrlParamPolyfill = (name: string): string | null => {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    const isExist = location.search.indexOf(name) > -1;
    return results === null ? (isExist ? '' : null) : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };
  let value;
  if (window.URLSearchParams) {
    const urlParams = new URLSearchParams(window.location.search);
    value = urlParams.get(name);
  } else {
    value = getUrlParamPolyfill(name);
  }
  return value;
}

/**
 * get the server UIConf
 * @private
 * @returns {Object} - The server UIConf
 */
function getServerUIConf(): any {
  const uiConfId = UiConfIdSingleton.getInstance().getUiConfId();
  if (uiConfId !== '' && window.KalturaPlayers && window.KalturaPlayers[uiConfId]?.config) {
    return window.KalturaPlayers[uiConfId].config;
  }
  return window.__kalturaplayerdata || {};
}

/**
 * set the UIConfId if exists
 * @private
 * @param {PartialKPOptionsObject} options - partial user kaltura player options.
 * @returns {void}
 */
function setUIConfId(options: PartialKPOptionsObject): void {
  // Store uiConfId if it exists in options
  if (options.provider && options.provider.uiConfId) {
    UiConfIdSingleton.getInstance().setUiConfId(options.provider.uiConfId.toString());
  }
}

/**
 * Gets the default options after merging the user options with the uiConf options and the default internal options.
 * @private
 * @param {PartialKPOptionsObject} options - partial user kaltura player options.
 * @returns {KalturaPlayerConfig} - default kaltura player options.
 */
function getDefaultOptions(options: PartialKPOptionsObject): KalturaPlayerConfig {
  const targetId = createKalturaPlayerContainer(options.targetId);
  // TODO - fix all KalturaPlayerConfig and Partial relationships
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  let defaultOptions: KalturaPlayerConfig = {
    targetId: options.targetId,
    provider: {
      partnerId: options.provider.partnerId
    },
    ui: {
      targetId: targetId
    },
    plugins: {},
    advertising: {
      adBreaks: []
    },
    viewability: {
      observedThresholds: DEFAULT_OBSERVED_THRESHOLDS,
      playerThreshold: DEFAULT_PLAYER_THRESHOLD
    }
  };
  Utils.Object.mergeDeep(defaultOptions, options);

  if (!options.provider.ignoreServerConfig) {
    const serverUIConf = Utils.Object.copyDeep(getServerUIConf());
    delete serverUIConf.productVersion;
    defaultOptions = Utils.Object.mergeDeep({}, supportLegacyOptions(serverUIConf), defaultOptions);
  }

  checkNativeHlsSupport(defaultOptions);
  checkNativeTextTracksSupport(defaultOptions);
  setDefaultAnalyticsPlugin(defaultOptions);
  configureSmartTVDefaultOptions(defaultOptions);
  configureEdgeDRMDefaultOptions(defaultOptions);
  configureIMADefaultOptions(defaultOptions);
  configureDAIDefaultOptions(defaultOptions);
  configureBumperDefaultOptions(defaultOptions);
  maybeSetFullScreenConfig(defaultOptions);
  maybeSetCapabilitiesForIos(defaultOptions);
  return defaultOptions;
}

/**
 * Sets config option for native HLS playback
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function checkNativeHlsSupport(options: KalturaPlayerConfig): void {
  if ((Env.isMacOS && Env.isSafari) || Env.isIOS) {
    const preferNativeHlsValue = Utils.Object.getPropertyPath(options, 'playback.preferNative.hls');
    if (typeof preferNativeHlsValue !== 'boolean') {
      Utils.Object.mergeDeep(options, {
        playback: {
          preferNative: {
            hls: true
          }
        }
      });
    }
  }
}

/**
 * Sets config option for native text track support
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function checkNativeTextTracksSupport(options: KalturaPlayerConfig): void {
  if ((Env.isMacOS && Env.isSafari) || Env.isIOS) {
    const useNativeTextTrack = Utils.Object.getPropertyPath(options, 'text.useNativeTextTrack');
    if (typeof useNativeTextTrack !== 'boolean') {
      Utils.Object.mergeDeep(options, {
        text: {
          useNativeTextTrack: true
        }
      });
    }
  }
}

/**
 * Sets config option for Ads with MSE
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function _configureAdsWithMSE(options: KalturaPlayerConfig): void {
  const playAdsWithMSE = Utils.Object.getPropertyPath(options, 'playback.playAdsWithMSE');
  if (typeof playAdsWithMSE !== 'boolean') {
    options = Utils.Object.createPropertyPath(options, 'playback.playAdsWithMSE', true);
  }
  const disableMediaPreloadIma = Utils.Object.getPropertyPath(options, 'plugins.ima.disableMediaPreload');
  const disableMediaPreloadBumper = Utils.Object.getPropertyPath(options, 'plugins.bumper.disableMediaPreload');

  if (options.plugins && options.plugins.ima && typeof disableMediaPreloadIma !== 'boolean') {
    options = Utils.Object.createPropertyPath(options, 'plugins.ima.disableMediaPreload', true);
  }
  if (options.plugins && options.plugins.bumper && typeof disableMediaPreloadBumper !== 'boolean') {
    options = Utils.Object.createPropertyPath(options, 'plugins.bumper.disableMediaPreload', true);
  }
}

/**
 * Sets config option for LG TV SDK 2 live which has problem with long duration buffer
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function _configureLGSDK2HlsLiveConfig(options: KalturaPlayerConfig): void {
  const hlsLiveConfig = Utils.Object.getPropertyPath(options, 'playback.options.html5.hls.liveSyncDurationCount');
  //webos SDK 2 and less detect as safari browser greater version is chrome
  if (typeof hlsLiveConfig !== 'boolean' && Env.isSafari) {
    options = Utils.Object.createPropertyPath(options, 'playback.options.html5.hls.liveSyncDurationCount', 2);
  }
}

/**
 * Sets config option for smart TV
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function configureSmartTVDefaultOptions(options: KalturaPlayerConfig): void {
  if (Env.isSmartTV) {
    //relevant for LG SDK 4 and HISENSE which doesn't support our check for autoplay with base64 source
    setCapabilities(EngineType.HTML5, { autoplay: true });
    _configureAdsWithMSE(options);
    _configureLGSDK2HlsLiveConfig(options);
    if (options.plugins && options.plugins.ima) {
      const imaForceReload = Utils.Object.getPropertyPath(options, 'plugins.ima.forceReloadMediaAfterAds');
      const delayUntilSourceSelected = Utils.Object.getPropertyPath(options, 'plugins.ima.delayInitUntilSourceSelected');

      if (typeof imaForceReload !== 'boolean') {
        options = Utils.Object.createPropertyPath(options, 'plugins.ima.forceReloadMediaAfterAds', true);
      }
      if (typeof delayUntilSourceSelected !== 'boolean') {
        options = Utils.Object.createPropertyPath(options, 'plugins.ima.delayInitUntilSourceSelected', true);
      }
    }
    if (options.plugins && options.plugins.youbora) {
      const playheadMonitorInterval = Utils.Object.getPropertyPath(options, 'plugins.youbora.playheadMonitorInterval');
      if (typeof playheadMonitorInterval !== 'number') {
        options = Utils.Object.createPropertyPath(options, 'plugins.youbora.playheadMonitorInterval', 2000);
      }
    }
    const lowLatencyMode = Utils.Object.getPropertyPath(options, 'streaming.lowLatencyMode');
    if (typeof lowLatencyMode !== 'boolean') {
      options = Utils.Object.createPropertyPath(options, 'streaming.lowLatencyMode', false);
    }
  }
}

/**
 * prefer Playready in edge - from chromium version of edge Widevine is option as well
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function configureEdgeDRMDefaultOptions(options: KalturaPlayerConfig): void {
  if (Env.browser.name === 'Edge') {
    const keySystem = Utils.Object.getPropertyPath(options, 'drm.keySystem');
    if (!keySystem) {
      if (Env.os.name === 'Windows') {
        options = Utils.Object.createPropertyPath(options, 'drm.keySystem', DrmScheme.PLAYREADY);
      } else {
        options = Utils.Object.createPropertyPath(options, 'drm.keySystem', DrmScheme.WIDEVINE);
      }
    }
  }
}

/**
 * Sets default config option for ima plugin
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function configureIMADefaultOptions(options: KalturaPlayerConfig): void {
  if (Env.isIOS && options.plugins && options.plugins.ima && !options.plugins.ima['disable']) {
    const playsinline = Utils.Object.getPropertyPath(options, 'playback.playsinline');
    const disableMediaPreloadIma = Utils.Object.getPropertyPath(options, 'plugins.ima.disableMediaPreload');
    if (playsinline === false && typeof disableMediaPreloadIma !== 'boolean') {
      Utils.Object.createPropertyPath(options, 'plugins.ima.disableMediaPreload', true);
    }
  }
}

/**
 * Sets default config option for dai plugin
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function configureDAIDefaultOptions(options: KalturaPlayerConfig): void {
  if (options.plugins && options.plugins.imadai && !options.plugins.imadai['disable']) {
    const autoStartLoadConfig = Utils.Object.getPropertyPath(options, 'playback.options.html5.hls.autoStartLoad');
    if (typeof autoStartLoadConfig !== 'boolean') {
      Utils.Object.mergeDeep(options, {
        playback: {
          options: {
            html5: {
              hls: {
                autoStartLoad: false
              }
            }
          }
        }
      });
    }
  }
}

/**
 * Sets default config option for bumper plugin when ima-dai enabled
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function configureBumperDefaultOptions(options: KalturaPlayerConfig): void {
  const bumperConfig = Utils.Object.getPropertyPath(options, 'plugins.bumper');
  const daiConfig = Utils.Object.getPropertyPath(options, 'plugins.imadai');
  if (bumperConfig) {
    const newBumperConfig: any = {};
    if (
      typeof bumperConfig.playOnMainVideoTag !== 'boolean' &&
      (Env.isSmartTV || (Env.isIOS && options.playback && options.playback.playsinline === false))
    ) {
      newBumperConfig['playOnMainVideoTag'] = true;
    }
    if (daiConfig && !daiConfig.disable) {
      if (!Array.isArray(bumperConfig.position)) {
        newBumperConfig['position'] = [0];
      }
      if (typeof bumperConfig.disableMediaPreload !== 'boolean') {
        newBumperConfig['disableMediaPreload'] = true;
      }
    }
    Utils.Object.mergeDeep(options, {
      plugins: {
        bumper: newBumperConfig
      }
    });
  }
}

/**
 * print kaltura version to log by configuration
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function printKalturaPlayerVersionToLog(options: PartialKPOptionsObject | LegacyPartialKPOptionsObject): void {
  const playerVersion = Utils.Object.getPropertyPath(options, 'log.playerVersion');
  if (playerVersion !== false) {
    _setLogLevel(LogLevel.INFO);
    getLogger().log(`%c ${__NAME__} ${__VERSION__}`, 'color: #ff98f9;  font-size: large');
    getLogger().log(`%c For more details see ${__PACKAGE_URL__}`, 'color: #ff98f9;');
  }
}

/**
 * Transform options structure from legacy structure to new structure.
 * @private
 * @param {Object} options - The options with the legacy structure.
 * @return {PartialKPOptionsObject} - Partial options with the expected structure.
 */
function supportLegacyOptions(options: LegacyPartialKPOptionsObject): PartialKPOptionsObject {
  const removePlayerEntry = (): void => {
    if (options.player) {
      setupMessages.push({
        level: 'warn',
        msg: `Path config.player will be deprecated soon. Please update your config structure as describe here: ${__CONFIG_DOCS_URL__}`
      });
      const playerOptions = Utils.Object.copyDeep(options.player);
      delete options.player;
      Utils.Object.mergeDeep(options, playerOptions);
    }
  };
  const moveProp = (propPath: string, targetPath: string): void => {
    if (Utils.Object.hasPropertyPath(options, propPath)) {
      setupMessages.push({
        level: 'warn',
        msg: `Path config.player.${propPath} will be deprecated soon. Please update your config structure as describe here: ${__CONFIG_DOCS_URL__}`
      });
      if (!Utils.Object.hasPropertyPath(options, targetPath)) {
        const propValue = Utils.Object.getPropertyPath(options, propPath);
        const propObj = Utils.Object.createPropertyPath({}, targetPath, propValue);
        Utils.Object.mergeDeep(options, propObj);
        Utils.Object.deletePropertyPath(options, propPath);
      } else {
        Utils.Object.deletePropertyPath(options, propPath);
      }
    }
  };
  const moves = [
    ['duration', 'sources.duration'],
    ['type', 'sources.type'],
    ['dvr', 'sources.dvr'],
    ['id', 'sources.id'],
    ['name', 'metadata.name'],
    ['metadata.poster', 'sources.poster'],
    ['metadata', 'sources.metadata'],
    ['logLevel', 'log.level'],
    ['ui.components.fullscreen.inBrowserFullscreenForIOS', 'playback.inBrowserFullscreen'],
    ['playback.enableCEA708Captions', 'text.enableCEA708Captions'],
    ['playback.useNativeTextTrack', 'text.useNativeTextTrack'],
    ['playback.options.html5.dash.useShakaTextTrackDisplay', 'text.useShakaTextTrackDisplay'],
    ['playback.captionsTextTrack1Label', 'text.captionsTextTrack1Label'],
    ['playback.captionsTextTrack1LanguageCode', 'text.captionsTextTrack1LanguageCode'],
    ['playback.captionsTextTrack2Label', 'text.captionsTextTrack2Label'],
    ['playback.captionsTextTrack2LanguageCode', 'text.captionsTextTrack2LanguageCode'],
    ['plugins.visibility.threshold', 'viewability.playerThreshold'],
    ['plugins.visibility.floating', 'plugins.floating'],
    ['playback.startTime', 'sources.startTime']
  ];
  removePlayerEntry();
  moves.forEach((move) => moveProp(move[0], move[1]));
  return <PartialKPOptionsObject>options;
}

/**
 * Prints early setup messages.
 * @private
 * @returns {void}
 */
function printSetupMessages(): void {
  setupMessages.forEach((msgObj) => getLogger('KalturaPlayer:Setup')[msgObj.level](msgObj.msg));
}

/**
 * Prints early setup messages.
 * @private
 * @param {Player} player - The player.
 * @param {string} engine - The player engine name.
 * @param {string} format - The player engine format.
 * @returns {PKPlaybackConfigObject} - The playback config.
 */
function addEngineToStreamPriority(player: KalturaPlayer, engine: string, format: string): PlaybackConfig {
  const playbackConfig = player.config.playback;
  let hasYoutube = false;
  playbackConfig.streamPriority.forEach((sp) => {
    if (sp.engine === engine) {
      hasYoutube = true;
    }
  });
  if (!hasYoutube) {
    playbackConfig.streamPriority.push({
      engine: engine,
      format: format
    });
  }

  return playbackConfig;
}

/**
 * set stream priority according to playerConfig
 * @param {Player} player - player
 * @param {PKSourcesConfigObject} sources - sources
 * @return {void}
 */
function maybeSetStreamPriority(player: KalturaPlayer, sources: PKSourcesConfigObject): PlaybackConfig | null {
  if (sources && hasYoutubeSource(sources)) {
    return addEngineToStreamPriority(player, 'youtube', 'progressive');
  }
  if (sources && hasImageSource(sources)) {
    return addEngineToStreamPriority(player, 'image', 'image');
  }
  if (sources && hasDocumentSource(sources)) {
    return addEngineToStreamPriority(player, 'document', 'document');
  }
  return null;
}

/**
 * returns true if sources contain youtube video source
 * @param {PKSourcesConfigObject} sources - thr sources object
 * @returns {boolean} - true if sources contain youtube source
 */
function hasYoutubeSource(sources: PKSourcesConfigObject): boolean {
  const source = sources && sources.progressive;
  return !!(source && source[0] && source[0].mimetype === 'video/youtube');
}

/**
 * returns true if sources contain image source
 * @param {PKSourcesConfigObject} sources - thr sources object
 * @returns {boolean} - true if sources contain image source
 */
function hasImageSource(sources: PKSourcesConfigObject): boolean {
  // const IMAGE_MIME_TYPES = /(^image)(\/)[a-zA-Z0-9_]*/;
  const source = sources && sources.image;
  // return !!(source && source[0] && source[0].mimetype.match(IMAGE_MIME_TYPES));
  return !!(source && source[0]);
}

/**
 * returns true if sources contain document source
 * @param {PKSourcesConfigObject} sources - thr sources object
 * @returns {boolean} - true if sources contain document source
 */
function hasDocumentSource(sources: PKSourcesConfigObject): boolean {
  // eslint-disable-next-line  @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const source = sources && sources.document;
  return !!(source && source[0]);
}

/**
 * Maybe set inBrowserFullscreen config based on the plugins.
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function maybeSetFullScreenConfig(options: KalturaPlayerConfig): void {
  const vrPlugin = Utils.Object.getPropertyPath(options, 'plugins.vr');
  if (vrPlugin && !vrPlugin.disable) {
    const fullscreenConfig = Utils.Object.getPropertyPath(options, 'playback.inBrowserFullscreen');
    if (typeof fullscreenConfig !== 'boolean') {
      Utils.Object.mergeDeep(options, {
        playback: {
          inBrowserFullscreen: true
        }
      });
    }
  }
}

/**
 * Set the autoplay capability to false for native Ios player.
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
function maybeSetCapabilitiesForIos(options: KalturaPlayerConfig): void {
  if (Env.isIOS) {
    const playsinline = Utils.Object.getPropertyPath(options, 'playback.playsinline');
    const isAirPlayConfigured = Utils.Object.hasPropertyPath(options, 'plugins.airplay');
    const isPlaysinline = playsinline !== false;
    if (isAirPlayConfigured) {
      setCapabilities(EngineType.HTML5, {
        autoplay: false,
        mutedAutoPlay: isPlaysinline
      });
    } else if (Env.device.model === 'iPhone' && !isPlaysinline) {
      setCapabilities(EngineType.HTML5, {
        autoplay: false,
        mutedAutoPlay: false
      });
    }
  }
}

/**
 * Merge the provider plugins config (e.g. bumper) into the app config and returns it and the respective app config to restore in change media
 * @param {PluginsConfig} providerPluginsConfig - the provider plugins config
 * @param {KalturaPlayerConfig} appPluginsConfig - the entire app plugins config
 * @returns {Array<PluginsConfig>} - the merged plugins config and the partial respective app plugins config
 */
function mergeProviderPluginsConfig(providerPluginsConfig: PluginsConfig, appPluginsConfig: PluginsConfig): Array<PluginsConfig> {
  const mergePluginConfig: PluginsConfig = {};
  const respectiveAppPluginsConfig: PluginsConfig = {};
  Utils.Object.isObject(providerPluginsConfig) &&
    Object.entries(providerPluginsConfig).forEach(([pluginName, pluginConfig]: [string, any]) => {
      mergePluginConfig[pluginName] = {} as BasePlugin;
      respectiveAppPluginsConfig[pluginName] = {} as BasePlugin;
      Object.entries(pluginConfig).forEach(([key, providerValue]) => {
        const appValue = Utils.Object.getPropertyPath(appPluginsConfig[pluginName], key);
        mergePluginConfig[pluginName][key] = appValue || providerValue;
        respectiveAppPluginsConfig[pluginName][key] = appValue;
      });
    });
  return [mergePluginConfig, respectiveAppPluginsConfig];
}

function maybeLoadInitialServerResponse(player: KalturaPlayer): void {
  const { serviceUrl, initCallToServer } = player.provider.env;
  if (initCallToServer) {
    const url = serviceUrl + initCallToServer + '/format/1';
    fetch(url).then((response) => {
      response.json().then((data) => {
        getLogger().log(`Initial server response: ${data}`);
      });
    });
  }
  return;
}

function getLogBuffer(): string {
  return logBuffer.join('');
}

export {
  printSetupMessages,
  supportLegacyOptions,
  printKalturaPlayerVersionToLog,
  setStorageConfig,
  applyStorageSupport,
  applyCastSupport,
  setStorageTextStyle,
  attachToFirstClick,
  validateConfig,
  validateProviderConfig,
  setLogOptions,
  maybeApplyStartTimeQueryParam,
  maybeApplyEndTimeQueryParam,
  maybeApplyClipQueryParams,
  createKalturaPlayerContainer,
  checkNativeHlsSupport,
  getDefaultOptions,
  maybeSetStreamPriority,
  hasYoutubeSource,
  hasImageSource,
  hasDocumentSource,
  mergeProviderPluginsConfig,
  getServerUIConf,
  initializeStorageManagers,
  maybeLoadInitialServerResponse,
  KALTURA_PLAYER_START_TIME_QS,
  getLogBuffer,
  setUIConfId
};
