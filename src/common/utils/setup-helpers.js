// @flow
import {setDefaultAnalyticsPlugin} from 'player-defaults';
import {Env, TextStyle, Utils, setCapabilities, EngineType} from '@playkit-js/playkit-js';
import {ValidationErrorType} from './validation-error';
import StorageManager from '../storage/storage-manager';
import type {LogLevelObject} from './logger';
import getLogger, {LogLevel, setLogLevel as _setLogLevel} from './logger';
import {configureExternalStreamRedirect} from './external-stream-redirect-helper';
import {RemotePlayerManager} from '../cast/remote-player-manager';
import {RemoteControl} from '../cast/remote-control';
import {KalturaPlayer} from '../../kaltura-player';

const setupMessages: Array<Object> = [];
const CONTAINER_CLASS_NAME: string = 'kaltura-player-container';
const KALTURA_PLAYER_DEBUG_QS: string = 'debugKalturaPlayer';

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
  if (!providerOptions.partnerId && providerOptions.partnerId !== 0) {
    throw new Error(ValidationErrorType.PARTNER_ID_REQUIRED);
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
  if (isIos()) {
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
function setLogLevel(options: KPOptionsObject): void {
  let logLevelObj: LogLevelObject = LogLevel.ERROR;
  if (isDebugMode()) {
    logLevelObj = LogLevel.DEBUG;
    options.logLevel = LogLevel.DEBUG.name;
  } else if (options.logLevel && LogLevel[options.logLevel]) {
    logLevelObj = LogLevel[options.logLevel];
  }
  options.ui.logLevel = options.provider.logLevel = logLevelObj.name;
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
  configureVrDefaultOptions(defaultOptions);
  configureExternalStreamRedirect(defaultOptions);
  return defaultOptions;
}

/**
 * Sets config option for native HLS playback
 * @private
 * @param {KPOptionsObject} options - kaltura player options
 * @returns {void}
 */
function checkNativeHlsSupport(options: KPOptionsObject): void {
  if (isSafari() || isIos()) {
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
  if (isSafari() || isIos()) {
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
 * Sets config option fullscreen element for Vr Mode support
 * @private
 * @param {KPOptionsObject} options - kaltura player options
 * @returns {void}
 */
function configureVrDefaultOptions(options: KPOptionsObject): void {
  if (options.plugins && options.plugins.vr && !options.plugins.vr.disable) {
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

export {
  printSetupMessages,
  supportLegacyOptions,
  setStorageConfig,
  applyStorageSupport,
  applyCastSupport,
  setStorageTextStyle,
  attachToFirstClick,
  validateConfig,
  setLogLevel,
  createKalturaPlayerContainer,
  checkNativeHlsSupport,
  getDefaultOptions,
  isSafari,
  isIos,
  maybeSetStreamPriority,
  hasYoutubeSource
};
