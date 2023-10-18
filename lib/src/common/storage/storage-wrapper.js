'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var playkit_js_1 = require('@playkit-js/playkit-js');
var STORAGE_PREFIX = __NAME__ + '_';
var StorageWrapper = /** @class */ (function () {
  function StorageWrapper() {}
  /**
   * @static
   * @private
   * @returns {boolean} - Whether a local storage object is available on the current environment.
   */
  StorageWrapper.isLocalStorageAvailable = function () {
    if (typeof Storage !== 'undefined') {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      } catch (e) {
        return false;
      }
    } else {
      return false;
    }
  };
  Object.defineProperty(StorageWrapper, 'size', {
    /**
     * @static
     * @private
     * @return {number} - The number of keys in the local storage started with wanted prefix.
     */
    get: function () {
      return Object.keys(localStorage).filter(function (key) {
        return key.startsWith(STORAGE_PREFIX);
      }).length;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Sets an item in the local storage.
   * @param {string} key - The key of the item.
   * @param {any} item - The value of the item.
   * @static
   * @private
   * @returns {void}
   */
  StorageWrapper.setItem = function (key, item) {
    StorageWrapper._validateKey(key);
    try {
      StorageWrapper._logger.debug('Sets item for key: ' + key, item);
      localStorage.setItem(STORAGE_PREFIX + key, item);
    } catch (e) {
      if (StorageWrapper._isQuotaExceeded(e)) {
        StorageWrapper._logger.error('Quota exceeded: ' + e.message);
      } else {
        StorageWrapper._logger.error(e.message);
      }
    }
  };
  /**
   * Gets an item from the local storage.
   * @param {string} key - The item key.
   * @static
   * @private
   * @returns {any} - The item value.
   */
  StorageWrapper.getItem = function (key) {
    StorageWrapper._validateKey(key);
    var item = null;
    try {
      item = localStorage.getItem(STORAGE_PREFIX + key);
      if (typeof item === 'string') {
        return JSON.parse(item);
      } else {
        return null;
      }
    } catch (e) {
      return item;
    }
  };
  StorageWrapper._isQuotaExceeded = function (e) {
    var quotaExceeded = false;
    if (e) {
      if (e.code) {
        switch (e.code) {
          case 22:
            quotaExceeded = true;
            break;
          case 1014:
            // Firefox
            if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
              quotaExceeded = true;
            }
            break;
        }
        // Internet Explorer 8
      } else if (e.number === -2147024882) {
        quotaExceeded = true;
      }
    }
    return quotaExceeded;
  };
  StorageWrapper._validateKey = function (key) {
    if (typeof key !== 'string' || key.length === 0) {
      throw new Error('Invalid key');
    }
  };
  StorageWrapper._logger = (0, playkit_js_1.getLogger)('StorageWrapper');
  return StorageWrapper;
})();
exports.default = StorageWrapper;
//# sourceMappingURL=storage-wrapper.js.map
