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
  let response = {};
  return new Promise((resolve, reject) => {
    response.player = Playkit.loadPlayer(targetId);
    response.player.addEventListener(response.player.Event.SOURCE_SELECTED, (event) => {
      handleSessionId(event.payload.selectedSource, response.player);
    });
    if (config) {
      if (config.partnerId) {
        response.provider = new OvpProvider(config.partnerId);
        if (config.entryId) {
          return response.provider.getConfig(config.entryId)
            .then(data => {
              response.player.configure(data);
              resolve(response);
            }).catch(error => {
              reject(error);
            });
        }
      }
    }
    resolve(response);
  });
}
