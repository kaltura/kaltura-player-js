import { PlaylistOptions } from './playlist';
import { PlaylistCountdownOptions } from './playlist';
import { PlaylistItem } from '../common/playlist/playlist-item';
import { ProviderPlaylistMetadataObject } from '@playkit-js/playkit-js-providers';

export interface PlaylistConfig {
  id: string;
  metadata: ProviderPlaylistMetadataObject;
  poster?: string;
  options?: PlaylistOptions;
  countdown?: PlaylistCountdownOptions;
  items: Array<PlaylistItem>;
}
