// @flow
class PlaylistItem {
  _sources: ?PKSourcesConfigObject;
  _config: ?KPPlaylistItemConfigObject;

  constructor(sources: ?PKSourcesConfigObject, config: ?KPPlaylistItemConfigObject) {
    this._sources = sources;
    this._config = config;
  }

  get sources(): ?PKSourcesConfigObject {
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
