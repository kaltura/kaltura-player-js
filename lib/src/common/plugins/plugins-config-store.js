'use strict';
var __read =
  (this && this.__read) ||
  function (o, n) {
    var m = typeof Symbol === 'function' && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
      r,
      ar = [],
      e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error: error };
    } finally {
      try {
        if (r && !r.done && (m = i['return'])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.templateRegex = exports.BasePluginConfigStore = void 0;
var playkit_js_1 = require('@playkit-js/playkit-js');
var defaultConfig = {
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
    referrer: '{{referrer}}',
    encodedReferrer: '{{encodedReferrer}}',
    serviceUrl: '{{analyticsServiceUrl}}'
  },
  comscore: {
    playerVersion: '{{pVersion}}'
  },
  vr: {
    rootElement: '{{domRootElementId}}'
  },
  share: {
    partnerId: '{{partnerId}}',
    uiConfId: '{{uiConfId}}',
    entryId: '{{entryId}}',
    embedBaseUrl: '{{embedBaseUrl}}'
  }
};
var templateRegex = new RegExp('{{.*}}');
exports.templateRegex = templateRegex;
/**
 * extract the object members which include an evaluation token of type {{.*}}
 * @private
 * @param {Object} obj - the config object
 * @returns {dataStoreType} - the new object with new tokens
 */
var resolveNewConfig = function (obj) {
  if (obj === void 0) {
    obj = {};
  }
  return Object.entries(obj).reduce(function (product, _a) {
    var _b = __read(_a, 2),
      key = _b[0],
      value = _b[1];
    if (playkit_js_1.Utils.Object.isObject(value)) {
      product[key] = resolveNewConfig(value);
    } else if (typeof value === 'string' && templateRegex.test(value)) {
      product[key] = value;
    } else {
      product[key] = undefined;
    }
    return product;
  }, {});
};
/**
 * remove undefined members from the token data store
 * @private
 * @param {Object} obj - the config object
 * @returns {dataStoreType} - the new object with valid evaluate tokens
 */
var removeUndefineds = function (obj) {
  if (obj === void 0) {
    obj = {};
  }
  return Object.entries(obj).reduce(function (product, _a) {
    var _b = __read(_a, 2),
      key = _b[0],
      value = _b[1];
    if (playkit_js_1.Utils.Object.isObject(value)) {
      product[key] = removeUndefineds(value);
    } else if (value) {
      product[key] = value;
    }
    return product;
  }, {});
};
var BasePluginConfigStore = /** @class */ (function () {
  /**
   * constructor
   * @constructor
   */
  function BasePluginConfigStore() {
    this._basePluginsConfig = playkit_js_1.Utils.Object.copyDeep(defaultConfig);
  }
  /**
   * return the token store object
   * @returns {*|any} - token store object
   */
  BasePluginConfigStore.prototype.get = function () {
    return this._config;
  };
  /**
   * recalculate the token store data, if new config with token is passed then add it to the data store, and if
   * an existing token needs to be removed then remove it
   * @param {?dataStoreType} pluginsConfig - the new config object
   * @returns {void}
   */
  BasePluginConfigStore.prototype.set = function (pluginsConfig) {
    if (pluginsConfig) {
      var newConfig = resolveNewConfig(pluginsConfig);
      this._config = removeUndefineds(playkit_js_1.Utils.Object.mergeDeep(this._config, newConfig));
    }
  };
  /**
   * reset the config store to its initial state
   * @returns {void}
   */
  BasePluginConfigStore.prototype.reset = function () {
    this._config = playkit_js_1.Utils.Object.copyDeep(defaultConfig);
  };
  return BasePluginConfigStore;
})();
exports.BasePluginConfigStore = BasePluginConfigStore;
//# sourceMappingURL=plugins-config-store.js.map
