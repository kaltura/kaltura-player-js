import { KPAdPod } from './advertising';

export interface IAdsPluginController {
  skipAd(): void;
  playAdNow(adPod: KPAdPod): void;
  onPlaybackEnded(): Promise<void>;
  active: boolean;
  done: boolean;
  name: string;
}
