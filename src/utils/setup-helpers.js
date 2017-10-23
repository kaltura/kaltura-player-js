// @flow
import {Env, Utils, TextStyle} from 'playkit-js'
import {ValidationErrorType} from './validation-error'
import StorageManager from '../storage/storage-manager'

const CONTAINER_CLASS_NAME: string = 'kaltura-player-container';

/**
 * Validate the initial user input for the providers.
 * @param {Object} config - The fully user provider configuration.
 * @returns {void}
 */
function validateProvidersConfig(config: Object) {
  if (!config) {
    throw new Error(ValidationErrorType.INITIAL_CONFIG_REQUIRED);
  }
  if (!config.partnerId) {
    throw new Error(ValidationErrorType.PARTNER_ID_REQUIRED);
  }
}

/**
 * Validate the initial user input for the player.
 * @param {string} targetId - The DOM element id which the player will be append to.
 * @returns {void}
 */
function validateTargetId(targetId: string) {
  if (!targetId) {
    throw new Error(ValidationErrorType.TARGET_ID_REQUIRED);
  }
  if (!document.getElementById(targetId)) {
    throw new Error(ValidationErrorType.DOM_ELEMENT_WITH_TARGET_ID_REQUIRED + targetId);
  }
}

/**
 * Extracts the player configuration.
 * @param {Object} config - The fully user configuration.
 * @returns {Object} - The player configuration.
 */
function extractPlayerConfig(config: ?Object): Object {
  let playerConfig = {};
  Utils.Object.mergeDeep(playerConfig, config);
  delete playerConfig.partnerId;
  delete playerConfig.entryId;
  delete playerConfig.uiConfId;
  delete playerConfig.env;
  delete playerConfig.ks;
  return playerConfig;
}

/**
 * Extracts the provider configuration.
 * @param {Object} config - The fully user configuration.
 * @returns {Object} - The provider configuration.
 */
function extractProvidersConfig(config: ?Object): Object {
  let providerConfig = {};
  if (config) {
    providerConfig.partnerId = config.partnerId;
    providerConfig.entryId = config.entryId;
    providerConfig.uiConfId = config.uiConfId;
    providerConfig.env = config.env;
    providerConfig.ks = config.ks;
  }
  return providerConfig;
}

/**
 * Creates the player container dom element.
 * @param {string} targetId - The div id which the player will append to.
 * @returns {string} - The player container id.
 */
function createKalturaPlayerContainer(targetId: string): string {
  let el = document.createElement("div");
  el.id = Utils.Generator.uniqueId(5);
  el.className = CONTAINER_CLASS_NAME;
  el.setAttribute('tabindex', '-1');
  let parentNode = document.getElementById(targetId);
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
 * preform different checks for setting default player settings
 * @param {Object} playerConfig - the player config
 * @returns {void}
 */
function setDefaultPlayerConfig(playerConfig: Object): void {
  checkNativeHlsSupport(playerConfig);
  checkNativeTextTracksSupport(playerConfig);
}

/**
 * Sets config option for native HLS playback
 * @param {Object} playerConfig - the player config
 * @returns {void}
 */
function checkNativeHlsSupport(playerConfig: Object): void {
  if (isSafari() || isIos()) {
    let preferNativeHlsValue = Utils.Object.getPropertyPath(playerConfig, 'playback.preferNative.hls');
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
 * @param {Object} playerConfig - the player config
 * @returns {void}
 */
function checkNativeTextTracksSupport(playerConfig: Object): void {
  if (isIos()) {
    let useNativeTextTrack = Utils.Object.getPropertyPath(playerConfig, 'playback.useNativeTextTrack');
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
 * Sets the storage config on the player config if certain conditions are met.
 * @param {Object} playerConfig - The player configuration.
 * @returns {void}
 */
function setStorageConfig(playerConfig: Object): void {
  if (!playerConfig.disableUserCache && StorageManager.isLocalStorageAvailable() && StorageManager.hasStorage()) {
    Utils.Object.mergeDeep(playerConfig, StorageManager.getStorageConfig());
  }
}

/**
 * Applies cache support if it's supported by the environment.
 * @param {any} player - The Kaltura player.
 * @returns {void}
 */
function applyStorageSupport(player: any): void {
  if (StorageManager.isLocalStorageAvailable()) {
    StorageManager.attach(player);
  }
}

/**
 * Sets the player text style from storage.
 * @param {any} player - The Kaltura player.
 * @returns {void}
 */
function setStorageTextStyle(player: any): void {
  if (StorageManager.isLocalStorageAvailable()) {
    const textStyleObj = StorageManager.getPlayerTextStyle();
    if (textStyleObj) {
      player.textStyle = Utils.Object.mergeDeep(new TextStyle(), textStyleObj);
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
  extractPlayerConfig,
  extractProvidersConfig,
  createKalturaPlayerContainer,
  addKalturaPoster,
  validateTargetId,
  validateProvidersConfig,
  setDefaultPlayerConfig,
  checkNativeHlsSupport,
  checkNativeTextTracksSupport,
  isSafari,
  isIos
};
