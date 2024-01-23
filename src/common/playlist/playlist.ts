import { Utils } from '@playkit-js/playkit-js';
import { ProviderPlaylistMetadataObject } from '@playkit-js/playkit-js-providers/ovp-provider';
import { PlaylistItem } from './playlist-item';
import { KPPlaylistObject, SourcesConfig, PluginsConfig, MediaSourceOptionsObject } from '../../types';

class Playlist {
  private _id: string;
  private _metadata: ProviderPlaylistMetadataObject;
  private _poster: string | undefined;
  private _items: Array<PlaylistItem>;
  public _activeItemIndex: number;

  constructor() {
    this._id = '';
    this._metadata = { name: '', description: '' };
    this._poster = '';
    this._items = [];
    this._activeItemIndex = -1;
  }

  public configure(config: KPPlaylistObject, sourcesOptions: MediaSourceOptionsObject): void {
    this._id = config.id ? config.id : this._id;
    this._poster = config.poster ? config.poster : this._poster;
    this._metadata = config.metadata ? config.metadata : this._metadata;
    if (config.items) {
      this._items = [];
      config.items.forEach((item, index) => {
        if (item.sources) {
          const configSourcesOptions = Utils.Object.mergeDeep({}, sourcesOptions);
          const itemSourcesOptions = item.sources.options || {};
          item.sources.options = Utils.Object.mergeDeep(configSourcesOptions, itemSourcesOptions);
        }
        this._items.push(new PlaylistItem(item.sources, item.config, index));
      });
    }
  }

  public updateItemSources(index: number, sourcesObject: SourcesConfig): void {
    this._items[index].updateSources(sourcesObject);
  }

  public updateItemPlugins(index: number, pluginsObject: PluginsConfig): void {
    this._items[index].updatePlugins(pluginsObject);
  }

  public get id(): string {
    return this._id;
  }

  public get items(): Array<PlaylistItem> {
    return this._items;
  }

  public get metadata(): ProviderPlaylistMetadataObject {
    return this._metadata;
  }

  public get poster(): string | undefined {
    return this._poster;
  }

  public get current(): PlaylistItem | undefined {
    return this._items[this._activeItemIndex] || null;
  }

  public getNext(loop: boolean): PlaylistItem | undefined {
    const nextIndex = loop ? (this._activeItemIndex + 1) % this._items.length : this._activeItemIndex + 1;
    return this._items[nextIndex] || null;
  }

  public get prev(): PlaylistItem | undefined {
    return this._items[this._activeItemIndex - 1] || null;
  }

  public set activeItemIndex(index: number) {
    this._activeItemIndex = index;
  }
}

export { Playlist };
