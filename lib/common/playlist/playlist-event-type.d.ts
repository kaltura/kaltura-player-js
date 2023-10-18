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
declare const PlaylistEventType: {
  [event: string]: string;
};
export { PlaylistEventType };
//# sourceMappingURL=playlist-event-type.d.ts.map
