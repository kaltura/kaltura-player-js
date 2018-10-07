// @flow
import KalturaPlayer from '../../kaltura-player';
import {FakeEvent, Utils} from 'playkit-js';
import {PlaylistEventType} from './playlist-event-type';
import getLogger from '../utils/logger';

class PlaylistManager {
  static _logger: any = getLogger('PlaylistManager');

  _config = {
    metadata: {},
    countdown: {
      duration: 10,
      showing: true
    },
    options: {
      autoContinue: false
    },
    items: []
  };
  _activeItemIndex: number;

  constructor(player: KalturaPlayer, options: KPOptionsObject) {
    this._player = player;
    this.addBindings();
    this._activeItemIndex = 0;
    this.configure(options.playlist);
  }

  addBindings() {
    this._player.addEventListener(this._player.Event.PLAYBACK_ENDED, () => this.playNext());
  }

  configure(options: KPPlaylistConfigObject) {
    Utils.Object.mergeDeep(this._config, options);
    if (this._config.items && this._config.items.length) {
      this._player.dispatchEvent(new FakeEvent(PlaylistEventType.PLAYLIST_LOADED, {playlist: this._config}));
      this._setActiveItem();
    }
  }

  _getTimeToShow() {
    const activeItem = this._config.items[this._activeItemIndex];
    return (
      (activeItem.countdown && activeItem.countdown.timeToShow) ||
      this._player.duration - ((activeItem.countdown && activeItem.countdown.duration) || this._config.countdown.duration)
    );
  }

  _setActiveItem(): Promise<*> {
    const activeItem = this._config.items[this._activeItemIndex];
    PlaylistManager._logger.debug(`Playing item number ${this._activeItemIndex}`, activeItem);
    this._player.dispatchEvent(new FakeEvent(PlaylistEventType.PLAYLIST_ITEM_CHANGED, {index: this._activeItemIndex, activeItem}));
    if (this._itemHasSources(activeItem)) {
      this._player.setMedia({plugins: {}, sources: activeItem.sources});
      return Promise.resolve();
    } else {
      return this._player.loadMedia({entryId: activeItem.sources.id}).then(mediaConfig => {
        Utils.Object.mergeDeep(activeItem.sources, mediaConfig.sources);
      });
    }
  }

  _itemHasSources(item: KPPlaylistItem): boolean {
    return (
      item.sources &&
      ((item.sources.hls && item.sources.hls.length) ||
        (item.sources.dash && item.sources.dash.length) ||
        (item.sources.progressive && item.sources.progressive.length))
    );
  }

  playNext(): void {
    PlaylistManager._logger.debug('playNext');
    const nextIndex = this._activeItemIndex + 1;
    if (this._isValidIndex(nextIndex)) {
      this._activeItemIndex++;
      this._setActiveItem().then(() => {
        this._player.play();
      });
    }
  }

  playPrev(): void {
    PlaylistManager._logger.debug('playPrev');
    const prevIndex = this._activeItemIndex - 1;
    if (this._isValidIndex(prevIndex)) {
      this._activeItemIndex--;
      this._setActiveItem().then(() => {
        this._player.play();
      });
    }
  }

  playItem(index: number): void {
    PlaylistManager._logger.debug(`playItem(${index})`);
    if (this._isValidIndex(index)) {
      this._activeItemIndex = index;
      this._setActiveItem().then(() => {
        this._player.play();
      });
    }
  }

  _isValidIndex(index: number): boolean {
    return !!this._config.items[index];
  }

  get items(): Array<KPPlaylistItem> {
    return this._config.items;
  }

  reset() {}
}

export {PlaylistManager};
