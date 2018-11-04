// @flow
import {KalturaPlayer} from '../../kaltura-player';
import {TextStyle, TrackType} from 'playkit-js';

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
    this.startTime = getStartTime(player);
    this.autoplay = player.currentTime === 0 ? true : !player.paused;
    this.textStyle = player.textStyle;
    this.mediaInfo = player.getMediaInfo();
    this.audioLanguage = getLanguage(TrackType.AUDIO, player);
    this.textLanguage = getLanguage(TrackType.TEXT, player);
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

/**
 * Gets the audio/text language.
 * If the player has started to play it will return the current played audio/text.
 * Otherwise, it will return the configured audio/text.
 * @private
 * @param {string} type - The language type.
 * @param {KalturaPlayer} player - The player.
 * @returns {?string} - The audio language or undefined.
 */
function getLanguage(type: string, player: KalturaPlayer): ?string {
  const activeTracks = player.getActiveTracks();
  if (activeTracks[type]) {
    return activeTracks[type].language;
  }
  try {
    return player.config.playback[`${type}Language`];
  } catch (e) {
    return null;
  }
}

export {PlayerSnapshot};
