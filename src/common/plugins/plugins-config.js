//@flow
import pluginsConfig from './plugins-config.json'
import evaluate from '../utils/evaluate'
import {Utils} from 'playkit-js'

/**
 * @param {PKPlayerOptionsObject} playerConfig - The player config
 * @return {void}
 */
function evaluatePluginsConfig(playerConfig: PKPlayerOptionsObject): void {
  if (playerConfig.plugins) {
    const dataModel = {
      pVersion: __VERSION__,
      pName: __NAME__
    };
    if (playerConfig.session) {
      const entryDataModel = {
        entryId: playerConfig.id,
        entryName: playerConfig.name,
        entryType: playerConfig.type,
        sessionId: playerConfig.session.id,
        ks: playerConfig.session.ks,
        uiConfId: playerConfig.session.uiConfId,
        partnerId: playerConfig.session.partnerId
      };
      Object.keys(entryDataModel).forEach(key => {
        if (entryDataModel[key] === undefined) {
          delete entryDataModel[key];
        }
      });
      Utils.Object.mergeDeep(dataModel, entryDataModel);
    }
    const evaluatedConfig = evaluate(JSON.stringify(pluginsConfig), dataModel);
    let evaluatedConfigObj;
    try {
      evaluatedConfigObj = JSON.parse(evaluatedConfig);
    } catch (e) {
      evaluatedConfigObj = {};
    }
    const templateRegex = new RegExp(('{{.*}}'));
    Object.keys(evaluatedConfigObj).forEach((plugin) => {
      Object.keys(evaluatedConfigObj[plugin]).forEach((key) => {
        if (templateRegex.test(evaluatedConfigObj[plugin][key])) {
          delete evaluatedConfigObj[plugin][key];
        }
      });
    });
    if (playerConfig.plugins) {
      Object.keys(playerConfig.plugins).forEach((pluginName) => {
        if (playerConfig.plugins && playerConfig.plugins[pluginName]) {
          Utils.Object.mergeDeep(playerConfig.plugins[pluginName], evaluatedConfigObj[pluginName]);
        }
      });
    }
  }
}

export {evaluatePluginsConfig};
