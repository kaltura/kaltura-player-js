import { KalturaPlayer } from '../../kaltura-player';
import { EventManager } from '@playkit-js/playkit-js';
import { Playlist } from './playlist';
import { PlaylistItem } from './playlist-item';
import { PlaylistOptions } from '../../types/playlist/playlist-options';
import { PlaylistCountdownOptions } from '../../types/playlist/playlis-countdown-options';
import { KalturaPlayerConfig } from '../../types/kaltura-player-options';
import { PluginsConfig } from '../../types/plugins-config';
import { KPPlaylistObject } from '../../types/playlist/KPPlaylistObject';
import { ProviderPlaylistMetadata } from '../../types/playlist/playlist-metadata';
import { ProviderEntryListObject } from '../../types/provider/entry-list';
import { ProviderMediaInfo } from '../../types/provider/media-info';
import { ProviderPlaylistObject } from '../../types/provider/provider-playlist-config';
import { PlaylistConfigObject } from '../../types/playlist/playlist- config-object';
/**
 * @class PlaylistManager
 * @param {KalturaPlayer} player - The player instance
 * @param {KPOptionsObject} options - The player config object
 */
declare class PlaylistManager {
  static _logger: any;
  _player: KalturaPlayer;
  _eventManager: EventManager;
  _playlist: Playlist;
  _options: PlaylistOptions;
  _countdown: PlaylistCountdownOptions;
  _playerOptions: KalturaPlayerConfig;
  _mediaInfoList: Array<ProviderMediaInfo>;
  _appPluginConfig: PluginsConfig;
  constructor(player: KalturaPlayer, options: KalturaPlayerConfig);
  /**
   * Config the playlist
   * @param {KPPlaylistObject} [config] - The playlist config
   * @param {ProviderEntryListObject} [entryList] - Entry list
   * @returns {void}
   * @instance
   * @memberof PlaylistManager
   */
  configure(config: KPPlaylistObject, entryList?: ProviderEntryListObject): void;
  /**
   * Load a playlist
   * @param {KPPlaylistObject} playlistData - The playlist data
   * @param {KPPlaylistConfigObject} [playlistConfig] - The playlist config
   * @param {ProviderEntryListObject} [entryList] - Entry list
   * @returns {void}
   * @instance
   * @memberof PlaylistManager
   */
  load(playlistData: ProviderPlaylistObject, playlistConfig: PlaylistConfigObject, entryList: ProviderEntryListObject): void;
  /**
   * Reset the playlist
   * @returns {void}
   * @instance
   * @memberof PlaylistManager
   */
  reset(): void;
  /**
   * Play the next item
   * @returns {void}
   * @instance
   * @memberof PlaylistManager
   */
  playNext(): void;
  /**
   * Play the previous item
   * @returns {void}
   * @instance
   * @memberof PlaylistManager
   */
  playPrev(): void;
  /**
   * Play a specific item
   * @param {number} index - The index of the item to play
   * @returns {void}
   * @instance
   * @memberof PlaylistManager
   */
  playItem(index: number): void;
  /**
   * Playlist items
   * @type {Array<PlaylistItem>}
   * @instance
   * @memberof PlaylistManager
   */
  get items(): Array<PlaylistItem>;
  /**
   * Current item
   * @type {?PlaylistItem}
   * @instance
   * @memberof PlaylistManager
   */
  get current(): PlaylistItem | undefined;
  /**
   * Next item
   * @type {?PlaylistItem}
   * @instance
   * @memberof PlaylistManager
   */
  get next(): PlaylistItem | undefined;
  /**
   * Previous item
   * @type {?PlaylistItem}
   * @instance
   * @memberof PlaylistManager
   */
  get prev(): PlaylistItem | undefined;
  /**
   * Playlist id
   * @type {string}
   * @instance
   * @memberof PlaylistManager
   */
  get id(): string;
  /**
   * Playlist metadata
   * @type {ProviderPlaylistMetadataObject}
   * @instance
   * @memberof PlaylistManager
   */
  get metadata(): ProviderPlaylistMetadata;
  /**
   * Playlist poster
   * @type {?string}
   * @instance
   * @memberof PlaylistManager
   */
  get poster(): string | undefined;
  /**
   * Playlist countdown
   * @type {KPPlaylistCountdownOptions}
   * @instance
   * @memberof PlaylistManager
   */
  get countdown(): PlaylistCountdownOptions;
  /**
   * Playlist options
   * @type {KPPlaylistOptions}
   * @instance
   * @memberof PlaylistManager
   */
  get options(): PlaylistOptions;
  _getMergedPlaylistData(playlistData: ProviderPlaylistObject, playlistConfig: PlaylistConfigObject): KPPlaylistObject;
  _addBindings(): void;
  _onPlaybackEnded(): void;
  _onChangeSourceStarted(): void;
  _setItem(activeItem: PlaylistItem): Promise<any>;
  _resetProviderPluginsConfig(): void;
  destroy(): void;
}
export { PlaylistManager };
//# sourceMappingURL=playlist-manager.d.ts.map
