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
    this.startTime = getStartTime(player);
    this.autoplay = player.currentTime === 0 ? true : !player.paused;
    this.textStyle = player.textStyle;
    this.mediaInfo = player.getMediaInfo();
    this.audioLanguage = getAudioLanguage(player);
    this.textLanguage = getTextLanguage(player);
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
 * Gets the audio language.
 * If the player has started to play it will return the current played audio.
 * Otherwise, it will return the configured audio.
 * @param {KalturaPlayer} player - The player.
 * @returns {?string} - The audio language or undefined.
 */
function getAudioLanguage(player: KalturaPlayer): ?string {
  if (player.currentTime > 0) {
    const activeTracks = player.getActiveTracks();
    return activeTracks.audio && activeTracks.audio.language;
  }
  return player.config.playback.audioLanguage;
}

/**
 * Gets the text language.
 * If the player has started to play it will return the current played text.
 * Otherwise, it will return the configured text.
 * @param {KalturaPlayer} player - The player.
 * @returns {?string} - The text language or undefined.
 */
function getTextLanguage(player: KalturaPlayer): ?string {
  if (player.currentTime > 0) {
    const activeTracks = player.getActiveTracks();
    return activeTracks.text && activeTracks.text.language;
  }
  return player.config.playback.textLanguage;
}

export {PlayerSnapshot};
