import {PKPlaybackConfigObject} from '@playkit-js/playkit-js';

export interface PlaybackConfig extends PKPlaybackConfigObject {
  autopause: boolean;
  loop: boolean;
}
