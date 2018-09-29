// @flow
import KalturaPlayer from '../../kaltura-player';
import {FakeEvent, Utils} from 'playkit-js';
import {PlaylistEventType} from './playlist-event-type';
import {PlaylistController} from './playlist-controller';

class PlaylistManager {
  _controller: ?IPlaylistController;
  _config = {};

  constructor(player: KalturaPlayer, options: KPOptionsObject) {
    this._player = player;
    this.addBindings();
    this.configure(options.playlist);
  }

  addBindings() {
    this._player.addEventListener(this._player.Event.FIRST_PLAYING, () => this._onFirstPlaying());
    this._player.addEventListener(this._player.Event.PLAYBACK_ENDED, () => this.playNext());
  }

  configure(options: KPPlaylistOptionsObject) {
    Utils.Object.mergeDeep(this._config, options);
    if (this._config.items && this._config.items.length) {
      this._player.dispatchEvent(new FakeEvent(PlaylistEventType.PLAYLIST_LOADED, {playlist: this._config}));
      this._activeItemIndex = 0;
      this._setActiveItem();
      if (!this._controller) {
        this._controller = new PlaylistController(this);
      }
    }
  }

  getController(): ?IPlaylistController {
    return this._controller;
  }

  _onFirstPlaying() {
    this._countdownInterval = setInterval(() => {
      if (this._player.currentTime >= this._getTimeToShow()) {
        clearInterval(this._countdownInterval);
        const nextItem = this._config.items[this._activeItemIndex + 1];
        if (nextItem) {
          this._player.fetchMedia({entryId: nextItem.sources.id}).then(mediaConfig => {
            Utils.Object.mergeDeep(nextItem.sources, mediaConfig.sources);
            this._player.prepareEntry(mediaConfig);
          });
        }
      }
    }, 1000);
  }

  _getTimeToShow() {
    const activeItem = this._config.items[this._activeItemIndex];
    return (
      (activeItem.countdown && activeItem.countdown.timeToShow) ||
      this._player.duration - ((activeItem.countdown && activeItem.countdown.duration) || this._config.countdown.duration)
    );
  }

  _setActiveItem(autoplay: ?boolean) {
    const activeItem = this._config.items[this._activeItemIndex];
    this._player.dispatchEvent(new FakeEvent(PlaylistEventType.PLAYLIST_ITEM_CHANGED, {index: this._activeItemIndex, activeItem}));
    if (typeof autoplay === 'boolean') {
      this._player.configure({playback: {autoplay}});
    }
    if (activeItem.sources.hls.length) {
      // reach the condition
      this._player.reset();
      this._player.configure(activeItem); // maybe use setMedia but need session and plugins
    } else {
      this._player.loadMedia({entryId: activeItem.sources.id}).then(mediaConfig => {
        Utils.Object.mergeDeep(activeItem.sources, mediaConfig.sources);
      });
    }
  }

  getActiveSources(): Promise<*> {
    const activeItem = this._config.items[this._activeItemIndex];
    if (activeItem.sources.hls.length) {
      return Promise.resolve(activeItem.sources);
    } else {
      this._player.loadMedia({entryId: activeItem.sources.id}).then();
    }
  }

  playNext() {
    if (typeof this._activeItemIndex === 'number' && this._config.items[this._activeItemIndex + 1]) {
      this._activeItemIndex++;
      this._setActiveItem(true);
    }
  }

  playPrev() {
    if (typeof this._activeItemIndex === 'number' && this._config.items[this._activeItemIndex - 1]) {
      this._activeItemIndex--;
      this._setActiveItem(true);
    }
  }

  playItem(index: number) {
    if (this._config.items[index]) {
      this._activeItemIndex = index;
      this._setActiveItem(true);
    }
  }

  get items(): Array<KPPlaylistItem> {
    return this._config.items;
  }

  reset() {}
}

export {PlaylistManager};
