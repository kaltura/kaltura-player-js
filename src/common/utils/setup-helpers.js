// @flow
import {setDefaultAnalyticsPlugin} from 'player-defaults'
import {Utils, TextStyle, Env} from 'playkit-js'
import {UIManager} from 'playkit-js-ui'
import {ValidationErrorType} from './validation-error'
import StorageManager from '../storage/storage-manager'
import {setLogLevel as _setLogLevel, LogLevel} from './logger'
import type {LogLevelObject} from './logger'
import {DEFAULT_THUMBS_SLICES, DEFAULT_THUMBS_WIDTH, getThumbSlicesUrl} from './thumbs'
import {configureExternalStreamRedirect} from './external-stream-redirect-helper'

const CONTAINER_CLASS_NAME: string = 'kaltura-player-container';
const KALTURA_PLAYER_DEBUG_QS: string = 'debugKalturaPlayer';

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
  const el = document.createElement("div");
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
 * Add poster with player dimensions to thumbnail API call
 * @param {Object} metadata - metadata container
 * @param {number} width - player width in px
 * @param {number} height - player height in px
 * @returns {void}
 */
function addKalturaPoster(metadata: Object, width: number, height: number): void {
  if (metadata.poster) {
    metadata.poster = `${metadata.poster}/height/${height}/width/${width}`;
  }
}

/**
 * Sets the storage config on the player config if certain conditions are met.
 * @param {KalturaPlayerOptionsObject} options - kaltura player options
 * @returns {void}
 */
function setStorageConfig(options: KalturaPlayerOptionsObject): void {
  if (!options.disableUserCache && StorageManager.isLocalStorageAvailable() && StorageManager.hasStorage()) {
    Utils.Object.mergeDeep(options.player, StorageManager.getStorageConfig());
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
  options.ui.logLevel = options.player.logLevel = options.provider.logLevel = logLevelObj.name;
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
 * Sets the preview thumbnail config for the ui seekbar component.
 * @param {Object} data - The provider data.
 * @param {UIManager} uiManager - The ui manager.
 * @returns {void}
 */
function setUISeekbarConfig(data: Object, uiManager: UIManager): void {
  uiManager.setConfig({
    thumbsSprite: getThumbSlicesUrl(data),
    thumbsWidth: DEFAULT_THUMBS_WIDTH,
    thumbsSlices: DEFAULT_THUMBS_SLICES
  }, "seekbar");
}

/**
 * Sets the media info on error component to the "retry" functionality.
 * @param {ProviderMediaInfoObject} mediaInfo - The media info.
 * @param {UIManager} uiManager - The ui manager.
 * @returns {void}
 */
function setUIErrorOverlayConfig(mediaInfo: ProviderMediaInfoObject, uiManager: UIManager): void {
  uiManager.setConfig({
    mediaInfo: mediaInfo
  }, "error");
}

/**
 * Checks if the server UIConf exist
 * @param {number} uiConfId - The server UIConf
 * @returns {boolean} - server UIConf exist
 */
function serverUIConfExist(uiConfId: ?number): boolean {
  const UIConf = Utils.Object.getPropertyPath(window, "__kalturaplayerdata.UIConf");
  const hasUiConfId = (uiConfId !== null) && (uiConfId !== undefined);
  return hasUiConfId &&
    ((UIConf !== undefined && (UIConf[uiConfId] !== undefined)) || false);
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
  const defaultOptions: KalturaPlayerOptionsObject = {
    targetId: options.targetId,
    provider: {
      partnerId: options.provider.partnerId
    },
    player: {},
    ui: {
      targetId: targetId
    }
  };
  Utils.Object.mergeDeep(defaultOptions, options);
  if (defaultOptions.provider.uiConfId) {
    const uiConf = extractServerUIConf(defaultOptions.provider.uiConfId);
    defaultOptions.provider = Utils.Object.mergeDeep({}, uiConf.provider, defaultOptions.provider);
    defaultOptions.player = Utils.Object.mergeDeep({}, uiConf.player, defaultOptions.player);
    defaultOptions.ui = Utils.Object.mergeDeep({}, uiConf.ui, defaultOptions.ui);
  }
  checkNativeHlsSupport(defaultOptions.player);
  checkNativeTextTracksSupport(defaultOptions.player);
  setDefaultAnalyticsPlugin(defaultOptions.player);
  configureExternalStreamRedirect(defaultOptions.player);
  return defaultOptions;
}

/**
 * Sets config option for native HLS playback
 * @param {PKPlayerOptionsObject} playerConfig - the player config
 * @returns {void}
 */
function checkNativeHlsSupport(playerConfig: PKPlayerOptionsObject): void {
  if (isSafari() || isIos()) {
    const preferNativeHlsValue = Utils.Object.getPropertyPath(playerConfig, 'playback.preferNative.hls');
    if (typeof preferNativeHlsValue !== 'boolean') {
      Utils.Object.mergeDeep(playerConfig, {
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
 * @param {PKPlayerOptionsObject} playerConfig - the player config
 * @returns {void}
 */
function checkNativeTextTracksSupport(playerConfig: PKPlayerOptionsObject): void {
  if (isSafari()) {
    const useNativeTextTrack = Utils.Object.getPropertyPath(playerConfig, 'playback.useNativeTextTrack');
    if (typeof useNativeTextTrack !== 'boolean') {
      Utils.Object.mergeDeep(playerConfig, {
        playback: {
          useNativeTextTrack: true
        }
      });
    }
  }
}

/**
 * Returns true if user agent indicate that browser is Safari
 * @returns {boolean} - if browser is Safari
 */
function isSafari(): boolean {
  return Env.browser.name.includes("Safari");
}

/**
 * Returns true if user agent indicate that browser is Chrome on iOS
 * @returns {boolean} - if browser is Chrome on iOS
 */
function isIos(): boolean {
  return (Env.os.name === "iOS");
}

export {
  setStorageConfig,
  applyStorageSupport,
  setStorageTextStyle,
  addKalturaPoster,
  validateConfig,
  setLogLevel,
  createKalturaPlayerContainer,
  checkNativeHlsSupport,
  getDefaultOptions,
  setUISeekbarConfig,
  setUIErrorOverlayConfig,
  isSafari,
  isIos
};
