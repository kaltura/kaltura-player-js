// @flow
import LoggerFactory from '../utils/logger'

declare var __NAME__:string;

const STORAGE_PREFIX = __NAME__ + '_';

export default class StorageWrapper {
  static _logger: any = LoggerFactory.getLogger('StorageWrapper');

  /**
   * @static
   * @public
   * @returns {boolean} - Whether a local storage object is available on the current environment.
   */
  static isLocalStorageAvailable(): boolean {
    if (typeof Storage !== 'undefined') {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      }
      catch (e) {
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   * @static
   * @public
   * @return {number} - The number of keys in the local storage started with wanted prefix.
   */
  static get size(): number {
    return Object.keys(localStorage).filter((key) => key.startsWith(STORAGE_PREFIX)).length;
  }

  /**
   * Sets an item in the local storage.
   * @param {string} key - The key of the item.
   * @param {any} item - The value of the item.
   * @static
   * @public
   * @returns {void}
   */
  static setItem(key: string, item: any): void {
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
  }

  /**
   * Gets an item from the local storage.
   * @param {string} key - The item key.
   * @static
   * @public
   * @returns {any} - The item value.
   */
  static getItem(key: string): any {
    StorageWrapper._validateKey(key);
    let item = null;
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
  }

  static _isQuotaExceeded(e: any): boolean {
    let quotaExceeded = false;
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
  }

  static _validateKey(key: string): void {
    if (typeof key !== 'string' || key.length === 0) {
      throw new Error('Invalid key');
    }
  }
}
