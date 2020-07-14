//@flow

import {Ad} from '../../src/common/ads';
import {AdBreak} from '../../src/common/ads';

declare interface IAdsController {
  +allAdsCompleted: boolean;
  isAdBreak(): boolean;
  getAdBreaksLayout(): Array<number | string>;
  getAdBreak(): ?AdBreak;
  getAd(): ?Ad;
  skipAd(): void;
  playAdNow(adPod: KPAdPod): void;
}
