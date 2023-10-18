import { PlaylistItem } from './playlist-item';
import { MediaSourceOptionsObject } from '../../types/media-source-options';
import { KPPlaylistObject } from '../../types/playlist/KPPlaylistObject';
import { SourcesConfig } from '../../types/sources-config';
import { PluginsConfig } from '../../types/plugins-config';
import { ProviderPlaylistMetadata } from '../../types/playlist/playlist-metadata';
declare class Playlist {
  _id: string;
  _metadata: ProviderPlaylistMetadata;
  _poster: string | undefined;
  _items: Array<PlaylistItem>;
  _activeItemIndex: number;
  constructor();
  configure(config: KPPlaylistObject, sourcesOptions: MediaSourceOptionsObject): void;
  updateItemSources(index: number, sourcesObject: SourcesConfig): void;
  updateItemPlugins(index: number, pluginsObject: PluginsConfig): void;
  get id(): string;
  get items(): Array<PlaylistItem>;
  get metadata(): ProviderPlaylistMetadata;
  get poster(): string | undefined;
  get current(): PlaylistItem | undefined;
  getNext(loop: boolean): PlaylistItem | undefined;
  get prev(): PlaylistItem | undefined;
  set activeItemIndex(index: number);
}
export { Playlist };
//# sourceMappingURL=playlist.d.ts.map
