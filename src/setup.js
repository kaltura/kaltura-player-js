//@flow
import * as Playkit from 'playkit-js';
import OvpProvider from 'playkit-js-providers/dist/ovpProvider';
import handleSessionId from './session-id'

/**
 * Setup the kaltura player.
 * @param {string} targetId - The target id of the dom element which we append the player to.
 * @param {Object} providerConfig - Optional config which includes partnerId and an optional entryId.
 * @return {Promise<*>} - The player promise.
 */
export default function setup(targetId: string, providerConfig: ?Object): Promise<*> {
  let response = {};
  return new Promise((resolve, reject) => {
    response.player = Playkit.loadPlayer(targetId);
    response.player.addEventListener(response.player.Event.SOURCE_SELECTED, (event) => {
      handleSessionId(event.payload.selectedSource, response.player);
    });
    if (providerConfig && providerConfig.partnerId) {
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
