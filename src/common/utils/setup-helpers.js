// @flow
import {setDefaultAnalyticsPlugin} from 'player-defaults';
import {Env, TextStyle, Utils, setCapabilities, EngineType} from '@playkit-js/playkit-js';
import {ValidationErrorType} from './validation-error';
import StorageManager from '../storage/storage-manager';
import type {LogLevelObject} from './logger';
import getLogger, {LogLevel, setLogLevel as _setLogLevel} from './logger';
import {configureExternalStreamRedirect} from './external-stream-redirect-helper';

const setupMessages: Array<Object> = [];
const CONTAINER_CLASS_NAME: string = 'kaltura-player-container';
const KALTURA_PLAYER_DEBUG_QS: string = 'debugKalturaPlayer';

declare var __CONFIG_DOCS_URL__: string;

/**
 * Validate the initial user config.
 * @param {PartialKalturaPlayerOptionsObject} options - partial kaltura player options.
 * @returns {void}
 */
function validateConfig(options: PartialKalturaPlayerOptionsObject): void {
  if (!options) {
    throw new Error(ValidationErrorType.INITIAL_CONFIG_REQUIRED);
  }
  validateTargetId(options.targetId);
  validateProviderConfig(options.provider);
}

/**
 * Validate the user input for target id.
 * @param {string} targetId - The DOM element id which the player will be append to.
 * @returns {void}
 */
function validateTargetId(targetId: string): void {
  if (!targetId) {
    throw new Error(ValidationErrorType.TARGET_ID_REQUIRED);
  }
  if (!document.getElementById(targetId)) {
    throw new Error(ValidationErrorType.DOM_ELEMENT_WITH_TARGET_ID_REQUIRED + targetId);
  }
}

/**
 * Validate the initial user input for the provider options.
 * @param {ProviderOptionsObject} providerOptions - provider options.
 * @returns {void}
 */
function validateProviderConfig(providerOptions: ProviderOptionsObject): void {
  if (!providerOptions.partnerId) {
    throw new Error(ValidationErrorType.PARTNER_ID_REQUIRED);
  }
}

/**
 * Creates the player container dom element.
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
 * @param {KalturaPlayerOptionsObject} options - kaltura player options
 * @returns {void}
 */
function setStorageConfig(options: KalturaPlayerOptionsObject): void {
  if (!options.disableUserCache && StorageManager.isLocalStorageAvailable() && StorageManager.hasStorage()) {
    Utils.Object.mergeDeep(options, StorageManager.getStorageConfig());
  }
}

/**
 * Applies cache support if it's supported by the environment.
 * @param {Player} player - The Kaltura player.
 * @returns {void}
 */
function applyStorageSupport(player: Player): void {
  if (StorageManager.isLocalStorageAvailable()) {
    StorageManager.attach(player);
  }
}

/**
 * Sets the player text style from storage.
 * @param {Player} player - The Kaltura player.
 * @returns {void}
 */
function setStorageTextStyle(player: Player): void {
  if (StorageManager.isLocalStorageAvailable()) {
    const textStyleObj = StorageManager.getPlayerTextStyle();
    if (textStyleObj) {
      player.textStyle = Utils.Object.mergeDeep(new TextStyle(), textStyleObj);
    }
  }
}

/**
 * Call to setCapabilities on the first UI_CLICKED event
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
 * @param {KalturaPlayerOptionsObject} options - kaltura player options
 * @returns {void}
 */
function setLogLevel(options: KalturaPlayerOptionsObject): void {
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
 * @param {PartialKalturaPlayerOptionsObject} options - partial user kaltura player options.
 * @returns {KalturaPlayerOptionsObject} - default kaltura player options.
 */
function getDefaultOptions(options: PartialKalturaPlayerOptionsObject): KalturaPlayerOptionsObject {
  const targetId = createKalturaPlayerContainer(options.targetId);
  let defaultOptions: KalturaPlayerOptionsObject = {
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
  configureExternalStreamRedirect(defaultOptions);
  configureDelayAdsInitialization(defaultOptions);
  return defaultOptions;
}

/**
 * Sets config option for native HLS playback
 * @param {KalturaPlayerOptionsObject} options - kaltura player options
 * @returns {void}
 */
function checkNativeHlsSupport(options: KalturaPlayerOptionsObject): void {
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
 * Configures the delayInitUntilSourceSelected property for the ads plugin based on the runtime platform and the playsinline config value.
 * @param {KalturaPlayerOptionsObject} options - kaltura player options
 * @returns {void}
 */
function configureDelayAdsInitialization(options: KalturaPlayerOptionsObject): void {
  if (isIos() && options.plugins && options.plugins.ima) {
    const playsinline = Utils.Object.getPropertyPath(options, 'playback.playsinline');
    const delayInitUntilSourceSelected = Utils.Object.getPropertyPath(options, 'plugins.ima.delayInitUntilSourceSelected');
    if ((typeof playsinline !== 'boolean' || playsinline === true) && typeof delayInitUntilSourceSelected !== 'boolean') {
      Utils.Object.mergeDeep(options, {
        plugins: {
          ima: {
            delayInitUntilSourceSelected: true
          }
        }
      });
    }
  }
}

/**
 * Sets config option for native text track support
 * @param {KalturaPlayerOptionsObject} options - kaltura player options
 * @returns {void}
 */
function checkNativeTextTracksSupport(options: KalturaPlayerOptionsObject): void {
  if (isSafari()) {
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
 * Transform options structure from legacy structure to new structure.
 * @param {Object} options - The options with the legacy structure.
 * @return {PartialKalturaPlayerOptionsObject} - Partial options with the expected structure.
 */
function supportLegacyOptions(options: Object): PartialKalturaPlayerOptionsObject {
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
      const propValue = Utils.Object.getPropertyPath(options, propPath);
      const propObj = Utils.Object.createPropertyPath({}, targetPath, propValue);
      Utils.Object.mergeDeep(options, propObj);
      Utils.Object.deletePropertyPath(options, propPath);
    }
  };
  const moves = [
    ['duration', 'sources.duration'],
    ['type', 'sources.type'],
    ['dvr', 'sources.dvr'],
    ['id', 'sources.id'],
    ['name', 'metadata.name'],
    ['metadata.poster', 'sources.poster'],
    ['metadata', 'sources.metadata']
  ];
  removePlayerEntry();
  moves.forEach(move => moveProp(move[0], move[1]));
  return options;
}

/**
 * Prints early setup messages.
 * @returns {void}
 */
function printSetupMessages(): void {
  setupMessages.forEach(msgObj => getLogger('KalturaPlayer:Setup')[msgObj.level](msgObj.msg));
}

/**
 * Returns true if user agent indicate that browser is Safari
 * @returns {boolean} - if browser is Safari
 */
function isSafari(): boolean {
  return Env.browser.name.includes('Safari');
}

/**
 * Returns true if user agent indicate that browser is Chrome on iOS
 * @returns {boolean} - if browser is Chrome on iOS
 */
function isIos(): boolean {
  return Env.os.name === 'iOS';
}

export {
  printSetupMessages,
  supportLegacyOptions,
  setStorageConfig,
  applyStorageSupport,
  setStorageTextStyle,
  attachToFirstClick,
  validateConfig,
  setLogLevel,
  createKalturaPlayerContainer,
  checkNativeHlsSupport,
  getDefaultOptions,
  isSafari,
  isIos
};
