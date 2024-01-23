/**
 * @typedef {Object} KPPlaylistOptions
 * @property {boolean} [autoContinue=true] - Determines whether to continue to the next item automatically.
 * @property {boolean} [loop=false] - Determines whether to play the playlist in a loop. When selected, the playlist will play automatically even if autoContinue is set to false.
 */
export interface PlaylistOptions {
  autoContinue: boolean;
  loop: boolean;
  imageDuration: number;
}
