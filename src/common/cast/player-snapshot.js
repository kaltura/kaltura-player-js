// @flow
import {KalturaPlayer} from '../../kaltura-player';
import {TextStyle} from 'playkit-js';

/**
 * @class PlayerSnapshot
 * @param {KalturaPlayer} player -  The Kaltura player.
 *
 */
class PlayerSnapshot {
  /**
   * @type {number}
   * @instance
   * @memberof PlayerSnapshot
   */
  startTime: number;
  /**
   * @type {boolean}
   * @instance
   * @memberof PlayerSnapshot
   */
  autoplay: boolean;
  /**
   * @type {string}
   * @instance
   * @memberof PlayerSnapshot
   */
  audioLanguage: ?string;
  /**
   * @type {string}
   * @instance
   * @memberof PlayerSnapshot
   */
  textLanguage: ?string;
  /**
   * @type {ProviderMediaInfoObject}
   * @instance
   * @memberof PlayerSnapshot
   */
  mediaInfo: ?ProviderMediaInfoObject;
  /**
   * @type {TextStyle}
   * @instance
   * @memberof PlayerSnapshot
   */
  textStyle: TextStyle;
  /**
   * @type {Object}
   * @instance
   * @memberof PlayerSnapshot
   */
  advertising: ?Object;

  constructor(player: KalturaPlayer) {
    const activeTracks = player.getActiveTracks();
    this.startTime = getStartTime(player);
    this.autoplay = player.currentTime === 0 ? true : !player.paused;
    this.textStyle = player.textStyle;
    this.mediaInfo = player.getMediaInfo();
    this.audioLanguage = activeTracks.audio && activeTracks.audio.language;
    this.textLanguage = activeTracks.text && activeTracks.text.language;
    this.advertising = player.config.plugins && player.config.plugins.ima;
  }
}

/**
 * Gets the time to start from with respect to live media.
 * @private
 * @param {KalturaPlayer} player - The player.
 * @returns {number} - The time to start from (0 in live indicates the live edge).
 */
function getStartTime(player: KalturaPlayer): number {
  if (player.isLive()) {
    if (player.isDvr()) {
      const isOnLiveEdge = player.duration - player.currentTime < player.config.cast.dvrThreshold;
      if (isOnLiveEdge || !player.currentTime) {
        return -1;
      }
      return player.currentTime;
    } else {
      return -1;
    }
  }
  return player.currentTime;
}

export {PlayerSnapshot};
