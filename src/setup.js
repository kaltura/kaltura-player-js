//@flow
import * as Playkit from 'playkit-js';
import PlaykitUI from 'playkit-js-ui';
import OvpProvider from 'playkit-js-providers/dist/ovpProvider';
import handleSessionId from './session-id'
import './style.css'

const CONTAINER_CLASS_NAME: string = 'kalturaplayer-container';

/**
 * Setup the kaltura player.
 * @param {string} targetId - The target id of the dom element which we append the player to.
 * @param {Object} config - Fully config which includes partnerId and entryId.
 * @return {Promise<*>} - The player promise.
 */
export default function setup(targetId: string, config: Object): Promise<*> {
  let el = createKalturaPlayerContainer(targetId);
  let player = Playkit.loadPlayer(el.id);
  let playerUIManager = new PlaykitUI(player, Object.assign({}, config, {targetId: el.id}));
  playerUIManager.buildDefaultUI();
  player.addEventListener(player.Event.SOURCE_SELECTED, (event) => {
    handleSessionId(event.payload.selectedSource, player);
  });
  if (config) {
    let provider = new OvpProvider(config.partnerId);
    return provider.getConfig(config.entryId)
      .then(data => {
        player.configure(data);
        return Promise.resolve(player);
      }).catch(error => {
        return Promise.reject(error);
      });
  } else {
    return Promise.resolve(player);
  }
}

function createKalturaPlayerContainer(targetId: string){
  let el = document.createElement("div");
  el.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  el.className = CONTAINER_CLASS_NAME;
  el.setAttribute('tabindex', '-1');

  let parentNode = document.getElementById(targetId);
  if ((parentNode != null) && (el != null)) {
    parentNode.appendChild(el);
  }
  return el;
}
