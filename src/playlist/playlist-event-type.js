// @flow
const namespace = 'kaltura-player';

/**
 * @const {Object} PlaylistEventType
 *
 * @example
 * // Events lifecycle
 * 1. PLAYLIST_LOADED
 * 2. PLAYLIST_ITEM_CHANGED (multiple)
 * 3. PLAYLIST_ENDED
 * @example
 * // How to use
 * player.addEventListener(KalturaPlayer.playlist.PlaylistEventType.PLAYLIST_LOADED, e => {
 *   console.log(e.payload.playlist.metadata.name);
 * };
 */
const PlaylistEventType: {[event: string]: string} = {
  /**
   * Fires when the playlist has been loaded.
   * @event PLAYLIST_LOADED
   * @memberof PlaylistEventType
   */
  PLAYLIST_LOADED: `${namespace}-playlistloaded`,
  /**
   * Fires when a playlist item start to changed.
   * @event PLAYLIST_ITEM_CHANGED
   * @memberof PlaylistEventType
   */
  PLAYLIST_ITEM_CHANGED: `${namespace}-playlistitemchanged`,
  /**
   * Fires when the playlist has finished.
   * @event PLAYLIST_ENDED
   * @memberof PlaylistEventType
   */
  PLAYLIST_ENDED: `${namespace}-playlistended`
};

export {PlaylistEventType};
