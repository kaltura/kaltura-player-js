//@flow
import {FakeEvent, TextTrack, EventType, createTextTrackCue} from '@playkit-js/playkit-js';
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

  _getMetadataTracks(): Array<TextTrack> {
    return this._player.getTextTracks().filter(track => track.kind === TextTrack.KIND.METADATA);
  }

  _createTextTrackCue(data: CuePoint): TextTrackCue {
    const {startTime, endTime, id} = data;
    return createTextTrackCue({startTime, endTime, id, type: CUE_POINT_KEY, metadata: data});
  }

  _cuesSorter(a: TextTrackCue, b: TextTrackCue): number {
    return a.startTime - b.startTime;
  }

  getAllCuePoints(): Array<TextTrackCue> {
    const metadataTracks = this._getMetadataTracks();
    return metadataTracks.reduce((cues, track) => cues.concat(...track.cues), []).sort(this._cuesSorter);
  }

  getActiveCuePoints(): Array<TextTrackCue> {
    const metadataTracks = this._getMetadataTracks();
    return metadataTracks.reduce((cues, track) => cues.concat(...track.activeCues), []).sort(this._cuesSorter);
  }

  getCuePointById(id: string): ?TextTrackCue {
    let cuePointById = null;
    const metadataTracks = this._getMetadataTracks();
    metadataTracks.every(track => {
      const cuePoint = track.cues.getCueById(id);
      if (cuePoint) {
        cuePointById = cuePoint;
      }
      return !cuePointById;
    });
    return cuePointById;
  }

  removeCuePoint(cuePoint: TextTrackCue) {
    const metadataTracks = this._getMetadataTracks();
    metadataTracks.forEach(track => {
      track.removeCue(cuePoint);
    });
  }

  addCuePoints(data: CuePoint[]) {
    this._player.ready().then(() => {
      if (!this._textTrack) {
        this._addTextTrack();
      }
      const newCuePoints: Array<TextTrackCue> = [];
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
    });
  }

  clearAllCuePoints() {
    const metadataTracks = this._getMetadataTracks();
    metadataTracks.forEach(track => {
      while (track.cues.length) {
        this.removeCuePoint(track.cues[0]);
      }
    });
  }

  reset() {
    this.clearAllCuePoints();
  }

  destroy() {
    this.reset();
  }
}
