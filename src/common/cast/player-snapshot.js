// @flow
import KalturaPlayer from '../../kaltura-player';
import {TextStyle} from 'playkit-js';

class PlayerSnapshot {
  startTime: number;
  autoplay: boolean;
  audioLanguage: ?string;
  textLanguage: ?string;
  mediaInfo: ?ProviderMediaInfoObject;
  textStyle: TextStyle;

  constructor(player: KalturaPlayer) {
    const activeTracks = player.getActiveTracks();
    this.startTime = player.currentTime;
    this.autoplay = player.currentTime === 0 ? true : !player.paused;
    this.textStyle = player.textStyle;
    this.mediaInfo = player.getMediaInfo();
    this.audioLanguage = activeTracks.audio && activeTracks.audio.language;
    this.textLanguage = activeTracks.text && activeTracks.text.language;
  }
}

export {PlayerSnapshot};
