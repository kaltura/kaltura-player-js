// @flow

/**
 * @typedef {Object} HEVCConfigObject
 * @property {number} width - Optional width of the video
 * @property {number} height - Optional height of the video
 * @property {number} bitrate - Optional number of bits used to encode a second of video
 * @property {number} framerate - Optional number of frames used in one second
 */
declare type HEVCConfigObject = {
  width?: number,
  height?: number,
  bitrate?: number,
  framerate?: number
};

/**
 * @typedef {Object} HEVCSupportedObject
 * @property {boolean | string} isHEVCSupported - Specifies whether HEVC is supported by the browser, or "maybe" if there was a problem with getting the information
 * @property {boolean | string} isPowerEfficient - Specifies power efficiency, or "maybe" if there was a problem with getting the information
 */
declare type HEVCSupportedObject = {
  isHEVCSupported: boolean | string,
  isPowerEfficient: boolean | string
};

/**
 * @typedef {Object} DRMSupportedObject
 * @property {boolean | string} isDRMSupported - Specifies whether DRM is supported by the browser, or "maybe" if there was a problem with getting the information
 * @property {Array<string>} supportedDRMs - List of supported DRMs (optional values: widevine, playready, fairplay)
 */
declare type DRMSupportedObject = {
  isDRMSupported: boolean | string,
  supportedDRMs: Array<string>
};

/**
 * @typedef {Object} MediaCapabilitiesObject
 */
declare type MediaCapabilitiesObject = HEVCSupportedObject & DRMSupportedObject;
