//@flow
import {FakeEvent, TextTrack, EventType, TimedMetadata, createTextTrackCue, createTimedMetadata} from '@playkit-js/playkit-js';
const CUE_POINTS_TEXT_TRACK = 'CuePoints';

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
    return this._player.getNativeTextTracks().filter(track => track.kind === TextTrack.KIND.METADATA);
  }

  _createTextTrackCue(data: CuePoint): TextTrackCue {
    const {startTime, endTime, id, metadata} = data;
    return createTextTrackCue({startTime, endTime, id, type: TimedMetadata.TYPE.CUE_POINT, metadata});
  }

  _cuesSorter(a: CuePoint, b: CuePoint): number {
    return a.startTime - b.startTime;
  }

  getAllCuePoints(): Array<TimedMetadata> {
    const metadataTracks = this._getMetadataTracks();
    return metadataTracks
      .reduce((cues, track) => cues.concat(Array.from(track.cues).map(cue => createTimedMetadata(cue))), [])
      .sort(this._cuesSorter);
  }

  getActiveCuePoints(): Array<TimedMetadata> {
    const metadataTracks = this._getMetadataTracks();
    return metadataTracks
      .reduce((cues, track) => cues.concat(Array.from(track.activeCues).map(cue => createTimedMetadata(cue))), [])
      .sort(this._cuesSorter);
  }

  _getTextTrackCueById(id: string): ?TextTrackCue {
    let cue = null;
    const metadataTracks = this._getMetadataTracks();
    metadataTracks.some(track => {
      if (track.cues) {
        cue = track.cues.getCueById(id);
      }
      return cue;
    });
    return cue;
  }

  _removeTextTrackCue(cue: TextTrackCue) {
    const metadataTracks = this._getMetadataTracks();
    metadataTracks.forEach(track => {
      try {
        track.removeCue(cue);
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
      const timedMetadataArr: Array<TimedMetadata> = [];
      data.forEach((cuePoint: CuePoint) => {
        const textTrackCue = this._createTextTrackCue(cuePoint);
        const exisedCue = this._getTextTrackCueById(cuePoint.id);
        if (exisedCue) {
          this._removeTextTrackCue(exisedCue);
        }
        this._textTrack?.addCue(textTrackCue);
        timedMetadataArr.push(createTimedMetadata(textTrackCue));
      });
      this._player.dispatchEvent(new FakeEvent(EventType.TIMED_METADATA_ADDED, {cues: timedMetadataArr}));
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
