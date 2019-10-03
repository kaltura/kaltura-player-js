// @flow
import {setDefaultAnalyticsPlugin} from 'player-defaults';
import {Env, TextStyle, Utils, setCapabilities, EngineType} from '@playkit-js/playkit-js';
import {ValidationErrorType} from './validation-error';
import StorageManager from '../storage/storage-manager';
import type {LogLevelObject} from './logger';
import getLogger, {LogLevel, setLogHandler, setLogLevel as _setLogLevel} from './logger';
import {configureExternalStreamRedirect} from './external-stream-redirect-helper';
import {RemotePlayerManager} from '../cast/remote-player-manager';
import {RemoteControl} from '../cast/remote-control';
import {KalturaPlayer} from '../../kaltura-player';
import {addClientTag, addReferrer, updateSessionIdInUrl} from './kaltura-params';

const setupMessages: Array<Object> = [];
const CONTAINER_CLASS_NAME: string = 'kaltura-player-container';
const KALTURA_PLAYER_DEBUG_QS: string = 'debugKalturaPlayer';
const KAVA_DEFAULT_IMPRESSION =
  'https://analytics.kaltura.com/api_v3/index.php?service=analytics&action=trackEvent&apiVersion=3.3.0&format=1&eventType=1&partnerId=2504201&entryId=1_3bwzbc9o&&eventIndex=1&position=0';

declare var __CONFIG_DOCS_URL__: string;

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
  validateProviderConfig(options.provider);
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
 * Validate the initial user input for the provider options.
 * @private
 * @param {ProviderOptionsObject} providerOptions - provider options.
 * @returns {void}
 */
