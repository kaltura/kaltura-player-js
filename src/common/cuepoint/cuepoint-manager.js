//@flow
import {Cue, FakeEvent, TextTrack, EventType} from '@playkit-js/playkit-js';
import {CUE_POINTS_TEXT_TRACK, CUE_POINT_KEY} from './cuepoint-type';

interface CuePoint {
  id: string;
  startTime: number;
  endTime: number;
}

export class CuePointManager {
  _player: KalturaPlayer;
  _textTrack: TextTrack | null = null;

  constructor(player: KalturaPlayer) {
    this._player = player;
  }

  _addTextTrack() {
    this._textTrack = this._player.addTextTrack(TextTrack.KIND.METADATA, CUE_POINTS_TEXT_TRACK);
  }

  _createTextTrackCue(data: CuePoint): window.VTTCue | typeof Cue {
    let cue = {};
    if (window.VTTCue) {
      cue = new window.VTTCue(data.startTime, data.endTime, '');
    } else if (window.TextTrackCue) {
      // IE11 support
      cue = new Cue(data.startTime, data.endTime, '');
    }
    const cueValue = {key: CUE_POINT_KEY, data};
    cue.id = data.id;
    cue.value = cueValue;
    return cue;
  }

  getAllCuePoints() {
    return this._textTrack?.cues || [];
  }

  getCuePointById(id: string) {
    return this._textTrack?.cues?.getCueById(id);
  }

  removeCuePoint(cuePoint: window.VTTCue | typeof Cue) {
    this._textTrack?.removeCue(cuePoint);
  }

  addCuePoints(data: CuePoint[]) {
    if (!this._textTrack) {
      this._addTextTrack();
    }
    const newCuePoints: window.VTTCue | typeof Cue = [];

    data.forEach((cuePoint: CuePoint) => {
      const textTrackCue = this._createTextTrackCue(cuePoint);
      const exisedCue = this.getCuePointById(textTrackCue.id);
      if (exisedCue) {
        this.removeCuePoint(exisedCue);
      }
      this._textTrack?.addCue(textTrackCue);
      newCuePoints.push(textTrackCue);
    });
    this._player.dispatchEvent(new FakeEvent(EventType.TIMED_METADATA_ADDED, {cues: newCuePoints}));
  }

  clearAllCuePoints() {
    if (this._textTrack && this._textTrack.cues.length) {
      while (this._textTrack.cues.length) {
        this.removeCuePoint(this._textTrack.cues[0]);
      }
    }
  }

  reset() {
    this.clearAllCuePoints();
  }

  destroy() {
    this.reset();
  }
}
