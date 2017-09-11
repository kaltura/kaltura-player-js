// @flow
import LoggerFactory from '../utils/logger'

export default class StorageWrapper {
  _prefix: string;
  _logger: any;

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

  constructor(prefix: string = '') {
    this._logger = LoggerFactory.getLogger('StorageWrapper');
    this._prefix = prefix;
  }

  /**
   * @return {number} - The number of keys in the local storage started with wanted prefix.
   */
  get size(): number {
    return Object.keys(localStorage).filter((key) => key.startsWith(this._prefix)).length;
  }

  /**
   * Sets an item in the local storage.
   * @param {string} key - The key of the item.
   * @param {any} item - The value of the item.
   * @returns {void}
   */
  setItem(key: string, item: any): void {
    StorageWrapper._validateKey(key);
    try {
      this._logger.debug('Sets item for key: ' + key, item);
      localStorage.setItem(this._prefix + key, item);
    } catch (e) {
      if (StorageWrapper._isQuotaExceeded(e)) {
        this._logger.error('Quota exceeded: ' + e.message);
      } else {
        this._logger.error(e.message);
      }
    }
  }

  /**
   * Gets an item from the local storage.
   * @param {string} key - The item key.
   * @returns {any} - The item value.
   */
  getItem(key: string): any {
    StorageWrapper._validateKey(key);
    let item = null;
    try {
      item = localStorage.getItem(this._prefix + key);
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
