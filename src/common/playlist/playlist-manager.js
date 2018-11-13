// @flow
import {KalturaPlayer} from '../../kaltura-player';
import {FakeEvent, Utils, EventManager} from '@playkit-js/playkit-js';
import {PlaylistEventType} from './playlist-event-type';
import getLogger from '../utils/logger';
import {Playlist} from './playlist';
import {PlaylistItem} from './playlist-item';

/**
 * @class PlaylistManager
 * @param {KalturaPlayer} player - The player instance
 * @param {KPOptionsObject} options - The player config object
 */
class PlaylistManager {
  _logger: any = getLogger('PlaylistManager');
  _player: KalturaPlayer;
  _eventManager: EventManager;
  _playlist: Playlist;
  _playerOptions: KPOptionsObject;
  _options: KPPlaylistOptions;
  _countdown: KPPlaylistCountdownOptions;

  constructor(player: KalturaPlayer, options: KPOptionsObject) {
    this._player = player;
    this._eventManager = new EventManager();
    this._playlist = new Playlist();
    this._options = {autoContinue: true};
    this._countdown = {duration: 10, showing: true};
    this._playerOptions = options;
    this._addBindings();
  }

  /**
   * Config the playlist
   * @param {KPPlaylistConfigObject} [config] - The playlist config
   * @returns {void}
   * @instance
   * @memberof PlaylistManager
   * @private
   */
  configure(config: ?KPPlaylistConfigObject) {
    if (config) {
      this._playlist.configure(config);
      Utils.Object.mergeDeep(this._options, config.options);
      Utils.Object.mergeDeep(this._countdown, config.countdown);
      if (config.items && config.items.find(item => !!item.sources)) {
        this._player.dispatchEvent(new FakeEvent(PlaylistEventType.PLAYLIST_LOADED, {playlist: this}));
        const next = this._playlist.next;
        if (next.item) {
          this._setItem(next.item, next.index).then(() => {
            this._eventManager.listenOnce(this._player, PlaylistEventType.PLAYLIST_ITEM_CHANGED, () => {
              this._player.configure({playback: {autoplay: true}});
            });
          });
        }
      }
    }
  }

  /**
   * Reset the playlist
   * @returns {void}
   * @instance
   * @memberof PlaylistManager
   * @private
   */
  reset() {
    this._playlist = new Playlist();
  }

  /**
   * Play the next item
   * @returns {void}
   * @instance
   * @memberof PlaylistManager
   */
  playNext(): void {
    this._logger.debug('playNext');
    const next = this._playlist.next;
    if (next.item) {
      this._setItem(next.item, next.index);
    }
  }

  /**
   * Play the previous item
   * @returns {void}
   * @instance
   * @memberof PlaylistManager
   */
  playPrev(): void {
    this._logger.debug('playPrev');
    const prev = this._playlist.prev;
    if (prev.item) {
      this._setItem(prev.item, prev.index);
    }
  }

  /**
   * Play a specific item
   * @param {number} index - The index of the item to play
   * @returns {void}
   * @instance
   * @memberof PlaylistManager
   */
  playItem(index: number): void {
    this._logger.debug(`playItem(${index})`);
    const item = this._playlist.items[index];
    if (item) {
      this._setItem(item, index);
    }
  }

  /**
   * Playlist items
   * @type {Array<PlaylistItem>}
   * @instance
   * @memberof PlaylistManager
   */
  get items(): Array<PlaylistItem> {
    return this._playlist.items;
  }

  /**
   * Next item
   * @type {?PlaylistItem}
   * @instance
   * @memberof PlaylistManager
   */
  get next(): ?PlaylistItem {
    return this._playlist.next.item;
  }

  /**
   * Previous item
   * @type {?PlaylistItem}
   * @instance
   * @memberof PlaylistManager
   */
  get prev(): ?PlaylistItem {
    return this._playlist.prev.item;
  }

  /**
   * Playlist id
   * @type {string}
   * @instance
   * @memberof PlaylistManager
   */
  get id(): string {
    return this._playlist.id;
  }

  /**
   * Playlist metadata
   * @type {KPPlaylistMetadata}
   * @instance
   * @memberof PlaylistManager
   */
  get metadata(): KPPlaylistMetadata {
    return this._playlist.metadata;
  }

  /**
   * Playlist countdown
   * @type {KPPlaylistCountdownOptions}
   * @instance
   * @memberof PlaylistManager
   */
  get countdown(): KPPlaylistCountdownOptions {
    if (this._playlist.current.item && this._playlist.current.item.config) {
      const mergedConfig: KPPlaylistCountdownOptions = {duration: 10, showing: true};
      Utils.Object.mergeDeep(mergedConfig, this._countdown, this._playlist.current.item.config.countdown);
      return mergedConfig;
    }
    return this._countdown;
  }

  /**
   * Playlist options
   * @type {KPPlaylistOptions}
   * @instance
   * @memberof PlaylistManager
   */
  get options(): KPPlaylistOptions {
    return this._options;
  }

  _addBindings() {
    this._eventManager.listen(this._player, this._player.Event.Core.PLAYBACK_ENDED, () => this._onPlaybackEnded());
  }

  _onPlaybackEnded(): void {
    if (this._playerOptions.ui.disable || !this.countdown.showing) {
      this._playlist.next
        ? this._options.autoContinue && this.playNext()
        : this._player.dispatchEvent(new FakeEvent(PlaylistEventType.PLAYLIST_ENDED));
    }
  }

  _setItem(activeItem: PlaylistItem, index: number): Promise<*> {
    this._logger.debug(`Playing item number ${index}`, activeItem);
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
}

export {PlaylistManager};
