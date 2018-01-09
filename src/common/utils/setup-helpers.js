// @flow
import {Utils, TextStyle} from 'playkit-js'
import {ProviderMediaInfo} from 'playkit-js-providers'
import {UIManager, UIComponentConfig} from 'playkit-js-ui'
import {ValidationErrorType} from './validation-error'
import StorageManager from '../storage/storage-manager'
import {setLogLevel as _setLogLevel, LogLevel} from './logger'
import {DEFAULT_THUMBS_SLICES, DEFAULT_THUMBS_WIDTH, getThumbSlicesUrl} from './thumbs'
import type LogLevelType from './logger'
import type {KalturaPlayerOptionsObject} from '../player-options/player-options'

const CONTAINER_CLASS_NAME: string = 'kaltura-player-container';
const KALTURA_PLAYER_DEBUG_QS: string = 'debugKalturaPlayer';

/**
 * Validate the user input for target id.
 * @param {string} targetId - The DOM element id which the player will be append to.
 * @returns {void}
 */
function validateTargetId(targetId: string) {
  if (!document.getElementById(targetId)) {
    throw new Error(ValidationErrorType.DOM_ELEMENT_WITH_TARGET_ID_REQUIRED + targetId);
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
  metadata.poster = `${metadata.poster}/height/${height}/width/${width}`;
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
  let logLevel: LogLevelType = LogLevel.ERROR;
  if (isDebugMode()) {
    options.logLevel = LogLevel.DEBUG.name;
    logLevel = LogLevel.DEBUG;
  } else {
    if (options.logLevel && LogLevel[options.logLevel]) {
      logLevel = LogLevel[options.logLevel];
    }
  }
  _setLogLevel(logLevel);
}

/**
 * gets the url query striung parmater
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
  uiManager.setComponentConfig(new UIComponentConfig("seekbar", {
    thumbsSprite: getThumbSlicesUrl(data),
    thumbsWidth: DEFAULT_THUMBS_WIDTH,
    thumbsSlices: DEFAULT_THUMBS_SLICES
  }));
}

/**
 * Sets the shell component whether to force touch ui.
 * @param {boolean} isTouch - If is touch.
 * @param {UIManager} uiManager - The ui manager.
 * @returns {void}
 */
function setUITouchConfig(isTouch: boolean, uiManager: UIManager): void {
  uiManager.setComponentConfig(new UIComponentConfig("shell", {
    forceTouchUI: isTouch
  }));
}

/**
 * Sets the media info on error component to the "retry" functionality.
 * @param {ProviderMediaInfo} mediaInfo - The media info.
 * @param {UIManager} uiManager - The ui manager.
 * @returns {void}
 */
function setUIErrorOverlayConfig(mediaInfo: ProviderMediaInfo, uiManager: UIManager): void {
  uiManager.setComponentConfig(new UIComponentConfig("errorOverlay", {
    mediaInfo: mediaInfo
  }));
}

export {
  setStorageConfig,
  applyStorageSupport,
  setStorageTextStyle,
  createKalturaPlayerContainer,
  addKalturaPoster,
  validateTargetId,
  setLogLevel,
  setUISeekbarConfig,
  setUITouchConfig,
  setUIErrorOverlayConfig
};
