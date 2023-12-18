import {EventManager} from '@playkit-js/playkit-js';
import {BaseStorageManager} from './base-storage-manager';
import { KalturaPlayer } from "../../kaltura-player";

export default class SessionStorageManager extends BaseStorageManager {
  static StorageKeys: {[key: string]: string} = {
    PLAYBACK_RATE: 'playbackRate'
  };

  static initialize() {
    this.init(this.name);
  }

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
  static attach(player: KalturaPlayer): void {
    this._logger.debug('Attach session storage');
    let eventManager = new EventManager();
    eventManager.listen(player, player.Event.UI.USER_SELECTED_SPEED, () => {
      if (!player.isCasting()) {
        this.setItem(this.StorageKeys.PLAYBACK_RATE, player.playbackRate);
      }
    });
  }
}
