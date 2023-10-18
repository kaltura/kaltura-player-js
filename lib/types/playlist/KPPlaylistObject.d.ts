import { ProviderPlaylistMetadata } from './playlist-metadata';
import { PlaylistConfigObject } from './playlist- config-object';
/**
 * @typedef {Object} KPPlaylistObject
 * @property {string} id - This is playlist's ID.
 * @property {ProviderPlaylistMetadataObject} metadata - This is the playlist metadata.
 * @property {KPPlaylistOptions} options - These are the playlist options.
 * @property {KPPlaylistCountdownOptions} countdown - This is the playlist countdown configuration.
 * @property {Array<PlaylistItem>} items - These are the playlist items.
 */
export interface KPPlaylistObject extends PlaylistConfigObject {
  id?: string;
  metadata?: ProviderPlaylistMetadata;
  poster?: string;
}
//# sourceMappingURL=KPPlaylistObject.d.ts.map
