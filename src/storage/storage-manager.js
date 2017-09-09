// @flow
import StorageWrapper from './storage-wrapper'
import LoggerFactory from '../utils/logger'
import {name} from '../../package.json'

const STORAGE_PREFIX = name + '_';

export default class StorageManager {
  static StorageKeys = [
    'muted',
    'volume',
    'textLanguage',
    'audioLanguage'
  ];
  _storage: StorageWrapper;
  _player: Player;
  _logger: any;

  constructor() {
    this._storage = new StorageWrapper(STORAGE_PREFIX);
    this._logger = LoggerFactory.getLogger('StorageManager');
  }

  /**
   * Attaches the player listeners to the local storage wrapper.
   * @param {Player} player - The player reference.
   * @returns {void}
   */
  attach(player: Player): void {
    this._logger.debug('Attach local storage');
    this._player = player;
    this._player.addEventListener(player.Event.VOLUME_CHANGE, () => {
      this._storage.setItem('muted', this._player.muted);
      this._storage.setItem('volume', this._player.volume);
    });
    this._player.addEventListener(player.Event.AUDIO_TRACK_CHANGED, (event) => {
      let audioTrack = event.payload.selectedAudioTrack;
      this._storage.setItem('audioLanguage', audioTrack.language);
    });
    this._player.addEventListener(player.Event.TEXT_TRACK_CHANGED, (event) => {
      let textTrack = event.payload.selectedTextTrack;
      this._storage.setItem('textLanguage', textTrack.language);
    });
  }

  /**
   * Checks if we have previous storage.
   * @return {boolean} - Whether we have previous storage.
   */
  hasStorage(): boolean {
    let storageSize = this._storage.size;
    let hasStorage = (storageSize !== 0);
    if (hasStorage) {
      this._logger.debug('Storage found with size of ', storageSize);
    } else {
      this._logger.debug('No storage found');
    }
    return hasStorage;
  }

  /**
   * Gets the storage in the structure of the configuration.
   * @return {Object} - Partial storageable player configuration.
   */
  getStorage(): Object {
    let values = this._getExistingValues();
    let storageConfig = this._buildStorageConfig(values);
    this._logger.debug('Gets storage config', storageConfig);
    return storageConfig;
  }

  _getExistingValues(): Object {
    let obj = {};
    for (let i = 0; i < StorageManager.StorageKeys.length; i++) {
      let key = StorageManager.StorageKeys[i];
      let value = this._storage.getItem(key);
      if (value != null) {
        obj[key] = value;
      }
    }
    return obj;
  }

  _buildStorageConfig(values: Object): Object {
    return {
      playback: this._getStoragePlaybackConfig(values)
    };
  }

  _getStoragePlaybackConfig(values: Object): Object {
    let playback = {};
    if (values['muted'] != null) {
      playback.muted = values['muted'];
    }
    if (values['volume'] != null) {
      playback.volume = values['volume'];
    }
    if (values['textLanguage'] != null) {
      playback.textLanguage = values['textLanguage'];
    }
    if (values['audioLanguage'] != null) {
      playback.audioLanguage = values['audioLanguage'];
    }
    return playback;
  }
}
