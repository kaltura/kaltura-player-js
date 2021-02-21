// @flow

/**
 * @typedef {Object} KPAdObject
 * @property {Array<string>} url - List of urls, each one specifies the ad tag url that is requested from the ad server. The player will request the first url, if failed, it will request the second url and so on (aka waterfalling).
 * @property {Array<string>} response - List of XMLs, each one specifies a VAST 2.0 document to be used as the ads response instead of making a request via an ad tag url. The player will use the first XML, if failed, it will use the second and so on (aka waterfalling).
 * @property {boolean} bumper - Specifies whether this is a bumper.
 */
type _KPAdObject = {
  url?: Array<string>,
  response?: Array<string>,
  bumper?: boolean,
  prebid?: KPPrebidConfig
};
declare type KPAdObject = _KPAdObject;

/**
 * @typedef {Array<KPAdObject>} KPAdPod
 */
type _KPAdPod = Array<KPAdObject>;
declare type KPAdPod = _KPAdPod;

/**
 * @typedef {Object} KPAdBreakObject
 * @property {number} position - The position, in seconds, to show the ad break.
 * @property {number} percentage - Alternative parameter to `position`. The position, in percentage of the media length, to show the ad break (optional).
 * @property {number} every - Alternative parameter to `position`. Play ad break every X seconds (optional).
 * @property {KPAdPod} ads - An array of ads to play (Ad pod).
 */
type _KPAdBreakObject = {
  position: number,
  percentage?: number,
  every?: number,
  ads: KPAdPod
};
declare type KPAdBreakObject = _KPAdBreakObject;

/**
 * @typedef {Object} KPAdvertisingConfigObject
 * @property {Array<KPAdBreakObject>} adBreaks - The ad breaks scheme.
 * @property {number} [playAdsAfterTime] - Only play ad breaks scheduled after this time (in seconds). This setting is strictly after - e.g. setting playAdsAfterTime to 15 will cause the player to ignore an ad break scheduled to play at 15s.
 * @property {boolean} [showAdBreakCuePoint] - Whether to show the ad breaks cue points.
 * @property {Object} [adBreakCuePointStyle] - Style options for the ad breaks cue points - See the options {@link https://github.com/kaltura/playkit-js-timeline/blob/main/docs/types.md#cuepointoptionsobject|Here}.
 */
type _KPAdvertisingConfigObject = {
  adBreaks: Array<KPAdBreakObject>,
  playAdsAfterTime?: number,
  showAdBreakCuePoint?: boolean,
  adBreakCuePointStyle?: Object
};
declare type KPAdvertisingConfigObject = _KPAdvertisingConfigObject;
