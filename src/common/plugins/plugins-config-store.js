//@flow
import {Utils} from '@playkit-js/playkit-js';

type dataStoreType = {[pluginName: string]: Object};
const defaultConfig: dataStoreType = {
  youbora: {
    playerVersion: '{{pVersion}}',
    playerName: '{{pName}}',
    entryId: '{{entryId}}',
    entryName: '{{entryName}}',
    entryType: '{{entryType}}',
    sessionId: '{{sessionId}}',
    uiConfId: '{{uiConfId}}'
  },
  googleAnalytics: {
    entryId: '{{entryId}}',
    entryName: '{{entryName}}',
    uiConfId: '{{uiConfId}}',
    partnerId: '{{partnerId}}'
  },
  ottAnalytics: {
    entryId: '{{entryId}}',
    ks: '{{ks}}',
    isAnonymous: '{{isAnonymous}}',
    partnerId: '{{partnerId}}',
    serviceUrl: '{{serviceUrl}}'
  },
  ima: {
    playerVersion: '{{pVersion}}',
    playerName: '{{pName}}'
  },
  kava: {
    playerVersion: '{{pVersion}}',
    playerName: '{{pName}}',
    partnerId: '{{partnerId}}',
    playlistId: '{{playlistId}}',
    entryId: '{{entryId}}',
    entryType: '{{entryType}}',
    sessionId: '{{sessionId}}',
    ks: '{{ks}}',
    uiConfId: '{{uiConfId}}',
    referrer: '{{referrer}}'
  },
  comscore: {
    playerVersion: '{{pVersion}}'
  },
  vr: {
    rootElement: '{{domRootElementId}}'
  }
};

let config = Utils.Object.copyDeep(defaultConfig);
const templateRegex = new RegExp('{{.*}}');

/**
 * extract the object members which include an evaluation token of type {{.*}}
 * @private
 * @param {Object} obj - the config object
 * @returns {dataStoreType} - the new object with new tokens
 */
const resolveNewConfig = (obj = {}): Object =>
  Object.entries(obj).reduce((product, [key, value]): Object => {
    if (Utils.Object.isObject(value)) {
      product[key] = resolveNewConfig(value);
    } else if (typeof value === 'string' && templateRegex.test(value)) {
      product[key] = value;
    } else {
      product[key] = undefined;
    }
    return product;
  }, {});

/**
 * remove undefined members from the token data store
 * @private
 * @param {Object} obj - the config object
 * @returns {dataStoreType} - the new object with valid evaluate tokens
 */
const removeUndefineds = (obj = {}): Object =>
  Object.entries(obj).reduce((product, [key, value]): Object => {
    if (Utils.Object.isObject(value)) {
      product[key] = removeUndefineds(value);
    } else if (value) {
      product[key] = value;
    }
    return product;
  }, {});

const pluginConfig = {
  /**
   * return the token store object
   * @private
   * @returns {*|any} - token store object
   */
  get: (): dataStoreType => {
    return config;
  },
  /**
   * recalculate the token store data, if new config with token is passed then add it to the data store, and if
   * an existing token needs to be removed then remove it
   * @private
   * @param {?dataStoreType} pluginsConfig - the new config object
   * @returns {void}
   */
  set: (pluginsConfig: ?dataStoreType): void => {
    if (pluginsConfig) {
      const newConfig = resolveNewConfig(pluginsConfig);
      config = removeUndefineds(Utils.Object.mergeDeep(config, newConfig));
    }
  },
  /**
   * reset the config store to its initial state
   * @private
   * @returns {void}
   */
  reset: (): void => {
    config = Utils.Object.copyDeep(defaultConfig);
  }
};

export {pluginConfig, templateRegex};
