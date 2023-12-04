// @flow
import StorageWrapper from './storage-wrapper';
import {Error, Utils} from '@playkit-js/playkit-js';

export class BaseStorageManager {
  static _logger: any;
  static StorageKeys: {[key: string]: string};

  /**
   * @static
   * @private
   * @returns {boolean} - Whether the storage is implemented in the current browser.
   */
  static isStorageAvailable(): boolean {
    return StorageWrapper.isStorageAvailable(this.getStorageObject());
  }

  /**
   * Checks if we have previous storage.
   * @private
   * @static
   * @return {boolean} - Whether we have previous storage.
   */
  static hasStorage(): boolean {
    const storageSize = this.getStorageSize();
    const hasStorage = storageSize !== 0;
    if (hasStorage) {
      this._logger.debug('Storage found with size of ', storageSize);
    } else {
      this._logger.debug('No storage found');
    }
    return hasStorage;
  }

  /**
   * Sets an item in the storage.
   * @private
   * @static
   * @param {string} key - The key of the item
   * @param {any} item - The value of the item
   * @returns {void}
   */
  static setItem(key: string, item: any): void {
    StorageWrapper.setItem(key, item, this.getStorageObject());
  }

  /**
   * Gets an item from the storage.
   * @private
   * @static
   * @param {string} key - The item key
   * @returns {any} - The item value
   */
  static getItem(key: string): any {
    StorageWrapper.getItem(key, this.getStorageObject());
  }

  /**
   * Gets the storage size
   * @static
   * @private
   * @return {number} - The number of keys in the local storage started with wanted prefix.
   */
  static getStorageSize(): number {
    return StorageWrapper.getStorageSize(this.getStorageObject());
  }

  /**
   * Gets the storage in the structure of the player configuration.
   * @private
   * @static
   * @return {Object} - Partial storageable player configuration.
   */
  static getStorageConfig(): Object {
    const values = this._getExistingValues();
    const storageConfig = this._buildStorageConfig(values);
    this._logger.debug('Gets storage config', storageConfig);
    return storageConfig;
  }

  /**
   * Gets the current existing values in the storage.
   * @private
   * @static
   * @return {Object} - The values object from the storage.
   */
  static _getExistingValues(): Object {
    const obj = {};
    Object.keys(this.StorageKeys).forEach(key => {
      const value = this.StorageKeys[key];
      const item = StorageWrapper.getItem(value, this.getStorageObject());
      if (item != null) {
        obj[value] = item;
      }
    });
    return obj;
  }

  /**
   * Builds the storage configuration object.
   * @private
   * @static
   * @param {Object} values - The values to set to storage configuration
   * @return {Object} - The configuration with values from the storage.
   */
  static _buildStorageConfig(values: Object): Object {
    const storageConfig = Utils.Object.mergeDeep({}, values);
    delete storageConfig.textStyle;
    return {
      playback: storageConfig
    };
  }

  /**
   * Gets the storage object to access.
   * i.e: sessionStorage, localStorage
   * @private
   * @static
   * @return {Object} - The storage object.
   */
  static getStorageObject(): Object {
    throw new Error(Error.Severity.CRITICAL, Error.Category.PLAYER, Error.Code.RUNTIME_ERROR_METHOD_NOT_IMPLEMENTED, 'getStorageObject()');
  }
}
