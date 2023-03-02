// @flow

declare type HEVCConfigObject = {
  width?: number,
  height?: number,
  bitrate?: number,
  framerate?: number
};

declare type HEVCSupportedObject = {
  isHevcSupported: boolean | string,
  isPowerEfficient: boolean | string
};

declare type DRMSupportedObject = {
  isDRMSupported: boolean | string,
  supportedDRMs: Array<string>
};

declare type MediaCapabilitiesObject = HEVCSupportedObject & DRMSupportedObject;
