// @flow
import {PlaylistItem} from './playlist-item';
import {Utils} from '@playkit-js/playkit-js';

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

  configure(config: KPPlaylistObject, sourcesOptions: ?PKMediaSourceOptionsObject) {
    this._id = config.id;
    this._poster = config.poster;
    this._metadata = config.metadata;
    if (config.items) {
      this._items = [];
      config.items.forEach(item => {
        if (item.sources) {
          const configSourcesOptions = Utils.Object.mergeDeep({}, sourcesOptions);
          const itemSourcesOptions = item.sources.options || {};
          item.sources.options = Utils.Object.mergeDeep(configSourcesOptions, itemSourcesOptions);
        }
        this._items.push(new PlaylistItem(item.sources, item.config));
      });
    }
  }

  updateItemSources(index: number, sourcesObject: PKSourcesConfigObject) {
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

  getNext(loop: boolean): {item: ?PlaylistItem, index: number} {
    const nextIndex = loop ? (this._activeItemIndex + 1) % this._items.length : this._activeItemIndex + 1;
    return {item: this._items[nextIndex] || null, index: nextIndex};
  }

  get prev(): {item: ?PlaylistItem, index: number} {
    return {item: this._items[this._activeItemIndex - 1] || null, index: this._activeItemIndex - 1};
  }

  set activeItemIndex(index: number): void {
    this._activeItemIndex = index;
  }
}

export {Playlist};
