import { Utils } from '@playkit-js/playkit-js';
import {
  PluginsConfig,
  SourcesConfig,
  KPPlaylistItemConfigObject
} from '../../types';
const formats = ['hls', 'dash', 'progressive', 'image', 'doc'];
/**
 * @class PlaylistItem
 * @param {PKSourcesConfigObject} [sources] - The item sources
 * @param {KPPlaylistItemConfigObject} [config] - The item config
 */
class PlaylistItem {
  private _sources: SourcesConfig;
  private _config: KPPlaylistItemConfigObject;
  private _plugins!: PluginsConfig;
  private _index: number;

  constructor(
    sources: SourcesConfig,
    config: KPPlaylistItemConfigObject,
    index: number
  ) {
    this._sources = sources;
    this._config = config;
    this._index = index;
  }

  /**
   * Update the playlist item sources
   * @param {PKSourcesConfigObject} sourcesObject - The sources
   * @returns {void}
   * @instance
   * @memberof PlaylistItem
   */
  public updateSources(sourcesObject: SourcesConfig): void {
    this._sources = Utils.Object.mergeDeep({}, sourcesObject);
  }

  /**
   * Update the playlist item plugins (e.g. bumper from BE)
   * @param {KPPluginsConfigObject} pluginsObject - The plugins
   * @returns {void}
   * @instance
   * @memberof PlaylistItem
   */
  public updatePlugins(pluginsObject: PluginsConfig): void {
    this._plugins = Utils.Object.copyDeep(pluginsObject);
  }

  /**
   * Playlist item sources
   * @type {?PKSourcesConfigObject}
   * @instance
   * @memberof PlaylistItem
   */
  public get sources(): SourcesConfig {
    formats.forEach((format: string) => {
      if (
        this._sources &&
        this._sources[format] &&
        this._sources[format].length === 0
      ) {
        delete this._sources[format];
      }
    });
    return this._sources;
  }

  /**
   * Playlist item config
   * @type {?KPPlaylistItemConfigObject}
   * @instance
   * @memberof PlaylistItem
   */
  public get config(): KPPlaylistItemConfigObject {
    return this._config;
  }

  /**
   * Playlist item plugins
   * @type {KPPluginsConfigObject}
   * @instance
   * @memberof PlaylistItem
   */
  public get plugins(): PluginsConfig {
    return this._plugins || {};
  }

  /**
   * Playlist item index
   * @type {number}
   * @instance
   * @memberof PlaylistItem
   */
  public get index(): number {
    return this._index;
  }

  /**
   * @returns {boolean} = Whether the playlist item has sources to play
   * @instance
   * @memberof PlaylistItem
   */
  public isPlayable(): boolean {
    return !!formats.find((format) => {
      return (
        this._sources && this._sources[format] && this._sources[format].length
      );
    });
  }
}

export { PlaylistItem };
