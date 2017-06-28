//@flow
import loadPlayer from 'playkit-js'
import PlaykitUI from 'playkit-js-ui'
import OvpProvider from 'playkit-js-providers/dist/ovpProvider'
import handleSessionId from './session-id'
import './assets/style.css'

const CONTAINER_CLASS_NAME: string = 'kaltura-player-container';

/**
 * Setup the kaltura player.
 * @param {string} targetId - The target id of the dom element which we append the player to.
 * @param {Object} providerConfig - Optional config which includes partnerId and an optional entryId.
 * @return {Promise<*>} - The player promise.
 */
export default function setup(targetId: string, providerConfig: ?Object): Promise<*> {
  let response = {};
  return new Promise((resolve, reject) => {
    // Create player container
    let containerId = createKalturaPlayerContainer(targetId);
    // Create player and handle session id
    response.player = loadPlayer(containerId);
    response.player.addEventListener(response.player.Event.SOURCE_SELECTED, (event) => {
      handleSessionId(event.payload.selectedSource, response.player);
    });
    // Prepare config for the ui manager
    if (providerConfig) {
      Object.assign(providerConfig, {targetId: containerId});
    } else {
      providerConfig = {targetId: containerId};
    }
    // Build UI
    buildUI(response.player, providerConfig);
    // Handle provider config
    if (providerConfig.partnerId) {
      response.provider = new OvpProvider(providerConfig.partnerId);
      if (providerConfig.entryId) {
        return response.provider.getConfig(providerConfig.entryId)
          .then(playerConfig => {
            response.player.configure(playerConfig);
            resolve(response);
          }).catch(error => {
            reject(error);
          });
      }
    }
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
  el.id = Math.random().toString(36).substring(2, 10);
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
function buildUI(player, config) {
  let playerUIManager = new PlaykitUI(player, config);
  playerUIManager.buildDefaultUI();
}
