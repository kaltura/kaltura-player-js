import { Ad, AdBreak } from '../../common/ads';
import { KPAdPod } from './advertising';
export interface IAdsController {
  allAdsCompleted: boolean;
  isAdBreak(): boolean;
  getAdBreaksLayout(): Array<number | string>;
  getAdBreak(): AdBreak | undefined;
  getAd(): Ad | undefined;
  skipAd(): void;
  playAdNow(adPod: KPAdPod): void;
}
//# sourceMappingURL=ads-controller.d.ts.map
