//@flow

import {Ad} from '../../src/common/ads/ad';
import {AdBreak} from '../../src/common/ads/ad-break';

declare interface IAdsController {
  +allAdsCompleted: boolean;
  isAdBreak(): boolean;
  getAdBreaksLayout(): Array<number | string>;
  getAdBreak(): ?AdBreak;
  getAd(): ?Ad;
  skipAd(): void;
  playAdNow(adPod: KPAdPod): void;
}
