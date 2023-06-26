// @flow
import {KalturaPlayer} from '../../kaltura-player';
import {FakeEvent, Utils, EventManager, getLogger} from '@playkit-js/playkit-js';
import {PlaylistEventType} from './playlist-event-type';
import {Playlist} from './playlist';
import {PlaylistItem} from './playlist-item';
import {mergeProviderPluginsConfig} from '../utils/setup-helpers';

/**
 * @class PlaylistManager
 * @param {KalturaPlayer} player - The player instance
 * @param {KPOptionsObject} options - The player config object
 */
class PlaylistManager {
  static _logger: any = getLogger('PlaylistManager');
  _player: KalturaPlayer;
  _eventManager: EventManager;
  _playlist: Playlist;
  _options: KPPlaylistOptions;
  _countdown: KPPlaylistCountdownOptions;
  _playerOptions: KPOptionsObject;
  _mediaInfoList: Array<ProviderMediaInfoObject>;
  _appPluginConfig: KPPluginsConfigObject;

  constructor(player: KalturaPlayer, options: KPOptionsObject) {
    this._player = player;
    this._eventManager = new EventManager();
    this._playlist = new Playlist();
    this._options = {autoContinue: true, loop: false, imageDuration: 5};
    this._countdown = {duration: 10, showing: true};
    this._mediaInfoList = [];
    this._playerOptions = options;
    this._appPluginConfig = {};
  }

  /**
   * Config the playlist
   * @param {KPPlaylistObject} [config] - The playlist config
   * @param {ProviderEntryListObject} [entryList] - Entry list
   * @returns {void}
   * @instance
   * @memberof PlaylistManager
   */
  configure(config: ?KPPlaylistObject, entryList: ?ProviderEntryListObject) {
    if (config) {
      this._playlist.configure(config, Utils.Object.getPropertyPath(this._player.sources, 'options'));
      Utils.Object.mergeDeep(this._options, config.options);
      Utils.Object.mergeDeep(this._countdown, config.countdown);
      if (config.items && config.items.find(item => !!item.sources)) {
        this._mediaInfoList = config.items.map((item, index) => {
          return entryList && entryList.entries && typeof entryList.entries[index] === 'object'
            ? entryList.entries[index]
            : {entryId: item.sources.id};
        });
        this._player.dispatchEvent(new FakeEvent(PlaylistEventType.PLAYLIST_LOADED, {playlist: this}));
        this._addBindings();
        this.playNext();
      }
    }
  }

  /**
   * Load a playlist
   * @param {KPPlaylistObject} playlistData - The playlist data
   * @param {KPPlaylistConfigObject} [playlistConfig] - The playlist config
   * @param {ProviderEntryListObject} [entryList] - Entry list
   * @returns {void}
   * @instance
   * @memberof PlaylistManager
   */
  load(playlistData: ProviderPlaylistObject, playlistConfig: ?KPPlaylistConfigObject, entryList: ?ProviderEntryListObject): void {
    const mergedPlaylistData: KPPlaylistObject = this._getMergedPlaylistData(playlistData, playlistConfig);
    this.configure(mergedPlaylistData, entryList);
  }

  /**
   * Reset the playlist
   * @returns {void}
   * @instance
   * @memberof PlaylistManager
   */
  reset() {
    this._eventManager.removeAll();
    this._playlist = new Playlist();
    this._mediaInfoList = [];
  }

  /**
   * Play the next item
   * @returns {void}
   * @instance
   * @memberof PlaylistManager
   */
  playNext(): void {
    PlaylistManager._logger.debug('playNext');
    const next = this._playlist.getNext(true);
    if (next) {
      this._setItem(next);
    }
  }

