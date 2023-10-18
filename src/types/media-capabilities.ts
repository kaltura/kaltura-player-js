/**
 * @typedef {Object} HEVCConfigObject
 * @property {number} width - Optional width of the video
 * @property {number} height - Optional height of the video
 * @property {number} bitrate - Optional number of bits used to encode a second of video
 * @property {number} framerate - Optional number of frames used in one second
 */
export type HEVCConfigObject = {
  width?: number;
  height?: number;
  bitrate?: number;
  framerate?: number;
};

/**
 * @typedef {Object} HEVCSupportedObject
 * @property {number} isHEVCSupported - Specifies HEVC supported option by the browser
 * @property {number} isPowerEfficient - Specifies power efficiency supported option
 */
export type HEVCSupportedObject = {
  isHEVCSupported: number;
  isPowerEfficient: number;
};

/**
 * @typedef {Object} DRMSupportedObject
 * @property {number} isDRMSupported - Specifies DRM supported option by the browser
 * @property {Array<string>} supportedDRMs - List of supported DRMs (optional values: widevine; playready; fairplay)
 */
export type DRMSupportedObject = {
  isDRMSupported: number;
  supportedDRMs: Array<string>;
};

/**
 * @typedef {Object} MediaCapabilitiesObject
 */
export type MediaCapabilitiesObject = HEVCSupportedObject & DRMSupportedObject;

/**
 * @typedef {Object.<string; number>} SupportedOptionsType
 */
export type SupportedOptionsType = { [supportedOption: string]: number };
