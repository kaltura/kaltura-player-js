// @flow
class Playlist {
  _id: string;
  _metadata: KPPlaylistMetadata;
  _items: Array<KPPlaylistItem>;
  _options: KPPlaylistOptions;
  _countdown: KPPlaylistCountdownOptions;

  constructor(options: KPPlaylistConfigObject) {
    this._id = options.id;
    this._metadata = options.metadata;
    this._items = options.items;
    this._options = options.options;
    this._countdown = options.countdown;
  }
}
export {Playlist};