  /**
   * Play the previous item
   * @returns {void}
   * @instance
   * @memberof PlaylistManager
   */
  playPrev(): void {
    PlaylistManager._logger.debug('playPrev');
    const prev = this._playlist.prev;
    if (prev) {
      this._setItem(prev);
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
    PlaylistManager._logger.debug(`playItem(${index})`);
    const item = this._playlist.items[index];
    if (item) {
      this._setItem(item);
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
   * Current item
   * @type {?PlaylistItem}
   * @instance
   * @memberof PlaylistManager
   */
  get current(): ?PlaylistItem {
    return this._playlist.current;
  }

  /**
   * Next item
   * @type {?PlaylistItem}
   * @instance
   * @memberof PlaylistManager
   */
  get next(): ?PlaylistItem {
    return this._playlist.getNext(this._options.loop);
  }

  /**
   * Previous item
   * @type {?PlaylistItem}
   * @instance
   * @memberof PlaylistManager
   */
  get prev(): ?PlaylistItem {
    return this._playlist.prev;
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
   * @type {ProviderPlaylistMetadataObject}
   * @instance
   * @memberof PlaylistManager
   */
  get metadata(): ProviderPlaylistMetadataObject {
    return this._playlist.metadata;
  }

  /**
   * Playlist poster
   * @type {?string}
   * @instance
   * @memberof PlaylistManager
   */
  get poster(): ?string {
    return this._playlist.poster;
  }

  /**
   * Playlist countdown
   * @type {KPPlaylistCountdownOptions}
   * @instance
   * @memberof PlaylistManager
   */
  get countdown(): KPPlaylistCountdownOptions {
    if (this._playlist.current && this._playlist.current.config) {
      const mergedConfig: KPPlaylistCountdownOptions = {duration: 10, showing: true};
      Utils.Object.mergeDeep(mergedConfig, this._countdown, this._playlist.current.config.countdown);
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

  _getMergedPlaylistData(playlistData: ProviderPlaylistObject, playlistConfig: ?KPPlaylistConfigObject): KPPlaylistObject {
    const mergedPlaylistData: KPPlaylistObject = {
      id: playlistData.id,
      metadata: playlistData.metadata,
      poster: (playlistData.poster: string),
      options: playlistConfig ? playlistConfig.options : this._options,
      countdown: playlistConfig ? playlistConfig.countdown : this.countdown,
      items: playlistData.items.map((item, index) => {
        const itemData = Utils.Object.copyDeep(item);
        ['sources.dvr', 'sources.type'].forEach(omitKey => {
          // use medias source data instead of playlist source data
          Utils.Object.deletePropertyPath(itemData, omitKey);
        });
        Utils.Object.mergeDeep(
          itemData.sources,
          playlistConfig && playlistConfig.items && playlistConfig.items[index] && playlistConfig.items[index].sources
        );
        if (Array.isArray(itemData.sources.poster)) {
          this._player.updateKalturaPoster(itemData.sources, item.sources, this._player.dimensions);
        }
        return {
          sources: itemData.sources,
          config: playlistConfig && playlistConfig.items && playlistConfig.items[index] && playlistConfig.items[index].config
        };
      })
    };
    return mergedPlaylistData;
  }

  _addBindings() {
    this._eventManager.listen(this._player, this._player.Event.Core.PLAYBACK_ENDED, () => this._onPlaybackEnded());
    this._eventManager.listen(this._player, this._player.Event.Core.CHANGE_SOURCE_STARTED, () => this._onChangeSourceStarted());
  }

  _onPlaybackEnded(): void {
    const nextItem = this._playlist.getNext(false);
    if (!nextItem) {
      this._player.dispatchEvent(new FakeEvent(PlaylistEventType.PLAYLIST_ENDED));
    }
    if (this._playerOptions.ui.disable || !this.countdown.showing) {
      if ((nextItem && this._options.autoContinue) || this._options.loop) {
        this.playNext();
      }
    }
  }

  _onChangeSourceStarted(): void {
    if (this._playlist.items[this._playlist._activeItemIndex].sources?.type === 'Image') {
      this._player.configure({sources: {duration: this._options.imageDuration}});
    }
  }

  _setItem(activeItem: PlaylistItem): Promise<*> {
    const {index} = activeItem;
    PlaylistManager._logger.debug(`Playing item number ${index}`, activeItem);
    const playback: Object = {loop: false};
    if (this._playlist.current) {
      // from the second item onwards
      playback['autoplay'] = true;
    }
    this._player.configure({playback});
    this._playlist.activeItemIndex = index;
    if (activeItem.isPlayable()) {
      this._resetProviderPluginsConfig();
      const mergedPluginsConfigAndFromApp = mergeProviderPluginsConfig(activeItem.plugins, this._player.config.plugins);
      const providerPlugins = mergedPluginsConfigAndFromApp[0];
      this._appPluginConfig = mergedPluginsConfigAndFromApp[1];
      const media = ({session: this._player.config.session, plugins: providerPlugins, sources: activeItem.sources}: any);
      this._player.setMedia(media);
      this._player.dispatchEvent(new FakeEvent(PlaylistEventType.PLAYLIST_ITEM_CHANGED, {index, activeItem}));
      return Promise.resolve();
    } else {
      if (this._mediaInfoList[index]) {
        this._resetProviderPluginsConfig();
        const media = ({sources: activeItem.sources}: any);
        this._player.setMedia(media);
        return this._player.loadMedia(this._mediaInfoList[index]).then(mediaConfig => {
          this._playlist.updateItemSources(index, mediaConfig.sources);
          this._playlist.updateItemPlugins(index, mediaConfig.plugins);
          this._player.dispatchEvent(new FakeEvent(PlaylistEventType.PLAYLIST_ITEM_CHANGED, {index, activeItem}));
        });
      }
    }
    return Promise.reject();
  }

  _resetProviderPluginsConfig(): void {
    this._player.configure({plugins: this._appPluginConfig});
    this._appPluginConfig = {};
  }

  destroy(): void {
    this._eventManager.destroy();
  }
}

export {PlaylistManager};
