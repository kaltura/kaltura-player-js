// @flow
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
    if (this._sources) {
      this._sources.hls = sourcesObject.hls;
      this._sources.dash = sourcesObject.dash;
      this._sources.progressive = sourcesObject.progressive;
    }
  }

  /**
   * Playlist item sources
   * @type {?ProviderMediaConfigSourcesObject}
   * @instance
   * @memberof PlaylistItem
   */
  get sources(): ?ProviderMediaConfigSourcesObject {
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
    return !!(
      this._sources &&
      ((this._sources.hls && this._sources.hls.length) ||
        (this._sources.dash && this._sources.dash.length) ||
        (this._sources.progressive && this._sources.progressive.length))
    );
  }
}

export {PlaylistItem};
