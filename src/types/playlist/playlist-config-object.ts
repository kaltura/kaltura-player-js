import { PlaylistOptions } from './playlist-options';
import { PlaylistCountdownOptions } from './playlis-countdown-options';
import { PlaylistItem } from '../../common/playlist/playlist-item';

export interface PlaylistConfigObject {
  options?: PlaylistOptions;
  countdown?: PlaylistCountdownOptions;
  items: Array<PlaylistItem>;
}
