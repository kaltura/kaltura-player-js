import StorageWrapper from './storage-wrapper';
import { Error, Utils, getLogger } from '@playkit-js/playkit-js';
import { KalturaPlayer } from '../../kaltura-player';
import { KalturaPlayerConfig } from '../../types';

export class BaseStorageHelper {
  public static instance: BaseStorageHelper | null = null;
  public storageManagers: Array<BaseStorageManager>;

  constructor() {
    this.storageManagers = [];
  }

  public addManager(manager: BaseStorageManager): void {
    this.storageManagers.push(manager);
  }

  public static getInstance(): BaseStorageHelper {
    if (this.instance === null) {
      this.instance = new BaseStorageHelper();
    }
    return this.instance;
  }
}

export class BaseStorageManager {
  protected static _logger: any;
  public static StorageKeys: { [key: string]: string };

  /**
   * Initializes class.
   * @private
   * @param {string} className - The manager's class name.
   * @returns {void}
   */
  public static init(className: string): void {
    this._logger = getLogger(className);
    BaseStorageHelper.getInstance().addManager(this);
  }

  /**
   * Applies cache support if it's supported by the environment.
   * @private
   * @param {KalturaPlayer} player - The Kaltura player.
   * @returns {void}
   */
  public static attachAll(player: KalturaPlayer): void {
    BaseStorageHelper.getInstance().storageManagers.forEach(
      (manager: BaseStorageManager) => {
        // @ts-expect-error // does not exist on type - does not exist on type, Did you mean to access the static member 'BaseStorageManager.attach' instead?
        if (manager.isStorageAvailable()) {
          // @ts-expect-error // does not exist on type - does not exist on type, Did you mean to access the static member 'BaseStorageManager.attach' instead?
          manager.attach(player);
        }
      }
    );
  }

  /**
   * Sets the storage config on the player config if certain conditions are met.
   * @private
   * @param {KPOptionsObject} options - kaltura player options
   * @returns {void}
   */
  public static setStorageConfig(options: KalturaPlayerConfig): void {
    BaseStorageHelper.getInstance().storageManagers.forEach((manager) => {
      // @ts-expect-error // does not exist on type - does not exist on type, Did you mean to access the static member 'BaseStorageManager.attach' instead?
      if (manager.isStorageAvailable() && manager.hasStorage()) {
        // @ts-expect-error // does not exist on type - does not exist on type, Did you mean to access the static member 'BaseStorageManager.attach' instead?
        Utils.Object.mergeDeep(options, manager.getStorageConfig());
      }
    });
  }

  /**
   * @static
   * @private
   * @returns {boolean} - Whether the storage is implemented in the current browser.
   */
  public static isStorageAvailable(): boolean {
    return StorageWrapper.isStorageAvailable(this.getStorageObject());
  }

  /**
   * Checks if we have previous storage.
   * @private
   * @static
   * @return {boolean} - Whether we have previous storage.
   */
  public static hasStorage(): boolean {
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
  public static setItem(key: string, item: any): void {
    StorageWrapper.setItem(key, item, this.getStorageObject());
  }

  /**
   * Gets an item from the storage.
   * @private
   * @static
   * @param {string} key - The item key
   * @returns {any} - The item value
   */
  public static getItem(key: string): any {
    StorageWrapper.getItem(key, this.getStorageObject());
  }

  /**
   * Gets the storage size
   * @static
   * @private
   * @return {number} - The number of keys in the local storage started with wanted prefix.
   */
  public static getStorageSize(): number {
    return StorageWrapper.getStorageSize(this.getStorageObject());
  }

  /**
   * Gets the storage in the structure of the player configuration.
   * @private
   * @static
   * @return {Object} - Partial storageable player configuration.
   */
  public static getStorageConfig(): any {
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
  public static _getExistingValues(): any {
    const obj = {};
    Object.keys(this.StorageKeys).forEach((key) => {
      const value = this.StorageKeys[key];
      const item = StorageWrapper.getItem(value, this.getStorageObject());
      if (item !== null) {
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
  public static _buildStorageConfig(values: any): any {
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
  public static getStorageObject(): any {
    throw new Error(
      Error.Severity.CRITICAL,
      Error.Category.PLAYER,
      Error.Code.RUNTIME_ERROR_METHOD_NOT_IMPLEMENTED,
      'getStorageObject()'
    );
  }

  /**
   * Attaches listeners to the storage manager.
   * @private
   * @static
   * @return {void}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public static attach(player: KalturaPlayer): void {
    throw new Error(
      Error.Severity.CRITICAL,
      Error.Category.PLAYER,
      Error.Code.RUNTIME_ERROR_METHOD_NOT_IMPLEMENTED,
      'attach()'
    );
  }

  /**
   * Initialize the storage manager.
   * @private
   * @static
   * @return {void}
   */
  public static initialize(): void {
    throw new Error(
      Error.Severity.CRITICAL,
      Error.Category.PLAYER,
      Error.Code.RUNTIME_ERROR_METHOD_NOT_IMPLEMENTED,
      'initialize()'
    );
  }
}
