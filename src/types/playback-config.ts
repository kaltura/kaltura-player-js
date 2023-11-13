import {PKPlaybackConfigObject} from '@playkit-js/playkit-js/lib/types';

export interface PlaybackConfig extends PKPlaybackConfigObject {
  autopause: boolean;
  loop: boolean;
}
