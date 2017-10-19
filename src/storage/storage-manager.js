// @flow
import StorageWrapper from './storage-wrapper'
import LoggerFactory from '../utils/logger'
import {Utils, TextStyle} from 'playkit-js'

export default class StorageManager {
  static StorageKeys = [
    'muted',
    'volume',
    'audioLanguage',
    'textLanguage',
    'textStyle'
  ];
  static _logger: any = LoggerFactory.getLogger('StorageManager');
  static _player: Player;

  static isLocalStorageAvailable(): boolean {
    return StorageWrapper.isLocalStorageAvailable();
  }

  /**
   * Attaches the player listeners to the local storage wrapper.
   * @param {Player} player - The player reference.
   * @static
   * @public
   * @returns {void}
   */
  static attach(player: Player): void {
    StorageManager._logger.debug('Attach local storage');
    StorageManager._player = player;
    StorageManager._player.addEventListener(player.Event.VOLUME_CHANGE, () => {
      StorageWrapper.setItem('muted', StorageManager._player.muted);
      StorageWrapper.setItem('volume', StorageManager._player.volume);
    });
    StorageManager._player.addEventListener(player.Event.AUDIO_TRACK_CHANGED, (event) => {
      const audioTrack = event.payload.selectedAudioTrack;
      StorageWrapper.setItem('audioLanguage', audioTrack.language);
    });
    StorageManager._player.addEventListener(player.Event.TEXT_TRACK_CHANGED, (event) => {
      const textTrack = event.payload.selectedTextTrack;
      StorageWrapper.setItem('textLanguage', textTrack.language);
    });
    StorageManager._player.addEventListener(player.Event.TEXT_STYLE_CHANGED, (event) => {
      try {
        const textStyle = JSON.stringify(event.payload.textStyle);
        StorageWrapper.setItem('textStyle', textStyle);
      } catch (e) {
        this._logger.error(e.message);
      }
    });
  }

  /**
   * Sets the player text style from storage.
   * @param {any} player - The Kaltura player.
   * @static
   * @public
   * @returns {void}
   */
  static setPlayerTextStyle(player: Player): void {
    const textStyle = StorageManager.getStorage().textStyle;
    if (textStyle) {
      player.textStyle = Utils.Object.mergeDeep(new TextStyle(), textStyle);
    }
  }

  /**
   * Checks if we have previous storage.
   * @public
   * @static
   * @return {boolean} - Whether we have previous storage.
   */
  static hasStorage(): boolean {
    let storageSize = StorageWrapper.size;
    let hasStorage = (storageSize !== 0);
    if (hasStorage) {
      this._logger.debug('Storage found with size of ', storageSize);
    } else {
      this._logger.debug('No storage found');
    }
    return hasStorage;
  }

  /**
   * Gets the storage.
   * @public
   * @static
   * @return {Object} - The storage.
   */
  static getStorage(): Object {
    return StorageManager._getExistingValues();
  }

  /**
   * Gets the storage in the structure of the player configuration.
   * @public
   * @static
   * @return {Object} - Partial storageable player configuration.
   */
  static getStorageConfig(): Object {
    let values = StorageManager._getExistingValues();
    let storageConfig = StorageManager._buildStorageConfig(values);
    this._logger.debug('Gets storage config', storageConfig);
    return storageConfig;
  }

  static _getExistingValues(): Object {
    let obj = {};
    for (let i = 0; i < StorageManager.StorageKeys.length; i++) {
      let key = StorageManager.StorageKeys[i];
      let value = StorageWrapper.getItem(key);
      if (value != null) {
        obj[key] = value;
      }
    }
    return obj;
  }

  static _buildStorageConfig(values: Object): Object {
    const storageConfig = Utils.Object.mergeDeep({}, values);
    delete storageConfig.textStyle;
    return {
      playback: storageConfig
    };
  }
}
