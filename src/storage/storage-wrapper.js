// @flow
import LoggerFactory from '../utils/logger'

export default class StorageWrapper {
  _isLocalStorageAvailable: boolean;
  _prefix: ?string;
  _logger: any;

  constructor(prefix: ?string) {
    this._testForLocalStorage();
    this._logger = LoggerFactory.getLogger('StorageWrapper');
    this._prefix = prefix;
    if (this._isLocalStorageAvailable) {
      this._logger.debug('Local storage available');
    } else {
      this._logger.warn('Local storage isn\'t available');
    }
  }

  /**
   * @return {number} - The number of keys in the local storage started with wanted prefix.
   */
  get size(): number {
    if (this._isLocalStorageAvailable) {
      return Object.keys(localStorage).filter((key) => key.startsWith(this._prefix)).length;
    }
    return 0;
  }

  /**
   * Sets an item in the local storage.
   * @param {string} key - The key of the item.
   * @param {any} item - The value of the item.
   * @returns {void}
   */
  setItem(key: string, item: any): void {
    this._validateKey(key);
    this._logger.debug('Sets item for key: ' + key, item);
    if (this._isLocalStorageAvailable) {
      try {
        localStorage.setItem(this._prefix + key, item);
      } catch (e) {
        if (this._isQuotaExceeded(e)) {
          this._logger.error('Quota exceeded: ' + e.message);
          this._isLocalStorageAvailable = false;
        } else {
          this._logger.error(e.message);
        }
      }
    }
  }

  /**
   * Gets an item from the local storage.
   * @param {string} key - The item key.
   * @returns {any} - The item value.
   */
  getItem(key: string): any {
    this._validateKey(key);
    if (this._isLocalStorageAvailable) {
      try {
        return JSON.parse(localStorage.getItem(this._prefix + key));
      } catch (e) {
        return localStorage.getItem(this._prefix + key);
      }
    }
  }

  _isQuotaExceeded(e: any): void {
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
      return quotaExceeded;
    }
  }

  _testForLocalStorage(): void {
    if (typeof Storage !== 'undefined') {
      try {
        localStorage.setItem('test', null);
        localStorage.removeItem('test');
        this._isLocalStorageAvailable = true;
      }
      catch (e) {
        this._isLocalStorageAvailable = false;
      }
    } else {
      this._isLocalStorageAvailable = false;
    }
  }

  _validateKey(key: string): void {
    if (typeof key !== 'string' || key.length === 0) {
      throw new Error('Invalid key');
    }
  }
}
