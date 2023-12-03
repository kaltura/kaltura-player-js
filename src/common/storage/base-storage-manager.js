// @flow
import StorageWrapper from './storage-wrapper';
import {Utils} from '@playkit-js/playkit-js';

export class BaseStorageManager {
  static _logger: any;
  static StorageKeys: {[key: string]: string};
  /**
   * Checks if we have previous storage.
   * @private
   * @static
   * @return {boolean} - Whether we have previous storage.
   */
  static hasStorage(): boolean {
    const storageSize = StorageWrapper.getStorageSize(this.getStorageObject());
    const hasStorage = storageSize !== 0;
    if (hasStorage) {
      this._logger.debug('Storage found with size of ', storageSize);
    } else {
      this._logger.debug('No storage found');
    }
    return hasStorage;
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

  static _buildStorageConfig(values: Object): Object {
    const storageConfig = Utils.Object.mergeDeep({}, values);
    delete storageConfig.textStyle;
    return {
      playback: storageConfig
    };
  }

  static getStorageObject(): Object {
    throw Error('');
  }
}
