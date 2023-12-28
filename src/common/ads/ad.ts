import { PKAdOptions } from "../../types";

/**
 * @class Ad
 * @param {string} id - Ad ID.
 * @param {PKAdOptions} options - Ad data options.
 */
class Ad {
  private readonly _id: string;
  private readonly _system: string | undefined;
  private readonly _url: string | undefined;
  private readonly _contentType: string | undefined;
  private readonly _title: string | undefined;
  private readonly _position: number | undefined;
  private readonly _duration: number | undefined;
  private readonly _clickThroughUrl: string | undefined;
  private _posterUrl: string | undefined;
  private readonly _skipOffset: number | undefined;
  private _linear: boolean;
  private readonly _width: number;
  private readonly _height: number;
  private readonly _bitrate: number;
  private readonly _bumper: boolean;
  private readonly _inStream: boolean;
  private readonly _vpaid: boolean;
  private readonly _streamId: string;
  private readonly _wrapperAdIds: Array<string>;
  private readonly _wrapperCreativeIds: Array<string>;
  private readonly _wrapperAdSystems: Array<string>;
  constructor(id: string, options: PKAdOptions) {
    this._id = id;
    this._system = options.system;
    this._url = options.url;
    this._contentType = options.contentType;
    this._title = options.title;
    this._position = options.position;
    this._duration = options.duration;
    this._clickThroughUrl = options.clickThroughUrl;
    this._posterUrl = options.posterUrl;
    this._skipOffset = options.skipOffset;
    this._linear = options.linear;
    this._width = options.width || 0;
    this._height = options.height || 0;
    this._bitrate = options.bitrate || 0;
    this._bumper = options.bumper;
    this._inStream = options.inStream || false;
    this._vpaid = options.vpaid || false;
    this._streamId = options.streamId || '';
    this._wrapperAdIds = options.wrapperAdIds;
    this._wrapperCreativeIds = options.wrapperCreativeIds;
    this._wrapperAdSystems = options.wrapperAdSystems;
  }

  /**
   * @instance
   * @memberof Ad
   * @return {string} - Ad ID.
   */
  public get id(): string {
    return this._id;
  }

  /**
   * @instance
   * @memberof Ad
   * @return {string | undefined} - Ad system.
   */
  public get system(): string | undefined {
    return this._system;
  }

  /**
   * @instance
   * @memberof Ad
   * @return {string} - Ad content type.
   */
  public get contentType(): string | undefined {
    return this._contentType;
  }

  /**
   * @instance
   * @memberof Ad
   * @return {string} - Ad URL.
   */
  public get url(): string | undefined {
    return this._url;
  }

  /**
   * @instance
   * @memberof Ad
   * @return {string} - Ad title.
   */
  public get title(): string | undefined {
    return this._title;
  }

  /**
   * @instance
   * @memberof Ad
   * @return {string} - Ad position inside the ad break.
   */
  public get position(): number | undefined {
    return this._position;
  }

  /**
   * @instance
   * @memberof Ad
   * @return {string} - Ad duration.
   */
  public get duration(): number | undefined {
    return this._duration;
  }

  /**
   * @instance
   * @memberof Ad
   * @return {string} - Ad click through URL.
   */
  public get clickThroughUrl(): string | undefined {
    return this._clickThroughUrl;
  }

  /**
   * @instance
   * @memberof Ad
   * @return {string} - Ad poster URL.
   */
  public get posterUrl(): string | undefined {
    return this._posterUrl;
  }

  /**
   * @instance
   * @memberof Ad
   * @return {string} - Ad skip offset.
   */
  public get skipOffset(): number | undefined {
    return this._skipOffset;
  }

  /**
   * @instance
   * @memberof Ad
   * @return {boolean} - Whether the ad is linear.
   */
  public get linear(): boolean {
    return this._linear;
  }

  /**
   * @instance
   * @memberof Ad
   * @return {string} - Ad width.
   */
  public get width(): number {
    return this._width;
  }

  /**
   * @instance
   * @memberof Ad
   * @return {string} - Ad height.
   */
  public get height(): number {
    return this._height;
  }

  /**
   * @instance
   * @memberof Ad
   * @return {string} - Ad bitrate.
   */
  public get bitrate(): number {
    return this._bitrate;
  }

  /**
   * @instance
   * @memberof Ad
   * @return {boolean} - Whether the ad is bumper.
   */
  public get bumper(): boolean {
    return this._bumper;
  }

  /**
   * @instance
   * @memberof Ad
   * @return {boolean} - Whether the ad is imadai.
   */
  public get inStream(): boolean {
    return this._inStream;
  }

  /**
   * @instance
   * @memberof Ad
   * @return {string} - Whether the ad is skippable or not.
   */
  public get skippable(): boolean {
    return !!(this.skipOffset && this.skipOffset > 0);
  }

  /**
   * @instance
   * @memberof Ad
   * @return {boolean} - Whether the ad is vpaid or not.
   */
  public get vpaid(): boolean {
    return this._vpaid;
  }

  /**
   * @instance
   * @memberof Ad
   * @return {string} - The ad streamId.
   */
  public get streamId(): string {
    return this._streamId;
  }

  /**
   * @instance
   * @memberof Ad
   * @return {string} - The ad wrapperAdIds.
   */
  public get wrapperAdIds(): Array<string> {
    return this._wrapperAdIds;
  }

  /**
   * @instance
   * @memberof Ad
   * @return {string} - The ad wrapperCreativeIds.
   */
  public get wrapperCreativeIds(): Array<string> {
    return this._wrapperCreativeIds;
  }

  /**
   * @instance
   * @memberof Ad
   * @return {string} - The ad wrapperAdSystems.
   */
  public get wrapperAdSystems(): Array<string> {
    return this._wrapperAdSystems;
  }

  public toJSON(): any {
    return {
      id: this.id,
      system: this.system,
      url: this.url,
      contentType: this.contentType,
      title: this.title,
      position: this.position,
      duration: this.duration,
      clickThroughUrl: this.clickThroughUrl,
      posterUrl: this.posterUrl,
      skipOffset: this.skipOffset,
      linear: this.linear,
      skippable: this.skippable,
      width: this.width,
      height: this.height,
      bitrate: this.bitrate,
      bumper: this.bumper,
      inStream: this.inStream,
      vpaid: this.vpaid
    };
  }
}

export { Ad };
