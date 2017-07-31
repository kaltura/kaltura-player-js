// @flow
import {Utils} from 'playkit-js'

const CONTAINER_CLASS_NAME: string = 'kaltura-player-container';

/**
 * Validate the initial user input for the providers.
 * @param {Object} config - The fully user provider configuration.
 * @returns {void}
 */
function validateProvidersConfig(config: Object) {
  if (!config) {
    throw new Error('Must provide initial providers config');
  }
  if (!config.partnerId) {
    throw new Error('Must provide partner id');
  }
}

/**
 * Validate the initial user input for the player.
 * @param {string} targetId - The DOM element id which the player will be append to.
 * @returns {void}
 */
function validateTargetId(targetId: string) {
  if (!targetId) {
    throw new Error('Must provide target id');
  }
  if (!document.getElementById(targetId)) {
    throw new Error('Must provide DOM element with id of: ' + targetId);
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

export {
  extractPlayerConfig,
  extractProvidersConfig,
  createKalturaPlayerContainer,
  validateTargetId,
  validateProvidersConfig
};
