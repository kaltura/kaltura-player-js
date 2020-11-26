// @flow
const formats = ['hls', 'dash', 'progressive'];
/**
 * @class PlaylistItem
 * @param {PKSourcesConfigObject} [sources] - The item sources
 * @param {KPPlaylistItemConfigObject} [config] - The item config
 */
class PlaylistItem {
  _sources: ?PKSourcesConfigObject;
  _config: ?KPPlaylistItemConfigObject;

  constructor(sources: ?PKSourcesConfigObject, config: ?KPPlaylistItemConfigObject) {
    this._sources = sources;
    this._config = config;
  }

  /**
   * Update the playlist item sources
   * @param {PKSourcesConfigObject} sourcesObject - The sources
   * @returns {void}
   * @instance
   * @memberof PlaylistItem
   */
  updateSources(sourcesObject: PKSourcesConfigObject): void {
    formats.forEach(format => {
      this._sources && (this._sources[format] = sourcesObject[format]);
    });
    if (this._sources && sourcesObject.options) {
      this._sources.options = sourcesObject.options;
    }
  }

  /**
   * Playlist item sources
   * @type {?PKSourcesConfigObject}
   * @instance
   * @memberof PlaylistItem
   */
  get sources(): ?PKSourcesConfigObject {
    formats.forEach((format: string) => {
      if (this._sources && this._sources[format] && this._sources[format].length === 0) {
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
  get config(): ?KPPlaylistItemConfigObject {
    return this._config;
  }

  /**
   * @returns {boolean} = Whether the playlist item has sources to play
   * @instance
   * @memberof PlaylistItem
   */
  isPlayable(): boolean {
    return !!formats.find(format => {
      return this._sources && this._sources[format] && this._sources[format].length;
    });
  }
}

export {PlaylistItem};
