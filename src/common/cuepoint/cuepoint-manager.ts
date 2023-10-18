//@flow
import { FakeEvent, TextTrack, EventType, TimedMetadata, createTextTrackCue, createTimedMetadata } from '@playkit-js/playkit-js';
import { KalturaPlayer } from '../../kaltura-player';
import { CuePoint } from '../../types/cue-point';
const CUE_POINTS_TEXT_TRACK = 'CuePoints';

export class CuePointManager {
  private _player: KalturaPlayer;
  private _textTrack: TextTrack | null = null;

  constructor(player: KalturaPlayer) {
    this._player = player;
  }

  private _addTextTrack(): void {
    this._textTrack = this._player.addTextTrack(TextTrack.KIND.METADATA, CUE_POINTS_TEXT_TRACK);
  }

  private _getMetadataTracks(): Array<TextTrack> {
    return this._player.getNativeTextTracks().filter((track) => track.kind === TextTrack.KIND.METADATA && track.cues);
  }

  private _createTextTrackCue(data: CuePoint): TextTrackCue {
    const { startTime, endTime, id, metadata } = data;
    return createTextTrackCue({
      startTime,
      endTime,
      id,
      type: TimedMetadata.TYPE.CUE_POINT,
      metadata
    });
  }

  private _cuesSorter(a: CuePoint, b: CuePoint): number {
    return a.startTime - b.startTime;
  }

  public getAllCuePoints(): Array<TimedMetadata> {
    const metadataTracks = this._getMetadataTracks();
    return metadataTracks.reduce((cues, track) => cues.concat(Array.from(track.cues).map((cue) => createTimedMetadata(cue))), []).sort(this._cuesSorter);
  }

  public getActiveCuePoints(): Array<TimedMetadata> {
    const metadataTracks = this._getMetadataTracks();
    return metadataTracks.reduce((cues, track) => cues.concat(Array.from(track.activeCues).map((cue) => createTimedMetadata(cue))), []).sort(this._cuesSorter);
  }

  private _getTextTrackCueById(id: string): TextTrackCue | null {
    let cue = null;
    const metadataTracks = this._getMetadataTracks();
    metadataTracks.some((track) => {
      cue = track.cues.getCueById(id);
      return cue;
    });
    return cue;
  }

  private _removeTextTrackCue(cue: TextTrackCue): void {
    const metadataTracks = this._getMetadataTracks();
    metadataTracks.forEach((track) => {
      try {
        track.removeCue(cue);
      } catch {
        // do nothing
      }
    });
  }

  public addCuePoints(data: CuePoint[]): void {
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
      // eslint-disable-next-line  @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this._player.dispatchEvent(
        new FakeEvent(EventType.TIMED_METADATA_ADDED, {
          cues: timedMetadataArr
        })
      );
    });
  }

  private _clearAllTextTrackCues(): void {
    const metadataTracks = this._getMetadataTracks();
    metadataTracks.forEach((track) => {
      while (track.cues.length) {
        this._removeTextTrackCue(track.cues[0]);
      }
    });
  }

  public reset(): void {
    this._clearAllTextTrackCues();
  }

  public destroy(): void {
    this.reset();
  }
}
