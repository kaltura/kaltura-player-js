import * as Playkit from 'playkit-js';
import OvpProvider from 'playkit-js-providers/dist/ovpProvider';
import handleSessionId from './session-id'

function create(config: Object): Promise<*> {
  let player = Playkit.playkit();
  player.addEventListener(player.Event.SOURCE_SELECTED, (event) => {
    handleSessionId(event.payload.selectedSource, player);
  });
  if (config) {
    let provider = new OvpProvider(config.partnerId);
    return provider.getConfig(config.entryID)
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

export default create;
