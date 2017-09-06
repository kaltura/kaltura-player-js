// @flow
import LocalStorageWrapper from './local-storage'

export default class LocalStorageManager {
  static StoragePrefix = 'kaltura.player.';
  static StorageKeys = [
    'muted',
    'volume',
    'textTrackLang',
    'audioTrackLang'
  ];
  _localStorageWrapper: LocalStorageWrapper;
  _player: Player;

  constructor() {
    this._localStorageWrapper = new LocalStorageWrapper(LocalStorageManager.StoragePrefix);
  }

  /**
   * Attaches the player listeners to the local storage wrapper.
   * @param {Player} player - The player reference.
   * @returns {void}
   */
  attach(player: Player): void {
    this._player = player;
    this._player.addEventListener(player.Event.VOLUME_CHANGE, () => {
      this._localStorageWrapper.setItem('muted', this._player.muted);
      this._localStorageWrapper.setItem('volume', this._player.volume);
    });
    this._player.addEventListener(player.Event.AUDIO_TRACK_CHANGED, (event) => {
      let audioTrack = event.payload.selectedAudioTrack;
      this._localStorageWrapper.setItem('audioTrackLang', audioTrack.language);
    });
    this._player.addEventListener(player.Event.TEXT_TRACK_CHANGED, (event) => {
      let textTrack = event.payload.selectedTextTrack;
      this._localStorageWrapper.setItem('textTrackLang', textTrack.language);
    });
  }

  /**
   * Checks if we have previous storage.
   * @return {boolean} - Whether we have previous storage.
   */
  hasStorage(): boolean {
    return (this._localStorageWrapper.length !== 0);
  }

  /**
   * Gets the storage in the structure of the configuration.
   * @return {Object} - Partial storageable player configuration.
   */
  getStorage(): Object {
    let values = this._getExistingValues();
    return this._buildStorageConfig(values);
  }

  _getExistingValues(): Object {
    let obj = {};
    for (let i = 0; i < LocalStorageManager.StorageKeys.length; i++) {
      let key = LocalStorageManager.StorageKeys[i];
      let value = this._localStorageWrapper.getItem(key);
      if (value != null) {
        obj[key] = value;
      }
    }
    return obj;
  }

  _buildStorageConfig(values: Object): Object {
    return {
      playback: this._getConfigForPlayback(values)
    };
  }

  _getConfigForPlayback(values: Object): Object {
    let playback = {};
    if (values['muted'] != null) {
      playback.muted = values['muted'];
    }
    if (values['volume'] != null) {
      playback.volume = values['volume'];
    }
    return playback;
  }

  _getConfigForTracks(values: Object): Object {
    // TODO: When we'll know how refer to tracks in the player configuration
    return {};
  }
}
