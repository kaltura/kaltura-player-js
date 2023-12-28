/**
 * @class AdBreak
 * @param {PKAdBreakOptions} options - Ad break data options.
 */
import { PKAdBreakOptions } from '../../types';

class AdBreak {
  private readonly _type: string | undefined;
  private readonly _position: number | undefined;
  private readonly _numAds: number | undefined;

  constructor(options: PKAdBreakOptions) {
    this._type = options.type;
    this._position = options.position;
    this._numAds = options.numAds;
  }

  /**
   * @instance
   * @memberof AdBreak
   * @return {string} - Ad break type - pre/mid/post.
   */
  public get type(): string | undefined {
    return this._type;
  }

  /**
   * @instance
   * @memberof AdBreak
   * @return {string} - Ad break position on the playback timeline.
   */
  public get position(): number | undefined {
    return this._position;
  }

  /**
   * @instance
   * @memberof AdBreak
   * @return {string} - The number of ads inside the ad break.
   */
  public get numAds(): number | undefined {
    return this._numAds;
  }

  public toJSON(): any {
    return {
      type: this.type,
      position: this.position,
      numAds: this.numAds
    };
  }
}

export { AdBreak };
