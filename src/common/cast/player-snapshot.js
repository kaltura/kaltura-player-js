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
    this.startTime = player.isLive() && !player.isDvr() ? 0 : player.currentTime;
    this.autoplay = player.currentTime === 0 ? true : !player.paused;
    this.textStyle = player.textStyle;
    this.mediaInfo = player.getMediaInfo();
    this.audioLanguage = activeTracks.audio && activeTracks.audio.language;
    this.textLanguage = activeTracks.text && activeTracks.text.language;
    this.advertising = player.config.plugins && player.config.plugins.ima;
  }
}

export {PlayerSnapshot};
