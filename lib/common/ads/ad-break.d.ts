/**
 * @class AdBreak
 * @param {PKAdBreakOptions} options - Ad break data options.
 */
import { PKAdBreakOptions } from '../../types/ads/ad-break-options';
declare class AdBreak {
  _type: string | undefined;
  _position: number | undefined;
  _numAds: number | undefined;
  constructor(options: PKAdBreakOptions);
  /**
   * @instance
   * @memberof AdBreak
   * @return {string} - Ad break type - pre/mid/post.
   */
  get type(): string | undefined;
  /**
   * @instance
   * @memberof AdBreak
   * @return {string} - Ad break position on the playback timeline.
   */
  get position(): number | undefined;
  /**
   * @instance
   * @memberof AdBreak
   * @return {string} - The number of ads inside the ad break.
   */
  get numAds(): number | undefined;
  toJSON(): Object;
}
export { AdBreak };
//# sourceMappingURL=ad-break.d.ts.map
