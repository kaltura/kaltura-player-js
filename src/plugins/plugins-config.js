//@flow

import pluginsConfig from './plugins-config.json'
import evaluate from '../utils/evaluate'
import {Utils} from 'playkit-js'

/**
 * @param {Object} [playerConfig = {}] - The player config
 * @return {void}
 */
function evaluatePluginsConfig(playerConfig: Object = {}): void {
  if (playerConfig.plugins) {
    let dataModel = {
      pVersion: __VERSION__,
      pName: __NAME__,
    };
    if (playerConfig.session) {
      let entryDataModel = {
        entryId: playerConfig.id,
        entryName: playerConfig.name,
        entryType: playerConfig.type,
        sessionId: playerConfig.session.id,
        ks: playerConfig.session.ks,
        uiConfId: playerConfig.session.uiConfID,
        partnerId: playerConfig.session.partnerID
      };
      Utils.Object.mergeDeep(dataModel, entryDataModel);
    }
    let evaluatedConfig = evaluate(JSON.stringify(pluginsConfig), dataModel);
    let evaluatedConfigObj;
    try {
      evaluatedConfigObj = JSON.parse(evaluatedConfig);
    } catch (e) {
      evaluatedConfigObj = {};
    }
    let templateRegex = new RegExp(('{{.*}}'));
    Object.keys(evaluatedConfigObj).forEach((plugin) => {
      Object.keys(evaluatedConfigObj[plugin]).forEach((key) => {
        if (templateRegex.test(evaluatedConfigObj[plugin][key])) {
          delete evaluatedConfigObj[plugin][key];
        }
      });
    });
    Object.keys(playerConfig.plugins).forEach((pluginName) => {
      Utils.Object.mergeDeep(playerConfig.plugins[pluginName], evaluatedConfigObj[pluginName]);
    });
  }
}


export {evaluatePluginsConfig};
