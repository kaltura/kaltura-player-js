import { PluginsConfig } from '../../types/plugins-config';
import { SourcesConfig } from '../../types/sources-config';
import { KPPlaylistItemConfigObject } from '../../types/playlist/playlist-item-config';
/**
 * @class PlaylistItem
 * @param {PKSourcesConfigObject} [sources] - The item sources
 * @param {KPPlaylistItemConfigObject} [config] - The item config
 */
declare class PlaylistItem {
  _sources: SourcesConfig;
  _config: KPPlaylistItemConfigObject;
  _plugins: PluginsConfig;
  _index: number;
  constructor(sources: SourcesConfig, config: KPPlaylistItemConfigObject, index: number);
  /**
   * Update the playlist item sources
   * @param {PKSourcesConfigObject} sourcesObject - The sources
   * @returns {void}
   * @instance
   * @memberof PlaylistItem
   */
  updateSources(sourcesObject: SourcesConfig): void;
  /**
   * Update the playlist item plugins (e.g. bumper from BE)
   * @param {KPPluginsConfigObject} pluginsObject - The plugins
   * @returns {void}
   * @instance
   * @memberof PlaylistItem
   */
  updatePlugins(pluginsObject: PluginsConfig): void;
  /**
   * Playlist item sources
   * @type {?PKSourcesConfigObject}
   * @instance
   * @memberof PlaylistItem
   */
  get sources(): SourcesConfig;
  /**
   * Playlist item config
   * @type {?KPPlaylistItemConfigObject}
   * @instance
   * @memberof PlaylistItem
   */
  get config(): KPPlaylistItemConfigObject;
  /**
   * Playlist item plugins
   * @type {KPPluginsConfigObject}
   * @instance
   * @memberof PlaylistItem
   */
  get plugins(): PluginsConfig;
  /**
   * Playlist item index
   * @type {number}
   * @instance
   * @memberof PlaylistItem
   */
  get index(): number;
  /**
   * @returns {boolean} = Whether the playlist item has sources to play
   * @instance
   * @memberof PlaylistItem
   */
  isPlayable(): boolean;
}
export { PlaylistItem };
//# sourceMappingURL=playlist-item.d.ts.map
