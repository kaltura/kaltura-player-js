import { TextTrack, TimedMetadata } from '@playkit-js/playkit-js';
import { KalturaPlayer } from '../../kaltura-player';
import { CuePoint } from '../../types/cue-point';
export declare class CuePointManager {
  _player: KalturaPlayer;
  _textTrack: TextTrack | null;
  constructor(player: KalturaPlayer);
  _addTextTrack(): void;
  _getMetadataTracks(): Array<TextTrack>;
  _createTextTrackCue(data: CuePoint): TextTrackCue;
  _cuesSorter(a: CuePoint, b: CuePoint): number;
  getAllCuePoints(): Array<TimedMetadata>;
  getActiveCuePoints(): Array<TimedMetadata>;
  _getTextTrackCueById(id: string): TextTrackCue | null;
  _removeTextTrackCue(cue: TextTrackCue): void;
  addCuePoints(data: CuePoint[]): void;
  _clearAllTextTrackCues(): void;
  reset(): void;
  destroy(): void;
}
//# sourceMappingURL=cuepoint-manager.d.ts.map
