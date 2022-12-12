import {TimedMetadata} from '@playkit-js/playkit-js';
declare namespace KalturaPlayerTypes {
  export interface CuePoint {
    id: string;
    startTime: number;
    endTime: number;
    metadata: any;
  }
  export interface CuePointManager {
    getAllCuePoints(): Array<TimedMetadata>;
    getActiveCuePoints(): Array<TimedMetadata>;
    addCuePoints(cuePointData: Array<CuePoint>): void;
    reset(): void;
    destroy(): void;
  }
}
