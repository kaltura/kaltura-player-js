//@flow
import {pluginConfig, templateRegex} from './plugins-config-store.js'
import evaluate from '../utils/evaluate'
import {getReferrer} from '../utils/kaltura-params'
import {Utils} from 'playkit-js'

/**
 * returns weather value is evaluated
 * @param {*} value - the value to be checked
 * @returns {boolean} - value is evaluated
 */
const isValueEvaluated = (value: any): boolean =>
  (typeof value === "number" || typeof value === "string" || typeof value === "boolean") &&
  !templateRegex.test(value.toString());

/**
 * remove unevaluated expressions form object
 * @param {Object} obj - the object examine
 * @returns {Object} - the object without unevaluated strings
 */
const removeUnevaluatedExpression = (obj = {}): Object =>
  Object.entries(obj)
    .reduce(
      (product, [key, value]): Object => {
        if (Utils.Object.isObject(value)) {
          product[key] = removeUnevaluatedExpression(value);
        } else if (isValueEvaluated(value)) {
          product[key] = value;
        }
        return product;
      },
      {}
    );

/**
 * returns the data model for evaluating evaluation tokens
 * @param {KalturaPlayerOptionsObject} options - the kaltura player options object
 * @returns {Object} - data model
 */
const getModel = (options: KalturaPlayerOptionsObject): Object => {
  const dataModel: Object = {
    pVersion: __VERSION__,
    pName: __NAME__,
  };
  if (options.targetId) {
    dataModel.domRootElementId = options.targetId;
  }
  if (options.provider && options.provider.env) {
    dataModel['serviceUrl'] = options.provider.env.serviceUrl;
  }
  const entryDataModel = {
    referrer: getReferrer()
  };
  if (options.provider) {
    Utils.Object.mergeDeep(entryDataModel, {
      ks: options.provider.ks,
      uiConfId: options.provider.uiConfId,
      partnerId: options.provider.partnerId
    });
  }
  if (options.session) {
    Utils.Object.mergeDeep(entryDataModel, {
      sessionId: options.session.id,
      ks: options.session.ks,
      isAnonymous: options.session.isAnonymous,
      uiConfId: options.session.uiConfId,
      partnerId: options.session.partnerId
    });
  }
  if (options.sources) {
    Utils.Object.mergeDeep(entryDataModel, {
      entryId: options.sources.id,
      entryName: options.sources.metadata && options.sources.metadata.name,
      entryType: options.sources.type
    });
  }
  Object.keys(entryDataModel).forEach(key => {
    if (entryDataModel[key] === undefined) {
      delete entryDataModel[key];
    }
  });
  Utils.Object.mergeDeep(dataModel, entryDataModel);
  return dataModel;
};

/**
 * @param {KalturaPlayerOptionsObject} options - player options
 * @return {void}
 */
function evaluatePluginsConfig(options: KalturaPlayerOptionsObject): void {
  if (options.plugins) {
    pluginConfig.set(options.plugins);
    const dataModel = getModel(options);
    const evaluatedConfig = evaluate(JSON.stringify(pluginConfig.get()), dataModel);
    let evaluatedConfigObj;
    try {
      evaluatedConfigObj = JSON.parse(evaluatedConfig, function (key) {
        try {
          return JSON.parse(this[key]);
        } catch (e) {
          return (this[key]);
        }});
    } catch (e) {
      evaluatedConfigObj = {};
    }
    evaluatedConfigObj = removeUnevaluatedExpression(evaluatedConfigObj);
    options.plugins = removeUnevaluatedExpression(options.plugins);

    if (options.plugins) {
      Object.keys(options.plugins).forEach((pluginName) => {
        if (options.plugins && options.plugins[pluginName]) {
          const mergedConfig = Utils.Object.mergeDeep({}, evaluatedConfigObj[pluginName], options.plugins[pluginName]);
          if (options.plugins) {
            options.plugins[pluginName] = mergedConfig;
          }
        }
      });
    }
  }
}

export {evaluatePluginsConfig};
