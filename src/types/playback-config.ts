import { PKPlaybackConfigObject } from '@playkit-js/playkit-js';

export interface FallbackSourceOption {
  fromSource: Record<string, any>;
  toSource: Record<string, any>;
}

export interface PlaybackConfig extends PKPlaybackConfigObject {
  autopause?: boolean;
  loop?: boolean;
  enableCachedUrls?: boolean;
  fallbackSourcesOptions?: FallbackSourceOption[];
}
