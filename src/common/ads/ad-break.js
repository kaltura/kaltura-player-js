// @flow

/**
 * @class AdBreak
 * @param {PKAdBreakOptions} options - Ad break data options.
 */
class AdBreak {
  _type: ?string;
  _position: ?number;
  _numAds: ?number;

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
  get type(): ?string {
    return this._type;
  }

  /**
   * @instance
   * @memberof AdBreak
   * @return {string} - Ad break position on the playback timeline.
   */
  get position(): ?number {
    return this._position;
  }

  /**
   * @instance
   * @memberof AdBreak
   * @return {string} - The number of ads inside the ad break.
   */
  get numAds(): ?number {
    return this._numAds;
  }

  toJSON(): Object {
    return {
      type: this.type,
      position: this.position,
      numAds: this.numAds
    };
  }
}

export {AdBreak};
