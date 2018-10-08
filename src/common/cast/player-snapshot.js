// @flow
import {KalturaPlayer} from '../../kaltura-player';
import {TextStyle} from 'playkit-js';

class PlayerSnapshot {
  startTime: number;
  autoplay: boolean;
  audioLanguage: ?string;
  textLanguage: ?string;
  mediaInfo: ?ProviderMediaInfoObject;
  textStyle: TextStyle;
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
 * @param {KalturaPlayer} player - The player.
 * @returns {number} - The time to start from (0 in live indicates the live edge).
 */
function getStartTime(player: KalturaPlayer): number {
  if (player.isLive()) {
    if (!player.isDvr()) {
      return 0;
    } else {
      return player.duration - player.currentTime < player.config.cast.dvrThreshold ? 0 : player.currentTime;
    }
  } else {
    return player.currentTime;
  }
}

export {PlayerSnapshot};
