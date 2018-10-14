// @flow
import {Utils} from 'playkit-js';
import {PlaylistItem} from './playlist-item';

class Playlist {
  _id: string;
  _items: Array<PlaylistItem>;
  _metadata: KPPlaylistMetadata;
  _activeItemIndex: number;

  constructor() {
    this._id = '';
    this._items = [];
    this._metadata = {name: '', description: ''};
    this._activeItemIndex = -1;
  }

  configure(config: KPPlaylistConfigObject) {
    this._id = config.id;
    Utils.Object.mergeDeep(this._metadata, config.metadata);
    if (config.items) {
      this._items = [];
      config.items.forEach(item => {
        this._items.push(new PlaylistItem(item.sources, item.config));
      });
    }
  }

  get id(): string {
    return this._id;
  }

  get items(): Array<PlaylistItem> {
    return this._items;
  }

  get metadata(): KPPlaylistMetadata {
    return this._metadata;
  }

  get next(): {item: ?PlaylistItem, index: number} {
    return {item: this.items[this._activeItemIndex + 1] || null, index: this._activeItemIndex + 1};
  }

  get prev(): {item: ?PlaylistItem, index: number} {
    return {item: this.items[this._activeItemIndex - 1] || null, index: this._activeItemIndex - 1};
  }

  set activeItemIndex(index: number): void {
    this._activeItemIndex = index;
  }
}

export {Playlist};
