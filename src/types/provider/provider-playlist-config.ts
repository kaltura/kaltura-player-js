import { ProviderPlaylistMetadata } from '../playlist/playlist-metadata';
import { ProviderPlaylistItemObject } from './playlist-item';

export type ProviderPlaylistObject = {
  id: string;
  metadata: ProviderPlaylistMetadata;
  poster: string;
  items: Array<ProviderPlaylistItemObject>;
};
