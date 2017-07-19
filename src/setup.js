//@flow
import {loadPlayer, Utils} from 'playkit-js'
import PlaykitUI from 'playkit-js-ui'
import OvpProvider from 'playkit-js-providers/dist/ovpProvider'
import handleSessionId from './utils/session-id'
import LoggerFactory from './utils/logger'
import './assets/style.css'

const CONTAINER_CLASS_NAME: string = 'kaltura-player-container';
const logger = LoggerFactory.getLogger('Setup');

/**
 * Setup the kaltura player.
 * @param {string} targetId - The target id of the dom element which we append the player to.
 * @param {Object} userConfig - Optional fully user config which should include also partnerId and entryId.
 * @return {Promise<*>} - The response promise.
 */
export default function setup(targetId: string, userConfig: ?Object): Promise<*> {
  let response = {};
  let playerConfig = extractPlayerConfig(userConfig);
  logger.debug('Extract player config', playerConfig);
  let providerConfig = extractProviderConfig(userConfig);
  logger.debug('Extract provider config', providerConfig);
  return new Promise((resolve, reject) => {
    // Create player container
    let containerId = createKalturaPlayerContainer(targetId);
    // Create player and handle session id
    response.player = loadPlayer(containerId, playerConfig);
    response.player.addEventListener(response.player.Event.SOURCE_SELECTED, (event) => {
      handleSessionId(event.payload.selectedSource, response.player);
    });
    // Prepare config for the ui manager
    Utils.Object.mergeDeep(playerConfig, {targetId: containerId});
    // Build UI
    buildUI(response.player, playerConfig);
    // Handle provider config
    if (providerConfig.partnerId) {
      logger.debug('Partner id provided, creating ovp provider');
      response.provider = new OvpProvider(providerConfig.partnerId, providerConfig.ks, providerConfig.env);
      return response.provider.getConfig(providerConfig.entryId, providerConfig.uiConfId)
        .then(data => {
          Utils.Object.mergeDeep(playerConfig, data);
          response.player.configure(playerConfig);
          logger.debug('Finish setup, returning response', response);
          resolve(response);
        }).catch(error => {
          reject(error);
        });
    }
    logger.debug('Finish setup, returning response', response);
    resolve(response);
  });
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
 * Builds the default kaltura ui of the player.
 * @param {Player} player - The kaltura player.
 * @param {Object} config - The ui configuration.
 * @returns {void}
 */
function buildUI(player: Player, config: Object): void {
  let playerUIManager = new PlaykitUI(player, config);
  playerUIManager.buildDefaultUI();
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
function extractProviderConfig(config: ?Object): Object {
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

// Export those functions for automation testing
export {extractProviderConfig, extractPlayerConfig, createKalturaPlayerContainer}
