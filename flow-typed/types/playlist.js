// @flow
import {PlaylistItem} from '../../src/common/playlist/playlist-item';

/**
 * @typedef {Object} KPPlaylistOptions
 * @property {boolean} autoContinue - Determine whether to continue to the next item automatically.
 */
type _KPPlaylistOptions = {
  autoContinue: boolean
};
declare type KPPlaylistOptions = _KPPlaylistOptions;

/**
 * @typedef {Object} KPPlaylistCountdownOptions
 * @property {number} [timeToShow] - Shows when the countdown is scheduled to appear (by default, this is towards the end).
 * @property {number} [duration=10] - Shows how the match time countdown will appear.
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
 * @property {KPPlaylistOptions} options - The playlist options.
 * @property {KPPlaylistCountdownOptions} countdown - The playlist countdown configuration.
 * @property {Array<PlaylistItem>} items - The playlist items.
 */
type _KPPlaylistConfigObject = {
  options: KPPlaylistOptions,
  countdown: KPPlaylistCountdownOptions,
  items: Array<PlaylistItem>
};
declare type KPPlaylistConfigObject = _KPPlaylistConfigObject;

/**
 * @typedef {Object} KPPlaylistObject
 * @property {string} id - The playlist ID.
 * @property {ProviderPlaylistMetadataObject} metadata - The playlist metadata.
 * @property {KPPlaylistOptions} options - The playlist options.
 * @property {KPPlaylistCountdownOptions} countdown - The playlist countdown configuration.
 * @property {Array<PlaylistItem>} items - The playlist items.
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
