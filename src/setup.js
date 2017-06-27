//@flow
import * as Playkit from 'playkit-js';
import OvpProvider from 'playkit-js-providers/dist/ovpProvider';
import handleSessionId from './session-id'

/**
 * Setup the kaltura player.
 * @param {string} targetId - The target id of the dom element which we append the player to.
 * @param {Object} config - Fully config which includes partnerId and entryId.
 * @return {Promise<*>} - The player promise.
 */
export default function setup(targetId: string, config: Object): Promise<*> {
  let player = Playkit.loadPlayer(targetId);
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
