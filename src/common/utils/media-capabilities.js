//@flow
import {getLogger} from '@playkit-js/playkit-js';

const _logger: any = getLogger('MediaCapabilities');

/**
 * get the media capabilities
 * @function getMediaCapabilities
 * @param {HEVCConfigObject} hevcConfig - The HEVC configuration to check (optional).
 * @returns {Promise<MediaCapabilitiesObject>} - The media capabilities object.
 * @public
 */
async function getMediaCapabilities(hevcConfig?: HEVCConfigObject): Promise<MediaCapabilitiesObject> {
  let mediaCapabilities;
  try {
    _logger.debug('Starting to get media capabilities...');
    const hevcSupported = await _checkHEVCSupported(hevcConfig);
    const drmSupported = await _checkDRMSupported();
    mediaCapabilities = Object.assign({}, hevcSupported, drmSupported);
    _logger.debug('Finished getting media capabilities ', {mediaCapabilities});
    return mediaCapabilities;
  } catch (ex) {
    _logger.debug('There was a problem with getting the media capabilities, ', ex.message);
    mediaCapabilities = {
      isHEVCSupported: false,
      isPowerEfficient: false,
      isDRMSupported: false,
      supportedDRMs: []
    };
    _logger.debug('Returning media capabilities defaults ', {mediaCapabilities});
    return mediaCapabilities;
  }
}

/**
 * checks whether and which DRMs are supported by the browser
 * @function _checkDRMSupported
 * @returns {Promise<DRMSupportedObject>} - The DRM supported object.
 * @private
 */
async function _checkDRMSupported(): Promise<DRMSupportedObject> {
  let drmSupportedRes: DRMSupportedObject = {
    isDRMSupported: 'maybe',
    supportedDRMs: []
  };

  if (!navigator.requestMediaKeySystemAccess) {
    return drmSupportedRes;
  }

  const keySysConfig = [
    {
      initDataTypes: ['cenc'],
      videoCapabilities: [
        {
          contentType: 'video/mp4;codecs="avc1.42E01E"'
        }
      ]
    }
  ];

  const keySystemsMap = new Map([
    ['widevine', 'com.widevine.alpha'],
    ['playready', 'com.microsoft.playready'],
    ['fairplay', 'com.apple.fps']
  ]);

  for (let [drm, keySys] of keySystemsMap) {
    await navigator
      .requestMediaKeySystemAccess(keySys, keySysConfig)
      .then(() => {
        drmSupportedRes.supportedDRMs.push(drm);
      })
      .catch(function (ex) {
        _logger.debug(keySys + ' not supported (' + ex.name + ': ' + ex.message + ').');
      });
  }

  drmSupportedRes.isDRMSupported = drmSupportedRes.supportedDRMs.length > 0;
  return drmSupportedRes;
}

/**
 * checks whether the browser supports HEVC codec or not
 * @function _checkHEVCSupported
 * @param {HEVCConfigObject} hevcConfig - The HEVC configuration.
 * @returns {Promise<HEVCSupportedObject>} - The HEVC supported object.
 * @private
 */
async function _checkHEVCSupported(hevcConfig?: HEVCConfigObject): Promise<HEVCSupportedObject> {
  let hevcSupportedRes: HEVCSupportedObject = {
    isHEVCSupported: 'maybe',
    isPowerEfficient: 'maybe'
  };

  if (!navigator.mediaCapabilities || !navigator.mediaCapabilities.decodingInfo) {
    return hevcSupportedRes;
  }

  const configHvc = {
    type: 'media-source',
    video: {
      contentType: 'video/mp4; codecs="hvc1.1.6.L150.90"',
      width: hevcConfig?.width || 1920,
      height: hevcConfig?.height || 1080,
      bitrate: hevcConfig?.bitrate || 1200000,
      framerate: hevcConfig?.framerate || 30
    }
  };

  await navigator.mediaCapabilities
    .decodingInfo(configHvc)
    .then(result => {
      hevcSupportedRes.isHEVCSupported = result.supported;
      hevcSupportedRes.isPowerEfficient = result.powerEfficient;
    })
    .catch(() => {
      hevcSupportedRes.isHEVCSupported = false;
      hevcSupportedRes.isPowerEfficient = false;
    });
  return hevcSupportedRes;
}

export default getMediaCapabilities;
