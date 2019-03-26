//@flow
import {pluginConfig, templateRegex} from './plugins-config-store.js';
import evaluate from '../utils/evaluate';
import {getReferrer} from '../utils/kaltura-params';
import {Utils} from '@playkit-js/playkit-js';

/**
 * returns whether value is evaluated
 * @private
 * @param {*} value - the value to be checked
 * @returns {boolean} - value is evaluated
 */
const isValueEvaluated = (value: any): boolean =>
  (typeof value === 'number' || typeof value === 'function' || typeof value === 'string' || typeof value === 'boolean') &&
  !templateRegex.test(value.toString());

/**
 * remove unevaluated expressions form object
 * @private
 * @param {Object} obj - the object examine
 * @returns {Object} - the object without unevaluated strings
 */
const removeUnevaluatedExpression = (obj = {}): Object =>
  Object.entries(obj).reduce((product, [key, value]): Object => {
    if (typeof value !== 'function' && Utils.Object.isObject(value)) {
      product[key] = removeUnevaluatedExpression(value);
    } else if (isValueEvaluated(value)) {
      product[key] = value;
    }
    return product;
  }, {});

/**
 * returns the data model for evaluating evaluation tokens
 * @private
 * @param {KPOptionsObject} options - the kaltura player options object
 * @returns {Object} - data model
 */
const getModel = (options: KPOptionsObject): Object => {
  const dataModel: Object = {
    pVersion: __VERSION__,
    pName: __NAME__
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
  if (options.playlist) {
    Utils.Object.mergeDeep(entryDataModel, {
      playlistId: options.playlist.id
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
 * @param {Object} options - plugins options
 * @param {KPOptionsObject} config - player config
 * @private
 * @return {void}
 */
function evaluatePluginsConfig(options: Object, config: KPOptionsObject): void {
  if (options) {
    pluginConfig.set(options);
    const dataModel = getModel(config);
    const mergedConfig = Utils.Object.mergeDeep({}, pluginConfig.get(), options);
    const evaluatedConfig = evaluate(JSON.stringify(mergedConfig), dataModel);
    _evaluateConfig(options, evaluatedConfig);
  }
}

/**
 * @param {Object} options - UI options
 * @param {KPOptionsObject} config - player config
 * @private
 * @return {void}
 */
function evaluateUIConfig(options: Object, config: KPOptionsObject): void {
  if (options) {
    const dataModel = getModel(config);
    const evaluatedConfig = evaluate(JSON.stringify(options), dataModel);
    _evaluateConfig(options, evaluatedConfig);
  }
}

/**
 * @param {Object} data - target config object
 * @param {string} evaluatedConfig - the evaluated string
 * @private
 * @returns {void}
 */
function _evaluateConfig(data: Object, evaluatedConfig: string): void {
  let evaluatedConfigObj;
  try {
    evaluatedConfigObj = JSON.parse(evaluatedConfig, function(key) {
      try {
        return JSON.parse(this[key]);
      } catch (e) {
        return this[key];
      }
    });
  } catch (e) {
    evaluatedConfigObj = {};
  }
  evaluatedConfigObj = removeUnevaluatedExpression(evaluatedConfigObj);

  if (data) {
    Object.keys(data).forEach(pluginName => {
      if (data && data[pluginName]) {
        data[pluginName] = evaluatedConfigObj[pluginName];
      }
    });
  }
}

export {evaluatePluginsConfig, evaluateUIConfig};
