// @flow
import {KalturaPlayer} from '../../kaltura-player';
import {TextStyle, TrackType, Utils} from '@playkit-js/playkit-js';

/**
 * @class PlayerSnapshot
 * @param {KalturaPlayer} player -  The Kaltura player.
 *
 */
class PlayerSnapshot {
  mediaInfo: ?ProviderMediaInfoObject;
  mediaConfig: ?KPMediaConfig;
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
  /**
   * @type {Object}
   * @instance
   * @memberof PlayerSnapshot
   */
  config: Object;

  constructor(player: KalturaPlayer) {
    this.textStyle = player.textStyle;
    this.mediaInfo = player.getMediaInfo();
    this.mediaConfig = player.getMediaConfig();
    this.advertising = player.config.plugins && player.config.plugins.ima;
    this.config = Utils.Object.mergeDeep({}, player.config, {
      playback: {
        startTime: getStartTime(player),
        autoplay: player.currentTime === 0 ? true : !player.paused,
        audioLanguage: getLanguage(TrackType.AUDIO, player),
        textLanguage: getLanguage(TrackType.TEXT, player)
      }
    });
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
  } else if (!player.isCasting() && !player.currentTime && player.config.playback.startTime > -1) {
    return player.config.playback.startTime;
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
