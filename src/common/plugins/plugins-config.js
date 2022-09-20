//@flow
import {PluginConfigStore, templateRegex} from './plugins-config-store';
import evaluate from '../utils/evaluate';
import {getReferrer} from '../utils/kaltura-params';
import {Utils} from '@playkit-js/playkit-js';
import {getServerUIConf} from '../utils/setup-helpers';

/**
 * returns whether value is evaluated
 * @private
 * @param {*} value - the value to be checked
 * @returns {boolean} - value is evaluated
 */
const isValueEvaluated = (value: any): boolean =>
  (typeof value === 'number' ||
    typeof value === 'function' ||
    typeof value === 'string' ||
    typeof value === 'boolean' ||
    Utils.Object.isClassInstance(value)) &&
  !templateRegex.test(value.toString());

/**
 * returns whether the value is a simple object (not a function or class instance)
 * @private
 * @param {*} value - the value to be checked
 * @returns {boolean} - whether the value is a simple object or not
 */
const isSimpleObject = (value: any): boolean => Utils.Object.isObject(value) && typeof value !== 'function' && !Utils.Object.isClassInstance(value);

/**
 * filters out unevaluated expressions in an array
 * @private
 * @param {Array} value - the array to be checked
 * @returns {Array} - the array with unevaluated expressions filtered out
 */
const filterUnevaluatedExpressions = (value: $ReadOnlyArray<any>): $ReadOnlyArray<any> => {
  return value
    .map(item => {
      if (isSimpleObject(item)) {
        const updatedItem = removeUnevaluatedExpression(item);
        return Utils.Object.isEmptyObject(updatedItem) ? null : updatedItem;
      } else if (isValueEvaluated(item)) {
        return item;
      } else {
        return null;
      }
    })
    .filter(item => item !== null);
};

/**
 * remove unevaluated expressions form object
 * @private
 * @param {Object} obj - the object examine
 * @returns {Object} - the object without unevaluated strings
 */
const removeUnevaluatedExpression = (obj: Object = {}): Object =>
  Object.entries(obj).reduce((product, [key, value]): Object => {
    if (isSimpleObject(value)) {
      product[key] = removeUnevaluatedExpression(value);
    } else if (Array.isArray(value)) {
      product[key] = filterUnevaluatedExpressions(value);
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
    pVersion: getServerUIConf()?.productVersion || __VERSION__,
    pName: __NAME__
  };
  if (options.targetId) {
    dataModel.domRootElementId = options.targetId;
  }
  if (options.provider && options.provider.env) {
    dataModel['serviceUrl'] = options.provider.env.serviceUrl;

    const analyticsServiceUrl = Utils.Object.getPropertyPath(options, 'provider.env.analyticsServiceUrl');
    if (analyticsServiceUrl) {
      dataModel['analyticsServiceUrl'] = `${analyticsServiceUrl}/api_v3/index.php`;
    }
    if (dataModel['serviceUrl']) {
      dataModel['embedBaseUrl'] = dataModel['serviceUrl'].replace('api_v3', '');
    }
  }
  const entryDataModel = {
    referrer: getReferrer(),
    encodedReferrer: getEncodedReferrer()
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
 * @return {string} - The referrer after URIComponent encoded
 * @private
 */
function getEncodedReferrer(): string {
  const referrer = getReferrer();
  return encodeURIComponent(referrer);
}

/**
 *
 * @param {string} config - the config string
 * @returns {Object} - the config object
 * @private
 */
function _formatConfigString(config: string): Object {
  let configObj;
  try {
    configObj = JSON.parse(config, function (key) {
      try {
        return JSON.parse(this[key]);
      } catch (e) {
        return this[key];
      }
    });
  } catch (e) {
    configObj = {};
  }
  return configObj;
}
/**
 * @param {Object} data - target config object
 * @param {Object} evaluatedConfig - the evaluated object
 * @private
 * @returns {void}
 */
function _mergeConfig(data: Object, evaluatedConfig: Object): void {
  const evaluatedCleanConfig = removeUnevaluatedExpression(evaluatedConfig);
  const cleanData = removeUnevaluatedExpression(data);

  if (cleanData && evaluatedCleanConfig) {
    Object.keys(data).forEach(pluginName => {
      if (data && data[pluginName]) {
        data[pluginName] = Utils.Object.mergeDeep({}, evaluatedCleanConfig[pluginName], cleanData[pluginName]);
      }
    });
  }
}

class ConfigEvaluator {
  _pluginConfigStore: PluginConfigStore;
  /**
   * constructor
   * @constructor
   */
  constructor() {
    this._pluginConfigStore = new PluginConfigStore();
  }

  /**
   * @param {KPPluginsConfigObject} options - plugins options
   * @param {KPOptionsObject} config - player config
   * @return {void}
   */
  evaluatePluginsConfig(options: ?KPPluginsConfigObject, config: KPOptionsObject): void {
    if (options) {
      this._pluginConfigStore.set(options);
      const dataModel = getModel(config);
      const mergedConfig = Utils.Object.mergeDeep({}, this._pluginConfigStore.get(), options);
      const evaluatedConfig = _formatConfigString(evaluate(JSON.stringify(mergedConfig), dataModel));
      _mergeConfig(options, evaluatedConfig);
    }
  }
}

export {ConfigEvaluator, getEncodedReferrer};
