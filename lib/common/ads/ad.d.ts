import { PKAdOptions } from '../../types/ads/ad-options';
/**
 * @class Ad
 * @param {string} id - Ad ID.
 * @param {PKAdOptions} options - Ad data options.
 */
declare class Ad {
  _id: string;
  _system: string | undefined;
  _url: string | undefined;
  _contentType: string | undefined;
  _title: string | undefined;
  _position: number | undefined;
  _duration: number | undefined;
  _clickThroughUrl: string | undefined;
  _posterUrl: string | undefined;
  _skipOffset: number | undefined;
  _linear: boolean;
  _width: number;
  _height: number;
  _bitrate: number;
  _bumper: boolean;
  _inStream: boolean;
  _vpaid: boolean;
  _streamId: string;
  _wrapperAdIds: Array<string>;
  _wrapperCreativeIds: Array<string>;
  _wrapperAdSystems: Array<string>;
  constructor(id: string, options: PKAdOptions);
  /**
   * @instance
   * @memberof Ad
   * @return {string} - Ad ID.
   */
  get id(): string;
  /**
   * @instance
   * @memberof Ad
   * @return {string | undefined} - Ad system.
   */
  get system(): string | undefined;
  /**
   * @instance
   * @memberof Ad
   * @return {string} - Ad content type.
   */
  get contentType(): string | undefined;
  /**
   * @instance
   * @memberof Ad
   * @return {string} - Ad URL.
   */
  get url(): string | undefined;
  /**
   * @instance
   * @memberof Ad
   * @return {string} - Ad title.
   */
  get title(): string | undefined;
  /**
   * @instance
   * @memberof Ad
   * @return {string} - Ad position inside the ad break.
   */
  get position(): number | undefined;
  /**
   * @instance
   * @memberof Ad
   * @return {string} - Ad duration.
   */
  get duration(): number | undefined;
  /**
   * @instance
   * @memberof Ad
   * @return {string} - Ad click through URL.
   */
  get clickThroughUrl(): string | undefined;
  /**
   * @instance
   * @memberof Ad
   * @return {string} - Ad poster URL.
   */
  get posterUrl(): string | undefined;
  /**
   * @instance
   * @memberof Ad
   * @return {string} - Ad skip offset.
   */
  get skipOffset(): number | undefined;
  /**
   * @instance
   * @memberof Ad
   * @return {boolean} - Whether the ad is linear.
   */
  get linear(): boolean;
  /**
   * @instance
   * @memberof Ad
   * @return {string} - Ad width.
   */
  get width(): number;
  /**
   * @instance
   * @memberof Ad
   * @return {string} - Ad height.
   */
  get height(): number;
  /**
   * @instance
   * @memberof Ad
   * @return {string} - Ad bitrate.
   */
  get bitrate(): number;
  /**
   * @instance
   * @memberof Ad
   * @return {boolean} - Whether the ad is bumper.
   */
  get bumper(): boolean;
  /**
   * @instance
   * @memberof Ad
   * @return {boolean} - Whether the ad is imadai.
   */
  get inStream(): boolean;
  /**
   * @instance
   * @memberof Ad
   * @return {string} - Whether the ad is skippable or not.
   */
  get skippable(): boolean;
  /**
   * @instance
   * @memberof Ad
   * @return {boolean} - Whether the ad is vpaid or not.
   */
  get vpaid(): boolean;
  /**
   * @instance
   * @memberof Ad
   * @return {string} - The ad streamId.
   */
  get streamId(): string;
  /**
   * @instance
   * @memberof Ad
   * @return {string} - The ad wrapperAdIds.
   */
  get wrapperAdIds(): Array<string>;
  /**
   * @instance
   * @memberof Ad
   * @return {string} - The ad wrapperCreativeIds.
   */
  get wrapperCreativeIds(): Array<string>;
  /**
   * @instance
   * @memberof Ad
   * @return {string} - The ad wrapperAdSystems.
   */
  get wrapperAdSystems(): Array<string>;
  toJSON(): Object;
}
export { Ad };
//# sourceMappingURL=ad.d.ts.map
