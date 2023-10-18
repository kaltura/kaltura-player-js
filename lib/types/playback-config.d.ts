import { StreamPriority } from './stream-priority';
import { PreferNativeConfig } from './prefer-native-config';
export interface PlaybackConfig {
  audioLanguage: string;
  textLanguage: string;
  captionsDisplay: boolean;
  additionalAudioLanguage: string;
  additionalTextLanguage: string;
  volume: number;
  playsinline: boolean;
  crossOrigin: string;
  preload: string;
  autoplay: {
    [type: string]: string | boolean;
  };
  allowMutedAutoPlay: boolean;
  muted: boolean;
  pictureInPicture: boolean;
  streamPriority: StreamPriority[];
  preferNative: PreferNativeConfig;
  inBrowserFullscreen: boolean;
  playAdsWithMSE: boolean;
  screenLockOrientionMode: string;
}
//# sourceMappingURL=playback-config.d.ts.map
