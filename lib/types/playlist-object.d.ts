import { ProviderPlaylistMetadata } from './playlist/playlist-metadata';
import { PlaylistOptions } from './playlist/playlist-options';
import { PlaylistCountdownOptions } from './playlist/playlis-countdown-options';
import { PlaylistItem } from '../common/playlist/playlist-item';
export interface PlaylistConfig {
  id: string;
  metadata: ProviderPlaylistMetadata;
  poster?: string;
  options?: PlaylistOptions;
  countdown?: PlaylistCountdownOptions;
  items: Array<PlaylistItem>;
}
//# sourceMappingURL=playlist-object.d.ts.map
