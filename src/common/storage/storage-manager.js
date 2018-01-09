// @flow
import StorageWrapper from './storage-wrapper'
import getLogger from '../utils/logger'
import {Utils} from 'playkit-js'

export default class StorageManager {
  static StorageKeys: { [key: string]: string } = {
    MUTED: 'muted',
    VOLUME: 'volume',
    AUDIO_LANG: 'audioLanguage',
    TEXT_LANG: 'textLanguage',
    TEXT_STYLE: 'textStyle'
  };

  static _logger: any = getLogger('StorageManager');

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
    player.addEventListener(player.Event.FIRST_PLAY, () => {
      player.addEventListener(player.Event.MUTE_CHANGE, () => {
        StorageWrapper.setItem(StorageManager.StorageKeys.MUTED, player.muted);
      });
      player.addEventListener(player.Event.VOLUME_CHANGE, () => {
        StorageWrapper.setItem(StorageManager.StorageKeys.VOLUME, player.volume);
      });
      player.addEventListener(player.Event.AUDIO_TRACK_CHANGED, (event) => {
        const audioTrack = event.payload.selectedAudioTrack;
        StorageWrapper.setItem(StorageManager.StorageKeys.AUDIO_LANG, audioTrack.language);
      });
      player.addEventListener(player.Event.TEXT_TRACK_CHANGED, (event) => {
        const textTrack = event.payload.selectedTextTrack;
        StorageWrapper.setItem(StorageManager.StorageKeys.TEXT_LANG, textTrack.language);
      });
      player.addEventListener(player.Event.TEXT_STYLE_CHANGED, () => {
        try {
          const textStyle = JSON.stringify(player.textStyle);
          StorageWrapper.setItem(StorageManager.StorageKeys.TEXT_STYLE, textStyle);
        } catch (e) {
          this._logger.error(e.message);
        }
      });
    });
  }

  /**
   * Gets the player text style from storage.
   * @static
   * @public
   * @returns {?Object} - The stored text style object
   */
  static getPlayerTextStyle(): ?Object {
    return StorageWrapper.getItem(StorageManager.StorageKeys.TEXT_STYLE);
  }

  /**
   * Checks if we have previous storage.
   * @public
   * @static
   * @return {boolean} - Whether we have previous storage.
   */
  static hasStorage(): boolean {
    const storageSize = StorageWrapper.size;
    const hasStorage = (storageSize !== 0);
    if (hasStorage) {
      this._logger.debug('Storage found with size of ', storageSize);
    } else {
      this._logger.debug('No storage found');
    }
    return hasStorage;
  }

  /**
   * Gets the storage in the structure of the player configuration.
   * @public
   * @static
   * @return {Object} - Partial storageable player configuration.
   */
  static getStorageConfig(): Object {
    const values = StorageManager._getExistingValues();
    const storageConfig = StorageManager._buildStorageConfig(values);
    this._logger.debug('Gets storage config', storageConfig);
    return storageConfig;
  }

  static _getExistingValues(): Object {
    const obj = {};
    Object.keys(StorageManager.StorageKeys).forEach((key) => {
      const value = StorageManager.StorageKeys[key];
      const item = StorageWrapper.getItem(value);
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
}
