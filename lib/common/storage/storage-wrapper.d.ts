export default class StorageWrapper {
  static _logger: any;
  /**
   * @static
   * @private
   * @returns {boolean} - Whether a local storage object is available on the current environment.
   */
  static isLocalStorageAvailable(): boolean;
  /**
   * @static
   * @private
   * @return {number} - The number of keys in the local storage started with wanted prefix.
   */
  static get size(): number;
  /**
   * Sets an item in the local storage.
   * @param {string} key - The key of the item.
   * @param {any} item - The value of the item.
   * @static
   * @private
   * @returns {void}
   */
  static setItem(key: string, item: any): void;
  /**
   * Gets an item from the local storage.
   * @param {string} key - The item key.
   * @static
   * @private
   * @returns {any} - The item value.
   */
  static getItem(key: string): any;
  static _isQuotaExceeded(e: any): boolean;
  static _validateKey(key: string): void;
}
//# sourceMappingURL=storage-wrapper.d.ts.map
