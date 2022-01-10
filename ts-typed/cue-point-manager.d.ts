import {CuePoint} from '@playkit-js/playkit-js';
declare namespace KalturaPlayerTypes {
  export interface CuePointManager {
    getAllCuePoints(): Array<CuePoint>;
    getActiveCuePoints(): Array<CuePoint>;
    addCuePoints(cuePointData: Array<CuePoint & any>): void;
    reset(): void;
    destroy(): void;
  }
}
