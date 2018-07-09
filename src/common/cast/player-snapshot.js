// @flow
import KalturaPlayer from '../../kaltura-player'
import {TextStyle} from 'playkit-js'

class PlayerSnapshot {
  startTime: number;
  volume: number;
  muted: boolean;
  autoplay: boolean;
  audioLanguage: ?string;
  textLanguage: ?string;
  mediaInfo: ?ProviderMediaInfoObject;
  isLive: boolean;
  textStyle: TextStyle;
  poster: string;

  constructor(player: KalturaPlayer) {
    const activeTracks = player.getActiveTracks();
    this.startTime = player.currentTime;
    this.volume = player.volume;
    this.muted = player.muted;
    this.autoplay = player.currentTime === 0 ? true : !player.paused;
    this.textStyle = player.textStyle;
    this.mediaInfo = player.getMediaInfo();
    this.isLive = player.isLive();
    this.poster = player.poster;
    this.audioLanguage = activeTracks.audio && activeTracks.audio.language;
    this.textLanguage = activeTracks.text && activeTracks.text.language;
  }
}

export {PlayerSnapshot};
