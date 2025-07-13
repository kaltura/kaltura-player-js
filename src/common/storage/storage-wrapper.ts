import { getLogger } from '@playkit-js/playkit-js';

const STORAGE_PREFIX = __NAME__ + '_';

export default class StorageWrapper {
  private static _logger: any = getLogger('StorageWrapper');

  /**
   * @static
   * @private
   * @param {Object} storage - The storage object
   * @returns {boolean} - Whether a storage object is available on the current environment.
   */
  public static isStorageAvailable(storage: any): boolean {
    if (typeof Storage !== 'undefined') {
      try {
        storage.setItem('test', 'test');
        storage.removeItem('test');
        return true;
      } catch (e) {
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   * Gets the storage size
   * @param {Object} storage - The storage object to use.
   * @static
   * @private
   * @return {number} - The number of keys in the storage started with wanted prefix.
   */
  public static getStorageSize(storage: any): number {
    return Object.keys(storage).filter((key) => key.startsWith(STORAGE_PREFIX)).length;
  }

  /**
   * Gets storage items
   * @param {Object} storage - The storage object to use.
   * @static
   * @private
   * @return {object} - The items that their keys in the storage starts with wanted prefix.
   */
  public static getStorageItems(storage: any): number {
    //given storage object filer all items thats with STORAGE_PREFIX
    const items: any = {};
    Object.keys(storage).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        items[key] = storage.getItem(key);
      }
    });
    return items;
  }

  /**
   * Sets an item in the storage.
   * @param {string} key - The key of the item.
   * @param {any} item - The value of the item.
   * @param {Object} storage - The storage object to use.
   * @static
   * @private
   * @returns {void}
   */
  public static setItem(key: string, item: any, storage: any): void {
    StorageWrapper._validateKey(key);
    try {
      StorageWrapper._logger.debug('Sets item for key: ' + key, item);
      storage.setItem(STORAGE_PREFIX + key, item);
    } catch (e) {
      if (StorageWrapper._isQuotaExceeded(e)) {
        StorageWrapper._logger.error('Quota exceeded: ' + e.message);
      } else {
        StorageWrapper._logger.error(e.message);
      }
    }
  }

  /**
   * Gets an item from the storage.
   * @param {string} key - The item key.
   * @param {Object} storage - The storage object to use.
   * @static
   * @private
   * @returns {any} - The item value.
   */
  public static getItem(key: string, storage: any): any {
    StorageWrapper._validateKey(key);
    let item: string | null = null;
    try {
      item = storage.getItem(STORAGE_PREFIX + key);
      if (typeof item === 'string') {
        return JSON.parse(item);
      } else {
        return null;
      }
    } catch (e) {
      return item;
    }
  }

  public static _isQuotaExceeded(e: any): boolean {
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

  public static _validateKey(key: string): void {
    if (typeof key !== 'string' || key.length === 0) {
      throw new Error('Invalid key');
    }
  }
}
