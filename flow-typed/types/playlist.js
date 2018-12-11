// @flow
import {PlaylistItem} from '../../src/common/playlist/playlist-item';

/**
 * @typedef {Object} KPPlaylistOptions
 * @property {boolean} autoContinue - Whether to continue to the next item automatically
 */
type _KPPlaylistOptions = {
  autoContinue: boolean
};
declare type KPPlaylistOptions = _KPPlaylistOptions;

/**
 * @typedef {Object} KPPlaylistCountdownOptions
 * @param {number} [timeToShow] - When the countdown will appear (by default is towards the end)
 * @param {number} [duration=10] - How match time the countdown will appear
 * @param {boolean} [showing=true] - Whether to show the countdown
 */
type _KPPlaylistCountdownOptions = {
  timeToShow?: number,
  duration: number,
  showing: boolean
};
declare type KPPlaylistCountdownOptions = _KPPlaylistCountdownOptions;

/**
 * @typedef {Object} KPPlaylistConfigObject
 * @param {KPPlaylistOptions} options - The playlist options
 * @param {KPPlaylistCountdownOptions} countdown - The playlist countdown config
 * @param {Array<PlaylistItem>} items - The playlist items
 */
type _KPPlaylistConfigObject = {
  options: KPPlaylistOptions,
  countdown: KPPlaylistCountdownOptions,
  items: Array<PlaylistItem>
};
declare type KPPlaylistConfigObject = _KPPlaylistConfigObject;

/**
 * @typedef {Object} KPPlaylistConfigObject
 * @param {string} id - The playlist id
 * @param {ProviderPlaylistMetadataObject} metadata - The playlist metadata
 * @param {KPPlaylistOptions} options - The playlist options
 * @param {KPPlaylistCountdownOptions} countdown - The playlist countdown config
 * @param {Array<PlaylistItem>} items - The playlist items
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
