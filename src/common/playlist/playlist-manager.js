// @flow
import {KalturaPlayer} from '../../kaltura-player';
import {FakeEvent, Utils} from 'playkit-js';
import {PlaylistEventType} from './playlist-event-type';
import getLogger from '../utils/logger';
import {Playlist} from './playlist';
import {PlaylistItem} from './playlist-item';

class PlaylistManager {
  static _logger: any = getLogger('PlaylistManager');

  _player: KalturaPlayer;
  _playlist: Playlist;
  _options: KPPlaylistOptions;
  _countdown: KPPlaylistCountdownOptions;

  constructor(player: KalturaPlayer, options: KPOptionsObject) {
    this._player = player;
    this._playlist = new Playlist();
    this._options = {autoContinue: true};
    this._countdown = {duration: 10, showing: true};
    this.configure(options.playlist);
    this.addBindings();
  }

  configure(config: ?KPPlaylistConfigObject) {
    if (config) {
      this._playlist.configure(config);
      Utils.Object.mergeDeep(this._options, config.options);
      Utils.Object.mergeDeep(this._countdown, config.countdown);
      if (this._playlist.items.find(item => !!item.sources)) {
        this._player.dispatchEvent(new FakeEvent(PlaylistEventType.PLAYLIST_LOADED, {playlist: this._playlist}));
        const next = this._playlist.next;
        if (next.item) {
          this._setItem(next.item, next.index);
        }
      }
    }
  }

  addBindings() {
    this._player.addEventListener(
      this._player.Event.Core.PLAYBACK_ENDED,
      () =>
        this._playlist.next
          ? this._options.autoContinue && this.playNext()
          : this._player.dispatchEvent(new FakeEvent(PlaylistEventType.PLAYLIST_ENDED))
    );
  }

  _setItem(activeItem: PlaylistItem, index: number): Promise<*> {
    PlaylistManager._logger.debug(`Playing item number ${index}`, activeItem);
    this._playlist.activeItemIndex = index;
    this._player.dispatchEvent(new FakeEvent(PlaylistEventType.PLAYLIST_ITEM_CHANGED, {index, activeItem}));
    if (activeItem.isPlayable()) {
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

  playNext(): void {
    PlaylistManager._logger.debug('playNext');
    const next = this._playlist.next;
    if (next.item) {
      this._setItem(next.item, next.index).then(() => {
        this._player.play();
      });
    }
  }

  playPrev(): void {
    PlaylistManager._logger.debug('playPrev');
    const prev = this._playlist.prev;
    if (prev.item) {
      this._setItem(prev.item, prev.index).then(() => {
        this._player.play();
      });
    }
  }

  playItem(index: number): void {
    PlaylistManager._logger.debug(`playItem(${index})`);
    const item = this._playlist.items[index];
    if (item) {
      this._setItem(item, index).then(() => {
        this._player.play();
      });
    }
  }

  get items(): Array<PlaylistItem> {
    return this._playlist.items;
  }

  get next(): ?PlaylistItem {
    return this._playlist.next.item;
  }

  get prev(): ?PlaylistItem {
    return this._playlist.prev.item;
  }

  reset() {
    this._playlist = new Playlist();
  }
}

export {PlaylistManager};
