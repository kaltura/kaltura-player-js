//@flow
import pluginsConfig from './plugins-config.json'
import evaluate from '../utils/evaluate'
import {Utils} from 'playkit-js'

/**
 * @param {KalturaPlayerOptionsObject} options - player options
 * @return {void}
 */
function evaluatePluginsConfig(options: KalturaPlayerOptionsObject): void {
  if (options.plugins) {
    const dataModel = {
      pVersion: __VERSION__,
      pName: __NAME__
    };
    if (options.session && options.sources) {
      const entryDataModel = {
        entryId: options.sources.id,
        entryName: options.sources.metadata.name,
        entryType: options.sources.type,
        sessionId: options.session.id,
        ks: options.session.ks,
        uiConfId: options.session.uiConfId,
        partnerId: options.session.partnerId
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
    if (options.plugins) {
      Object.keys(options.plugins).forEach((pluginName) => {
        if (options.plugins && options.plugins[pluginName]) {
          options.plugins[pluginName] = Utils.Object.mergeDeep({}, evaluatedConfigObj[pluginName], options.plugins[pluginName]);
        }
      });
    }
  }
}

export {evaluatePluginsConfig};
