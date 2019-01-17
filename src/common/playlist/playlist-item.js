// @flow
const formats = ['hls', 'dash', 'progressive'];
/**
 * @class PlaylistItem
 * @param {ProviderMediaConfigSourcesObject} [sources] - The item sources
 * @param {KPPlaylistItemConfigObject} [config] - The item config
 */
class PlaylistItem {
  _sources: ?ProviderMediaConfigSourcesObject;
  _config: ?KPPlaylistItemConfigObject;

  constructor(sources: ?ProviderMediaConfigSourcesObject, config: ?KPPlaylistItemConfigObject) {
    this._sources = sources;
    this._config = config;
  }

  /**
   * Update the playlist item sources
   * @param {ProviderMediaConfigSourcesObject} sourcesObject - The sources
   * @returns {void}
   * @instance
   * @memberof PlaylistItem
   */
  updateSources(sourcesObject: ProviderMediaConfigSourcesObject): void {
    formats.forEach(format => {
      this._sources && (this._sources[format] = sourcesObject[format]);
    });
  }

  /**
   * Playlist item sources
   * @type {?ProviderMediaConfigSourcesObject}
   * @instance
   * @memberof PlaylistItem
   */
  get sources(): ?ProviderMediaConfigSourcesObject {
    formats.forEach(format => {
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
