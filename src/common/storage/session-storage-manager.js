// @flow
import {EventManager, getLogger} from '@playkit-js/playkit-js';
import StorageWrapper from './storage-wrapper';
import {BaseStorageManager} from './base-storage-manager';

export default class SessionStorageManager extends BaseStorageManager {
  static StorageKeys: {[key: string]: string} = {
    PLAYBACK_RATE: 'playbackRate'
  };
  static _logger: any = getLogger('SessionStorageManager');

  static getStorageObject() {
    return sessionStorage;
  }

  /**
   * Attaches the player listeners to the local storage wrapper.
   * @private
   * @param {Player} player - The player reference.
   * @static
   * @returns {void}
   */
  static attach(player: Player): void {
    SessionStorageManager._logger.debug('Attach session storage');
    let eventManager = new EventManager();
    eventManager.listen(player, player.Event.UI.USER_SELECTED_SPEED, () => {
      if (!player.isCasting()) {
        StorageWrapper.setItem(SessionStorageManager.StorageKeys.PLAYBACK_RATE, player.playbackRate, SessionStorageManager.getStorageObject());
      }
    });
  }
}
