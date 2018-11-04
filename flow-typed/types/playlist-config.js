// @flow
import {PlaylistItem} from '../../src/common/playlist/playlist-item';

declare type KPPlaylistConfigObject = {
  id: string,
  metadata: KPPlaylistMetadata,
  options: KPPlaylistOptions,
  countdown: KPPlaylistCountdownOptions,
  items: Array<PlaylistItem>
};
