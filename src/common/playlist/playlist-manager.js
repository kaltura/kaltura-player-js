// @flow
import {KalturaPlayer} from '../../kaltura-player';
import {FakeEvent, Utils} from 'playkit-js';
import {PlaylistEventType} from './playlist-event-type';
import DefaultPlaylistConfig from './playlist-config';
import getLogger from '../utils/logger';

class PlaylistManager {
  static _logger: any = getLogger('PlaylistManager');

  _player: KalturaPlayer;
  _config: KPPlaylistConfigObject;
  _activeItemIndex: number;

  constructor(player: KalturaPlayer, options: KPOptionsObject) {
    this._player = player;
    this._config = Utils.Object.copyDeep(DefaultPlaylistConfig);
    this.addBindings();
    this._activeItemIndex = 0;
    this.configure(options.playlist);
  }

  addBindings() {
    this._player.addEventListener(
      this._player.Event.Core.PLAYBACK_ENDED,
      () =>
        this.next ? this._config.options.autoContinue && this.playNext() : this._player.dispatchEvent(new FakeEvent(PlaylistEventType.PLAYLIST_ENDED))
    );
  }

  configure(options: ?KPPlaylistConfigObject) {
    Utils.Object.mergeDeep(this._config, options);
    if (this._config.items && this._config.items.find(item => !!item.sources)) {
      this._player.dispatchEvent(new FakeEvent(PlaylistEventType.PLAYLIST_LOADED, {playlist: this._config}));
      this._setActiveItem(this._config.items[0]);
    }
  }

  _setActiveItem(activeItem: KPPlaylistItem): Promise<*> {
    PlaylistManager._logger.debug(`Playing item number ${this._activeItemIndex}`, activeItem);
    this._player.dispatchEvent(new FakeEvent(PlaylistEventType.PLAYLIST_ITEM_CHANGED, {index: this._activeItemIndex, activeItem}));
    if (this._itemHasSources(activeItem)) {
      this._player.reset();
      // $FlowFixMe
      this._player.setMedia({session: {}, plugins: {}, sources: activeItem.sources});
      return Promise.resolve();
    } else if (activeItem.sources && activeItem.sources.id) {
      return this._player.loadMedia({entryId: activeItem.sources.id}).then(mediaConfig => {
        Utils.Object.mergeDeep(activeItem.sources, mediaConfig.sources);
      });
    }
    return Promise.reject();
  }

  _itemHasSources(item: KPPlaylistItem): boolean {
    return !!(
      item.sources &&
      ((item.sources.hls && item.sources.hls.length) ||
        (item.sources.dash && item.sources.dash.length) ||
        (item.sources.progressive && item.sources.progressive.length))
    );
  }

  playNext(): void {
    PlaylistManager._logger.debug('playNext');
    const next = this.next;
    if (next) {
      this._activeItemIndex++;
      this._setActiveItem(next).then(() => {
        this._player.play();
      });
    }
  }

  playPrev(): void {
    PlaylistManager._logger.debug('playPrev');
    const prev = this.prev;
    if (prev) {
      this._activeItemIndex--;
      this._setActiveItem(prev).then(() => {
        this._player.play();
      });
    }
  }

  playItem(index: number): void {
    PlaylistManager._logger.debug(`playItem(${index})`);
    const item = this._config.items[index];
    if (item) {
      this._activeItemIndex = index;
      this._setActiveItem(item).then(() => {
        this._player.play();
      });
    }
  }

  get items(): Array<KPPlaylistItem> {
    return this._config.items;
  }

  get next(): ?KPPlaylistItem {
    return this._config.items[this._activeItemIndex + 1] || null;
  }

  get prev(): ?KPPlaylistItem {
    return this._config.items[this._activeItemIndex - 1] || null;
  }

  get countdown(): KPPlaylistCountdownOptions {
    return this._config.countdown;
  }

  reset() {
    this._activeItemIndex = 0;
    this._config = Utils.Object.copyDeep(DefaultPlaylistConfig);
  }
}

export {PlaylistManager};
