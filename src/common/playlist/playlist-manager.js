// @flow
import KalturaPlayer from '../../kaltura-player';
import {FakeEvent, Utils} from 'playkit-js';
import {PlaylistEventType} from './playlist-event-type';
import getLogger from '../utils/logger';
import {UIWrapper} from '../ui-wrapper';

class PlaylistManager {
  static _logger: any = getLogger('PlaylistManager');

  _config = {
    metadata: {},
    countdown: {
      duration: 10,
      showing: true
    },
    options: {
      autoContinue: true
    },
    items: []
  };
  _activeItemIndex: number;

  constructor(player: KalturaPlayer, uiWrapper: UIWrapper, options: KPOptionsObject) {
    this._player = player;
    this._uiWrapper = uiWrapper;
    this.addBindings();
    this._activeItemIndex = 0;
    this.configure(options.playlist);
  }

  addBindings() {
    this._player.addEventListener(this._player.Event.PLAYBACK_ENDED, () => this.playNext(this._config.options.autoContinue));
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
    const prevItem = this._config.items[this._activeItemIndex - 1];
    const nextItem = this._config.items[this._activeItemIndex + 1];
    PlaylistManager._logger.debug(`Playing item number ${this._activeItemIndex}`, activeItem);
    this._player.dispatchEvent(new FakeEvent(PlaylistEventType.PLAYLIST_ITEM_CHANGED, {index: this._activeItemIndex, activeItem}));
    this._uiWrapper.setPlaylistConfig({
      prev: prevItem && prevItem.sources,
      next: nextItem && nextItem.sources,
      countdown: nextItem && (nextItem.countdown || this._config.countdown)
    });
    if (this._itemHasSources(activeItem)) {
      this._player.setMedia({session: {}, plugins: {}, sources: activeItem.sources});
      return Promise.resolve();
    } else if (activeItem.sources && activeItem.sources.id) {
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

  playNext(play: boolean = true): void {
    PlaylistManager._logger.debug('playNext');
    const nextIndex = this._activeItemIndex + 1;
    if (this._isValidIndex(nextIndex)) {
      this._activeItemIndex++;
      this._setActiveItem().then(() => {
        if (play) {
          this._player.play();
        }
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
