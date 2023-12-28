import { EventManager } from '@playkit-js/playkit-js';
import { BaseStorageManager } from './base-storage-manager';
import { KalturaPlayer } from '../../kaltura-player';

export default class SessionStorageManager extends BaseStorageManager {
  public static StorageKeys: { [key: string]: string } = {
    PLAYBACK_RATE: 'playbackRate'
  };

  public static initialize(): void {
    this.init(this.name);
  }

  public static getStorageObject(): Storage {
    return sessionStorage;
  }

  /**
   * Attaches the player listeners to the local storage wrapper.
   * @private
   * @param {Player} player - The player reference.
   * @static
   * @returns {void}
   */
  public static attach(player: KalturaPlayer): void {
    this._logger.debug('Attach session storage');
    const eventManager = new EventManager();
    eventManager.listen(player, player.Event.UI.USER_SELECTED_SPEED, () => {
      if (!player.isCasting()) {
        this.setItem(this.StorageKeys.PLAYBACK_RATE, player.playbackRate);
      }
    });
  }
}
