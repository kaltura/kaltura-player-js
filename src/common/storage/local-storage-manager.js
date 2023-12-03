// @flow
import StorageWrapper from './storage-wrapper';
import {EventManager, getLogger} from '@playkit-js/playkit-js';
import {BaseStorageManager} from './base-storage-manager';

export default class LocalStorageManager extends BaseStorageManager {
  static StorageKeys: {[key: string]: string} = {
    MUTED: 'muted',
    VOLUME: 'volume',
    AUDIO_LANG: 'audioLanguage',
    TEXT_LANG: 'textLanguage',
    CAPTIONS_DISPLAY: 'captionsDisplay',
    TEXT_STYLE: 'textStyle'
  };

  static _logger: any = getLogger('StorageManager');

  static getStorageObject() {
    return localStorage;
  }

  /**
   * @static
   * @private
   * @returns {boolean} - Whether local storage is implemented in the current browser.
   */
  static isLocalStorageAvailable(): boolean {
    return StorageWrapper.isStorageAvailable();
  }

  /**
   * Attaches the player listeners to the local storage wrapper.
   * @private
   * @param {Player} player - The player reference.
   * @static
   * @returns {void}
   */
  static attach(player: Player): void {
    LocalStorageManager._logger.debug('Attach local storage');
    let eventManager = new EventManager();
    eventManager.listen(player, player.Event.UI.USER_CLICKED_MUTE, () => {
      if (!player.isCasting()) {
        StorageWrapper.setItem(LocalStorageManager.StorageKeys.MUTED, player.muted);
      }
    });
    eventManager.listen(player, player.Event.UI.USER_CLICKED_UNMUTE, () => {
      if (!player.isCasting()) {
        StorageWrapper.setItem(LocalStorageManager.StorageKeys.MUTED, player.muted);
      }
    });

    eventManager.listen(player, player.Event.UI.USER_CHANGED_VOLUME, () => {
      if (!player.isCasting()) {
        if (player.volume > 0) {
          StorageWrapper.setItem(LocalStorageManager.StorageKeys.MUTED, false);
        } else {
          StorageWrapper.setItem(LocalStorageManager.StorageKeys.MUTED, true);
        }
        StorageWrapper.setItem(LocalStorageManager.StorageKeys.VOLUME, player.volume);
      }
    });

    eventManager.listen(player, player.Event.UI.USER_SELECTED_AUDIO_TRACK, event => {
      const audioTrack = event.payload.audioTrack;
      StorageWrapper.setItem(LocalStorageManager.StorageKeys.AUDIO_LANG, audioTrack.language);
    });

    eventManager.listen(player, player.Event.UI.USER_SELECTED_CAPTION_TRACK, event => {
      const textTrack = event.payload.captionTrack;
      if (textTrack.language !== 'off') {
        StorageWrapper.setItem(LocalStorageManager.StorageKeys.TEXT_LANG, textTrack.language);
        StorageWrapper.setItem(LocalStorageManager.StorageKeys.CAPTIONS_DISPLAY, true);
      } else {
        StorageWrapper.setItem(LocalStorageManager.StorageKeys.CAPTIONS_DISPLAY, false);
      }
    });

    const onToggleCaptions = () => {
      eventManager.listenOnce(player, player.Event.TEXT_TRACK_CHANGED, event => {
        const {selectedTextTrack} = event.payload;
        if (selectedTextTrack.language !== 'off') {
          StorageWrapper.setItem(LocalStorageManager.StorageKeys.TEXT_LANG, selectedTextTrack.language);
          StorageWrapper.setItem(LocalStorageManager.StorageKeys.CAPTIONS_DISPLAY, true);
        } else {
          StorageWrapper.setItem(LocalStorageManager.StorageKeys.CAPTIONS_DISPLAY, false);
        }
      });
    };

    eventManager.listen(player, player.Event.UI.USER_SHOWED_CAPTIONS, onToggleCaptions);
    eventManager.listen(player, player.Event.UI.USER_HID_CAPTIONS, onToggleCaptions);

    eventManager.listen(player, player.Event.UI.USER_SELECTED_CAPTIONS_STYLE, event => {
      try {
        const textStyle = JSON.stringify(event.payload.captionsStyle);
        StorageWrapper.setItem(LocalStorageManager.StorageKeys.TEXT_STYLE, textStyle);
      } catch (e) {
        LocalStorageManager._logger.error(e.message);
      }
    });

    eventManager.listen(player, player.Event.PLAYER_DESTROY, () => eventManager.destroy());
  }

  /**
   * Gets the player text style from storage.
   * @private
   * @static
   * @returns {?Object} - The stored text style object
   */
  static getPlayerTextStyle(): ?Object {
    return StorageWrapper.getItem(LocalStorageManager.StorageKeys.TEXT_STYLE);
  }
}
