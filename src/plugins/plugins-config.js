//@flow

import * as pluginsConfig from './plugins-config.json'
import evaluate from '../utils/evaluate'
import {Utils} from 'playkit-js'
import {VERSION, PLAYER_NAME} from '../index'

/**
 * @param {Object} [playerConfig = {}] - The player config
 * @return {void}
 */
function evaluatePluginsConfig(playerConfig = {}): void {
  let playerModel = {
    pVersion: VERSION,
    pName: PLAYER_NAME,
    entryId: playerConfig.id,
    entryName: playerConfig.name,
    entryType: playerConfig.type,
    sessionId: playerConfig.session.id,
    ks: playerConfig.session.ks,
    uiConfId: playerConfig.session.uiConfID,
    partnerId: playerConfig.session.partnerID
  };
  let evaluatedConfig = evaluate(JSON.stringify(pluginsConfig), playerModel);
  let evaluatedConfigObj;
  try {
    evaluatedConfigObj = JSON.parse(evaluatedConfig);
  } catch (e) {
    evaluatedConfigObj = {};
  }
  Object.keys(playerConfig.plugins).forEach((pluginName) => {
    Utils.Object.mergeDeep(playerConfig.plugins[pluginName], evaluatedConfigObj[pluginName]);
  });
}


export {evaluatePluginsConfig};
