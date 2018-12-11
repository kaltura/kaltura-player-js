// @flow
import {Utils} from '@playkit-js/playkit-js';
import {PlaylistItem} from './playlist-item';

class Playlist {
  _id: string;
  _metadata: ProviderPlaylistMetadataObject;
  _poster: ?string;
  _items: Array<PlaylistItem>;
  _activeItemIndex: number;

  constructor() {
    this._id = '';
    this._metadata = {name: '', description: ''};
    this._poster = '';
    this._items = [];
    this._activeItemIndex = -1;
  }

  configure(config: KPPlaylistObject) {
    this._id = config.id;
    this._poster = config.poster;
    Utils.Object.mergeDeep(this._metadata, config.metadata);
    if (config.items) {
      this._items = [];
      config.items.forEach(item => {
        this._items.push(new PlaylistItem(item.sources, item.config));
      });
    }
  }

  updateItemSources(index: number, sourcesObject: ProviderMediaConfigSourcesObject) {
    this._items[index].updateSources(sourcesObject);
  }

  get id(): string {
    return this._id;
  }

  get items(): Array<PlaylistItem> {
    return this._items;
  }

  get metadata(): ProviderPlaylistMetadataObject {
    return this._metadata;
  }

  get poster(): ?string {
    return this._poster;
  }

  get current(): {item: ?PlaylistItem, index: number} {
    return {item: this._items[this._activeItemIndex] || null, index: this._activeItemIndex};
  }

  get next(): {item: ?PlaylistItem, index: number} {
    return {item: this._items[this._activeItemIndex + 1] || null, index: this._activeItemIndex + 1};
  }

  get prev(): {item: ?PlaylistItem, index: number} {
    return {item: this._items[this._activeItemIndex - 1] || null, index: this._activeItemIndex - 1};
  }

  set activeItemIndex(index: number): void {
    this._activeItemIndex = index;
  }
}

export {Playlist};