function validateProviderConfig(providerOptions: ProviderOptionsObject): void {
  if (!providerOptions.partnerId) {
    //create source object as a 'hack' to be able to use utility functions on url
    const source = {
      url: KAVA_DEFAULT_IMPRESSION,
      mimetype: ''
    };
    addReferrer(source);
    addClientTag(source);
    updateSessionIdInUrl(source, Utils.Generator.guid() + ':' + Utils.Generator.guid());
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
 * Sets the storage config on the player config if certain conditions are met.
 * @private
 * @param {KPOptionsObject} options - kaltura player options
 * @returns {void}
 */
function setStorageConfig(options: KPOptionsObject): void {
  if (!options.disableUserCache && StorageManager.isLocalStorageAvailable() && StorageManager.hasStorage()) {
    Utils.Object.mergeDeep(options, StorageManager.getStorageConfig());
  }
}

/**
 * Applies cache support if it's supported by the environment.
 * @private
 * @param {KalturaPlayer} player - The Kaltura player.
 * @returns {void}
 */
function applyStorageSupport(player: KalturaPlayer): void {
  if (StorageManager.isLocalStorageAvailable()) {
    StorageManager.attach(player);
  }
}

/**
 * Loads the registered remote players.
 * @private
 * @param {KPOptionsObject} defaultOptions - The kaltura player options.
 * @param {KalturaPlayer} player - The Kaltura player.
 * @returns {void}
 */
function applyCastSupport(defaultOptions: KPOptionsObject, player: KalturaPlayer): void {
  if (defaultOptions.cast) {
    RemotePlayerManager.load(defaultOptions.cast, new RemoteControl(player));
  }
}

/**
 * Sets the player text style from storage.
 * @private
 * @param {KalturaPlayer} player - The Kaltura player.
 * @returns {void}
 */
function setStorageTextStyle(player: KalturaPlayer): void {
  if (StorageManager.isLocalStorageAvailable()) {
    const textStyleObj = StorageManager.getPlayerTextStyle();
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
function attachToFirstClick(player: Player): void {
  if (isIos() || Env.isIPadOS) {
    const onUIClicked = () => {
      player.removeEventListener(player.Event.UI.UI_CLICKED, onUIClicked);
      setCapabilities(EngineType.HTML5, {autoplay: true});
    };
    const onSourceSelected = () => {
      player.removeEventListener(player.Event.SOURCE_SELECTED, onSourceSelected);
      player.addEventListener(player.Event.UI.UI_CLICKED, onUIClicked);
    };
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
  } else if (window.URLSearchParams) {
    const urlParams = new URLSearchParams(window.location.search);
    isDebugMode = urlParams.has(KALTURA_PLAYER_DEBUG_QS);
  } else {
    isDebugMode = !!getUrlParameter(KALTURA_PLAYER_DEBUG_QS);
  }
  return isDebugMode;
}

/**
 * set the logger
 * @private
 * @param {KPOptionsObject} options - kaltura player options
 * @returns {void}
 */
function setLogOptions(options: KPOptionsObject): void {
  if (!Utils.Object.getPropertyPath(options, 'ui.log')) {
    Utils.Object.createPropertyPath(options, 'ui.log', {});
  }
  if (!Utils.Object.getPropertyPath(options, 'provider.log')) {
    Utils.Object.createPropertyPath(options, 'provider.log', {});
  }
  if (!Utils.Object.getPropertyPath(options, 'log')) {
    Utils.Object.createPropertyPath(options, 'log', {});
  }

  if (options.log && typeof options.log.handler === 'function') {
    setLogHandler(options.log.handler);
    // $FlowFixMe
    options.ui.log.handler = options.provider.log.handler = options.log.handler;
  }

  let logLevelObj: LogLevelObject = LogLevel.ERROR;
  if (options.log && isDebugMode()) {
    logLevelObj = LogLevel.DEBUG;
    options.log.level = LogLevel.DEBUG.name;
  } else if (options.log && options.log.level && LogLevel[options.log.level]) {
    logLevelObj = LogLevel[options.log.level];
  }

  // $FlowFixMe
  options.ui.log.level = options.provider.log.level = logLevelObj.name;
  _setLogLevel(logLevelObj);
}

/**
 * gets the url query string parameter
 * @private
 * @param {string} name - name of query string param
 * @returns {string} - value of the query string param
 */
function getUrlParameter(name: string) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

/**
 * Checks if the server UIConf exist
 * @private
 * @param {number} uiConfId - The server UIConf
 * @returns {boolean} - server UIConf exist
 */
function serverUIConfExist(uiConfId: ?number): boolean {
  const UIConf = Utils.Object.getPropertyPath(window, '__kalturaplayerdata.UIConf');
  const hasUiConfId = uiConfId !== null && uiConfId !== undefined;
  return hasUiConfId && ((UIConf !== undefined && UIConf[uiConfId] !== undefined) || false);
}

/**
 * Extracts the server UIConf
 * @private
 * @param {number} uiConfId - The server UIConf
 * @returns {Object} - The server UIConf
 */
function extractServerUIConf(uiConfId: number): Object {
  let config = {};
  if (serverUIConfExist(uiConfId)) {
    config = window.__kalturaplayerdata.UIConf[uiConfId];
  }
  return config;
}

/**
 * Gets the default options after merging the user options with the uiConf options and the default internal options.
 * @private
 * @param {PartialKPOptionsObject} options - partial user kaltura player options.
 * @returns {KPOptionsObject} - default kaltura player options.
 */
function getDefaultOptions(options: PartialKPOptionsObject): KPOptionsObject {
  const targetId = createKalturaPlayerContainer(options.targetId);
  let defaultOptions: KPOptionsObject = {
    targetId: options.targetId,
    provider: {
      partnerId: options.provider.partnerId
    },
    ui: {
      targetId: targetId
    }
  };
  Utils.Object.mergeDeep(defaultOptions, options);
  if (defaultOptions.provider.uiConfId) {
    const uiConfOptions = supportLegacyOptions(extractServerUIConf(defaultOptions.provider.uiConfId));
    defaultOptions = Utils.Object.mergeDeep({}, uiConfOptions, defaultOptions);
  }
  checkNativeHlsSupport(defaultOptions);
  checkNativeTextTracksSupport(defaultOptions);
  setDefaultAnalyticsPlugin(defaultOptions);
  configureLGTVDefaultOptions(defaultOptions);
  configureIMADefaultOptions(defaultOptions);
  configureDAIDefaultOptions(defaultOptions);
  configureBumperDefaultOptions(defaultOptions);
  configureExternalStreamRedirect(defaultOptions);
  maybeSetFullScreenConfig(defaultOptions);
  return defaultOptions;
}

/**
 * Sets config option for native HLS playback
 * @private
 * @param {KPOptionsObject} options - kaltura player options
 * @returns {void}
 */
function checkNativeHlsSupport(options: KPOptionsObject): void {
  if ((isMacOS() && isSafari()) || isIos()) {
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
 * @param {KPOptionsObject} options - kaltura player options
 * @returns {void}
 */
function checkNativeTextTracksSupport(options: KPOptionsObject): void {
  if ((isMacOS() && isSafari()) || isIos()) {
    const useNativeTextTrack = Utils.Object.getPropertyPath(options, 'playback.useNativeTextTrack');
    if (typeof useNativeTextTrack !== 'boolean') {
      Utils.Object.mergeDeep(options, {
        playback: {
          useNativeTextTrack: true
        }
      });
    }
  }
}

/**
 * Sets config option for Ads with MSE
 * @private
 * @param {KPOptionsObject} options - kaltura player options
 * @returns {void}
 */
function _configureAdsWithMSE(options: KPOptionsObject): void {
  const playAdsWithMSE = Utils.Object.getPropertyPath(options, 'playback.playAdsWithMSE');
  //dai should play without playAdsWithMSE config
  if (typeof playAdsWithMSE !== 'boolean') {
    if (options.plugins && options.plugins.imadai && !options.plugins.imadai.disable) {
      options = Utils.Object.createPropertyPath(options, 'playback.playAdsWithMSE', false);
    } else {
      options = Utils.Object.createPropertyPath(options, 'playback.playAdsWithMSE', true);
    }
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
 * Sets config option for LG TV
 * @private
 * @param {KPOptionsObject} options - kaltura player options
 * @returns {void}
 */
function configureLGTVDefaultOptions(options: KPOptionsObject): void {
  if (Env.isSmartTV) {
    //relevant for LG SDK 4 which doesn't support our check for autoplay
    setCapabilities(EngineType.HTML5, {autoplay: true});
    _configureAdsWithMSE(options);

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
  }
}

/**
 * Sets default config option for ima plugin
 * @private
 * @param {KPOptionsObject} options - kaltura player options
 * @returns {void}
 */
function configureIMADefaultOptions(options: KPOptionsObject): void {
  if (isIos() && options.plugins && options.plugins.ima && !options.plugins.ima.disable) {
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
 * @param {KPOptionsObject} options - kaltura player options
 * @returns {void}
 */
function configureDAIDefaultOptions(options: KPOptionsObject): void {
  if (options.plugins && options.plugins.imadai && !options.plugins.imadai.disable) {
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
 * @param {KPOptionsObject} options - kaltura player options
 * @returns {void}
 */
function configureBumperDefaultOptions(options: KPOptionsObject): void {
  const bumperConfig = Utils.Object.getPropertyPath(options, 'plugins.bumper');
  const daiConfig = Utils.Object.getPropertyPath(options, 'plugins.imadai');
  if (bumperConfig) {
    const newBumperConfig: Object = {};
    if (
      typeof bumperConfig.playOnMainVideoTag !== 'boolean' &&
      (Env.isSmartTV || (isIos() && options.playback && options.playback.playsinline === false))
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
 * @param {KPOptionsObject} options - kaltura player options
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
function supportLegacyOptions(options: Object): PartialKPOptionsObject {
  const removePlayerEntry = () => {
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
  const moveProp = (propPath: string, targetPath: string) => {
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
    ['ui.components.fullscreen.inBrowserFullscreenForIOS', 'playback.inBrowserFullscreen']
  ];
  removePlayerEntry();
  moves.forEach(move => moveProp(move[0], move[1]));
  return options;
}

/**
 * Prints early setup messages.
 * @private
 * @returns {void}
 */
function printSetupMessages(): void {
  setupMessages.forEach(msgObj => getLogger('KalturaPlayer:Setup')[msgObj.level](msgObj.msg));
}

/**
 * Returns true if user agent indicate that browser is Safari
 * @private
 * @returns {boolean} - if browser is Safari
 */
function isSafari(): boolean {
  return Utils.Object.hasPropertyPath(Env, 'browser.name') && Env.browser.name.includes('Safari');
}

/**
 * Returns true if user agent indicate that os is mac
 * @private
 * @returns {boolean} - if browser is Safari
 */
function isMacOS(): boolean {
  return Env.os.name === 'Mac OS';
}

/**
 * Returns true if user agent indicate that browser is Chrome on iOS
 * @private
 * @returns {boolean} - if browser is Chrome on iOS
 */
function isIos(): boolean {
  return Env.os.name === 'iOS';
}

/**
 * set stream priority according to playerConfig
 * @param {Player} player - player
 * @param {PartialKPOptionsObject} playerConfig - player config
 * @return {void}
 */
function maybeSetStreamPriority(player: Player, playerConfig: PartialKPOptionsObject): void {
  if (playerConfig.sources && hasYoutubeSource(playerConfig.sources)) {
    const playbackConfig = player.config.playback;
    let hasYoutube = false;
    playbackConfig.streamPriority.forEach(sp => {
      if (sp.engine === 'youtube') {
        hasYoutube = true;
      }
    });
    if (!hasYoutube) {
      playbackConfig.streamPriority.push({
        engine: 'youtube',
        format: 'progressive'
      });
    }

    playerConfig.playback = playbackConfig;
  }
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
 * Maybe set inBrowserFullscreen config based on the plugins.
 * @private
 * @param {KPOptionsObject} options - kaltura player options
 * @returns {void}
 */
function maybeSetFullScreenConfig(options: KPOptionsObject): void {
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
  setLogOptions,
  createKalturaPlayerContainer,
  checkNativeHlsSupport,
  getDefaultOptions,
  isSafari,
  isIos,
  maybeSetStreamPriority,
  hasYoutubeSource
};
