// @flow
import {PlaylistItem} from '../../src/common/playlist/playlist-item';

/**
 * @typedef {Object} KPPlaylistConfigObject
 * @param {string} id - The playlist id
 * @param {KPPlaylistMetadata} metadata - The playlist metadata
 * @param {KPPlaylistOptions} options - The playlist options
 * @param {KPPlaylistCountdownOptions} countdown - The playlist countdown config
 * @param {Array<PlaylistItem>} items - The playlist items
 */
type _KPPlaylistConfigObject = {
  id: string,
  metadata: KPPlaylistMetadata,
  options: KPPlaylistOptions,
  countdown: KPPlaylistCountdownOptions,
  items: Array<PlaylistItem>
};

declare type KPPlaylistConfigObject = _KPPlaylistConfigObject;
