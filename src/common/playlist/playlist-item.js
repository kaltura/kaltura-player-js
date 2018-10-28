// @flow
class PlaylistItem {
  _sources: ?ProviderMediaConfigSourcesObject;
  _config: ?KPPlaylistItemConfigObject;

  constructor(sources: ?ProviderMediaConfigSourcesObject, config: ?KPPlaylistItemConfigObject) {
    this._sources = sources;
    this._config = config;
  }

  get sources(): ?ProviderMediaConfigSourcesObject {
    return this._sources;
  }

  get config(): ?KPPlaylistItemConfigObject {
    return this._config;
  }

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
