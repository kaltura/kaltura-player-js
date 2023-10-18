import { KalturaPlayer } from '../../kaltura-player';
import { TextStyle, TrackType, Utils } from '@playkit-js/playkit-js';
import { ProviderMediaInfo } from '../../types/provider/media-info';
import { KPMediaConfig } from '../../types/media-config';

/**
 * @class PlayerSnapshot
 * @param {KalturaPlayer} player -  The Kaltura player.
 *
 */
class PlayerSnapshot {
  public mediaInfo: ProviderMediaInfo;
  public mediaConfig: KPMediaConfig;
  /**
   * @type {TextStyle}
   * @instance
   * @memberof PlayerSnapshot
   */
  public textStyle: TextStyle;
  /**
   * @type {Object}
   * @instance
   * @memberof PlayerSnapshot
   */
  public advertising: any;
  /**
   * @type {Object}
   * @instance
   * @memberof PlayerSnapshot
   */
  public config: any;

  constructor(player: KalturaPlayer) {
    this.textStyle = player.textStyle;
    this.mediaInfo = player.getMediaInfo();
    this.mediaConfig = player.getMediaConfig();
    this.advertising = player.config.plugins && player.config.plugins.ima;
    this.config = Utils.Object.mergeDeep({}, player.config, {
      sources: {
        startTime: getStartTime(player)
      },
      playback: {
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const isOnLiveEdge = player.duration - player.currentTime < player.config.cast.dvrThreshold;
      if (isOnLiveEdge || !player.currentTime) {
        return -1;
      }
      return player.currentTime;
    } else {
      return -1;
    }
  } else if (!player.isCasting() && !player.currentTime && player.config.sources.startTime > -1) {
    return player.config.sources.startTime;
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
function getLanguage(type: string, player: KalturaPlayer): string | null {
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

export { PlayerSnapshot };
