//@flow
import {FakeEvent, TextTrack, EventType, CuePoint, createTextTrackCue, createCuePoint} from '@playkit-js/playkit-js';
import {CUE_POINTS_TEXT_TRACK} from './cuepoint-type';

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
    const {startTime, endTime, id, metadata} = data;
    return createTextTrackCue({startTime, endTime, id, type: CuePoint.TYPE.CUE_POINT, metadata});
  }

  _cuesSorter(a: CuePoint, b: CuePoint): number {
    return a.startTime - b.startTime;
  }

  getAllCuePoints(): Array<CuePoint> {
    const metadataTracks = this._getMetadataTracks();
    return metadataTracks.reduce((cues, track) => cues.concat(Array.from(track.cues).map(cue => createCuePoint(cue))), []).sort(this._cuesSorter);
  }

  getActiveCuePoints(): Array<CuePoint> {
    const metadataTracks = this._getMetadataTracks();
    return metadataTracks
      .reduce((cues, track) => cues.concat(Array.from(track.activeCues).map(cue => createCuePoint(cue))), [])
      .sort(this._cuesSorter);
  }

  _getTextTrackCueById(id: string): ?TextTrackCue {
    let cuePoint = null;
    const metadataTracks = this._getMetadataTracks();
    metadataTracks.some(track => {
      cuePoint = track.cues.getCueById(id);
      return cuePoint;
    });
    return cuePoint;
  }

  _removeTextTrackCue(cuePoint: TextTrackCue) {
    const metadataTracks = this._getMetadataTracks();
    metadataTracks.forEach(track => {
      try {
        track.removeCue(cuePoint);
      } catch {
        // do nothing
      }
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
        const exisedCue = this._getTextTrackCueById(cuePoint.id);
        if (exisedCue) {
          this._removeTextTrackCue(exisedCue);
        }
        this._textTrack?.addCue(textTrackCue);
        newCuePoints.push(createCuePoint(textTrackCue));
      });
      this._player.dispatchEvent(new FakeEvent(EventType.TIMED_METADATA_ADDED, {cues: newCuePoints}));
    });
  }

  _clearAllTextTrackCues() {
    const metadataTracks = this._getMetadataTracks();
    metadataTracks.forEach(track => {
      while (track.cues.length) {
        this._removeTextTrackCue(track.cues[0]);
      }
    });
  }

  reset() {
    this._clearAllTextTrackCues();
  }

  destroy() {
    this.reset();
  }
}
