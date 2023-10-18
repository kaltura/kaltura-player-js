import { KalturaPlayer } from '../../kaltura-player';
import { TextStyle } from '@playkit-js/playkit-js';
import { ProviderMediaInfo } from '../../types/provider/media-info';
import { KPMediaConfig } from '../../types/media-config';
/**
 * @class PlayerSnapshot
 * @param {KalturaPlayer} player -  The Kaltura player.
 *
 */
declare class PlayerSnapshot {
  mediaInfo: ProviderMediaInfo;
  mediaConfig: KPMediaConfig;
  /**
   * @type {TextStyle}
   * @instance
   * @memberof PlayerSnapshot
   */
  textStyle: TextStyle;
  /**
   * @type {Object}
   * @instance
   * @memberof PlayerSnapshot
   */
  advertising: any;
  /**
   * @type {Object}
   * @instance
   * @memberof PlayerSnapshot
   */
  config: any;
  constructor(player: KalturaPlayer);
}
export { PlayerSnapshot };
//# sourceMappingURL=player-snapshot.d.ts.map
