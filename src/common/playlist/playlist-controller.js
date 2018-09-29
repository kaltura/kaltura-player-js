// @flow
import {PlaylistManager} from './playlist-manager';

/**
 * Controller for playlist.
 * @classdesc
 */
class PlaylistController implements IPlaylistController {
  /**
   * The context.
   * @member
   * @private
   */
  _context: PlaylistManager;

  /**
   * @constructor
   * @param {PlaylistManager} context - The context.
   */
  constructor(context: PlaylistManager) {
    this._context = context;
  }

  /**
   * Play the next item.
   * @public
   * @returns {void}
   */
  playNext(): void {
    this._context.playNext();
  }

  /**
   * Play the previous item.
   * @public
   * @returns {void}
   */
  playPrev(): void {
    this._context.playPrev();
  }

  /**
   * Play item by index.
   * @param {number} index - the item index
   * @public
   * @returns {void}
   */
  playItem(index: number): void {
    this._context.playItem(index);
  }

  /**
   * Getter to the playlist items.
   * @public
   * @returns {Array<KPPlaylistItem>} - the playlist items
   */
  get items(): Array<KPPlaylistItem> {
    return this._context.items;
  }
}

export {PlaylistController};
