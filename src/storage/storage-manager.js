// @flow
import StorageWrapper from './storage-wrapper'
import LoggerFactory from '../utils/logger'
import {Utils} from 'playkit-js'

const MUTED = 'muted';
const VOLUME = 'volume';
const AUDIO_LANG = 'audioLanguage';
const TEXT_LANG = 'textLanguage';
const TEXT_STYLE = 'textStyle';

export default class StorageManager {
  static StorageKeys = [
    MUTED,
    VOLUME,
    AUDIO_LANG,
    TEXT_LANG,
    TEXT_STYLE
  ];
  static _logger: any = LoggerFactory.getLogger('StorageManager');

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
    player.addEventListener(player.Event.MUTE_CHANGE, () => {
      StorageWrapper.setItem(MUTED, player.muted);
    });
    player.addEventListener(player.Event.VOLUME_CHANGE, () => {
      StorageWrapper.setItem(VOLUME, player.volume);
    });
    player.addEventListener(player.Event.AUDIO_TRACK_CHANGED, (event) => {
      const audioTrack = event.payload.selectedAudioTrack;
      StorageWrapper.setItem(AUDIO_LANG, audioTrack.language);
    });
    player.addEventListener(player.Event.TEXT_TRACK_CHANGED, (event) => {
      const textTrack = event.payload.selectedTextTrack;
      StorageWrapper.setItem(TEXT_LANG, textTrack.language);
    });
    player.addEventListener(player.Event.TEXT_STYLE_CHANGED, () => {
      try {
        const textStyle = JSON.stringify(player.textStyle);
        StorageWrapper.setItem(TEXT_STYLE, textStyle);
      } catch (e) {
        this._logger.error(e.message);
      }
    });
  }

  /**
   * Gets the player text style from storage.
   * @static
   * @public
   * @returns {?Object} - The stored text style object
   */
  static getPlayerTextStyle(): ?Object {
    return StorageWrapper.getItem(TEXT_STYLE);
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
