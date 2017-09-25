// @flow
import StorageWrapper from './storage-wrapper'
import LoggerFactory from '../utils/logger'

export default class StorageManager {
  static StorageKeys = [
    'muted',
    'volume',
    'textLanguage',
    'audioLanguage'
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
      let audioTrack = event.payload.selectedAudioTrack;
      StorageWrapper.setItem('audioLanguage', audioTrack.language);
    });
    StorageManager._player.addEventListener(player.Event.TEXT_TRACK_CHANGED, (event) => {
      let textTrack = event.payload.selectedTextTrack;
      StorageWrapper.setItem('textLanguage', textTrack.language);
    });
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
  static getStorage(): Object {
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
    return {
      playback: values
    };
  }
}
