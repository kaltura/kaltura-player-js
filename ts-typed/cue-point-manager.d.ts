declare namespace KalturaPlayerTypes {
  export interface CuePoint {
    id: string;
    startTime: number;
    endTime: number;
  }
  export interface CuePointManager {
    getAllCuePoints(): Array<VTTCue>;
    getActiveCuePoints(): Array<VTTCue>;
    getCuePointById(id: string): VTTCue;
    removeCuePoint(cuePoint: VTTCue): void;
    addCuePoints(cuePointData: Array<CuePoint & any>): void;
    clearAllCuePoints(): void;
    reset(): void;
    destroy(): void;
  }
}
