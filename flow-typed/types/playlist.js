// @flow
import {PlaylistItem} from '../../src/common/playlist/playlist-item';

/**
 * @typedef {Object} KPPlaylistOptions
 * @property {boolean} [autoContinue=true] - Determines whether to continue to the next item automatically.
 * @property {boolean} [loop=false] - Determines whether to play the playlist in a loop. When selected, the playlist will play automatically even if autoContinue is set to false.
 */
type _KPPlaylistOptions = {
  autoContinue: boolean,
  loop: boolean
};
declare type KPPlaylistOptions = _KPPlaylistOptions;

/**
 * @typedef {Object} KPPlaylistCountdownOptions
 * @property {number} [timeToShow] - Shows when the countdown is scheduled to appear (by default, this is towards the end).
 * @property {number} [duration=10] - Shows for how long the countdown will appear.
 * @property {boolean} [showing=true] - Determines whether to show the countdown.
 */
type _KPPlaylistCountdownOptions = {
  timeToShow?: number,
  duration: number,
  showing: boolean
};
declare type KPPlaylistCountdownOptions = _KPPlaylistCountdownOptions;

/**
 * @typedef {Object} KPPlaylistConfigObject
 * @property {KPPlaylistOptions} options - Sets the playlist options.
 * @property {KPPlaylistCountdownOptions} countdown - Configures the playlist countdown.
 * @property {Array<PlaylistItem>} items - Lists the available playlist items.
 */
type _KPPlaylistConfigObject = {
  options: KPPlaylistOptions,
  countdown: KPPlaylistCountdownOptions,
  items: Array<PlaylistItem>
};
declare type KPPlaylistConfigObject = _KPPlaylistConfigObject;

/**
 * @typedef {Object} KPPlaylistObject
 * @property {string} id - This is playlist's ID.
 * @property {ProviderPlaylistMetadataObject} metadata - This is the playlist metadata.
 * @property {KPPlaylistOptions} options - These are the playlist options.
 * @property {KPPlaylistCountdownOptions} countdown - This is the playlist countdown configuration.
 * @property {Array<PlaylistItem>} items - These are the playlist items.
 */
type _KPPlaylistObject = {
  id: string,
  metadata: ProviderPlaylistMetadataObject,
  poster?: string,
  options: KPPlaylistOptions,
  countdown: KPPlaylistCountdownOptions,
  items: Array<PlaylistItem>
};
declare type KPPlaylistObject = _KPPlaylistObject;

/**
 * @typedef {Object} KPPlaylistItemConfigObject
 * @property {KPPlaylistCountdownOptions} [countdown] - Countdown options
 */
type _KPPlaylistItemConfigObject = {
  countdown?: KPPlaylistCountdownOptions;
};
declare type KPPlaylistItemConfigObject = _KPPlaylistItemConfigObject;
