import { KalturaPlayer } from '../../kaltura-player';
export default class StorageManager {
  static StorageKeys: {
    [key: string]: string;
  };
  static _logger: any;
  /**
   * @static
   * @private
   * @returns {boolean} - Whether local storage is implemented in the current browser.
   */
  static isLocalStorageAvailable(): boolean;
  /**
   * Attaches the player listeners to the local storage wrapper.
   * @private
   * @param {Player} player - The player reference.
   * @static
   * @returns {void}
   */
  static attach(player: KalturaPlayer): void;
  /**
   * Gets the player text style from storage.
   * @private
   * @static
   * @returns {?Object} - The stored text style object
   */
  static getPlayerTextStyle(): Object | undefined;
  /**
   * Checks if we have previous storage.
   * @private
   * @static
   * @return {boolean} - Whether we have previous storage.
   */
  static hasStorage(): boolean;
  /**
   * Gets the storage in the structure of the player configuration.
   * @private
   * @static
   * @return {Object} - Partial storageable player configuration.
   */
  static getStorageConfig(): Object;
  static _getExistingValues(): Object;
  static _buildStorageConfig(values: Object): Object;
}
//# sourceMappingURL=storage-manager.d.ts.map
