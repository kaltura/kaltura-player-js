'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (((f = 1), y && (t = op[0] & 2 ? y['return'] : op[0] ? y['throw'] || ((t = y['return']) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)) return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __values =
  (this && this.__values) ||
  function (o) {
    var s = typeof Symbol === 'function' && Symbol.iterator,
      m = s && o[s],
      i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === 'number')
      return {
        next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
        }
      };
    throw new TypeError(s ? 'Object is not iterable.' : 'Symbol.iterator is not defined.');
  };
var __read =
  (this && this.__read) ||
  function (o, n) {
    var m = typeof Symbol === 'function' && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o),
      r,
      ar = [],
      e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error: error };
    } finally {
      try {
        if (r && !r.done && (m = i['return'])) m.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  };
Object.defineProperty(exports, '__esModule', { value: true });
var playkit_js_1 = require('@playkit-js/playkit-js');
var CONTENT_TYPE_AVC_CODEC = 'video/mp4;codecs="avc1.42E01E"';
var DRM_SCHEME_LIST = [
  ['widevine', 'com.widevine.alpha'],
  ['playready', 'com.microsoft.playready'],
  ['fairplay', 'com.apple.fps']
];
var CONTENT_TYPE_HVC_CODEC = 'video/mp4; codecs="hvc1.1.6.L150.90"';
var WIDTH_DEFAULT = 1920;
var HEIGHT_DEFAULT = 1080;
var BITRATE_DEFAULT = 1200000;
var FRAMERATE_DEFAULT = 30;
var _logger = (0, playkit_js_1.getLogger)('MediaCapabilities');
/**
 * enum for supported options
 * @const
 * @type {Object}
 */
var SupportedOptions = {
  SUPPORTED: 1,
  NOT_SUPPORTED: 0,
  MAYBE_SUPPORTED: -1
};
/**
 * get the media capabilities
 * @function getMediaCapabilities
 * @param {HEVCConfigObject} hevcConfig - The HEVC configuration to check (optional).
 * @returns {Promise<MediaCapabilitiesObject>} - The media capabilities object.
 * @public
 */
function getMediaCapabilities(hevcConfig) {
  return __awaiter(this, void 0, void 0, function () {
    var mediaCapabilities, hevcSupported, drmSupported, ex_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 3, , 4]);
          _logger.debug('Starting to get media capabilities...');
          return [4 /*yield*/, _checkHEVCSupported(hevcConfig)];
        case 1:
          hevcSupported = _a.sent();
          return [4 /*yield*/, _checkDRMSupported()];
        case 2:
          drmSupported = _a.sent();
          mediaCapabilities = Object.assign({}, hevcSupported, drmSupported);
          _logger.debug('Finished getting media capabilities ', {
            mediaCapabilities: mediaCapabilities
          });
          return [2 /*return*/, mediaCapabilities];
        case 3:
          ex_1 = _a.sent();
          _logger.debug('There was a problem with getting the media capabilities, ', ex_1.message);
          mediaCapabilities = {
            isHEVCSupported: SupportedOptions.NOT_SUPPORTED,
            isPowerEfficient: SupportedOptions.NOT_SUPPORTED,
            isDRMSupported: SupportedOptions.NOT_SUPPORTED,
            supportedDRMs: []
          };
          _logger.debug('Returning media capabilities defaults ', {
            mediaCapabilities: mediaCapabilities
          });
          return [2 /*return*/, mediaCapabilities];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
/**
 * checks whether and which DRMs are supported by the browser
 * @function _checkDRMSupported
 * @returns {Promise<DRMSupportedObject>} - The DRM supported object.
 * @private
 */
function _checkDRMSupported() {
  return __awaiter(this, void 0, void 0, function () {
    var drmSupportedRes, keySysConfig, keySystemsMap, keySystemsMap_1, keySystemsMap_1_1, _a, drm, keySys, ex_2, e_1_1;
    var e_1, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          drmSupportedRes = {
            isDRMSupported: SupportedOptions.MAYBE_SUPPORTED,
            supportedDRMs: []
          };
          if (!navigator.requestMediaKeySystemAccess) {
            return [2 /*return*/, drmSupportedRes];
          }
          keySysConfig = [
            {
              initDataTypes: ['cenc'],
              videoCapabilities: [
                {
                  contentType: CONTENT_TYPE_AVC_CODEC
                }
              ]
            }
          ];
          keySystemsMap = new Map(DRM_SCHEME_LIST);
          _c.label = 1;
        case 1:
          _c.trys.push([1, 8, 9, 10]);
          (keySystemsMap_1 = __values(keySystemsMap)), (keySystemsMap_1_1 = keySystemsMap_1.next());
          _c.label = 2;
        case 2:
          if (!!keySystemsMap_1_1.done) return [3 /*break*/, 7];
          (_a = __read(keySystemsMap_1_1.value, 2)), (drm = _a[0]), (keySys = _a[1]);
          _c.label = 3;
        case 3:
          _c.trys.push([3, 5, , 6]);
          return [4 /*yield*/, navigator.requestMediaKeySystemAccess(keySys, keySysConfig)];
        case 4:
          _c.sent();
          drmSupportedRes.supportedDRMs.push(drm);
          return [3 /*break*/, 6];
        case 5:
          ex_2 = _c.sent();
          _logger.debug(keySys + ' not supported (' + ex_2.name + ': ' + ex_2.message + ').');
          return [3 /*break*/, 6];
        case 6:
          keySystemsMap_1_1 = keySystemsMap_1.next();
          return [3 /*break*/, 2];
        case 7:
          return [3 /*break*/, 10];
        case 8:
          e_1_1 = _c.sent();
          e_1 = { error: e_1_1 };
          return [3 /*break*/, 10];
        case 9:
          try {
            if (keySystemsMap_1_1 && !keySystemsMap_1_1.done && (_b = keySystemsMap_1.return)) _b.call(keySystemsMap_1);
          } finally {
            if (e_1) throw e_1.error;
          }
          return [7 /*endfinally*/];
        case 10:
          drmSupportedRes.isDRMSupported = drmSupportedRes.supportedDRMs.length > 0 ? SupportedOptions.SUPPORTED : SupportedOptions.NOT_SUPPORTED;
          return [2 /*return*/, drmSupportedRes];
      }
    });
  });
}
/**
 * checks whether the browser supports HEVC codec or not
 * @function _checkHEVCSupported
 * @param {HEVCConfigObject} hevcConfig - The HEVC configuration.
 * @returns {Promise<HEVCSupportedObject>} - The HEVC supported object.
 * @private
 */
function _checkHEVCSupported(hevcConfig) {
  return __awaiter(this, void 0, void 0, function () {
    var hevcSupportedRes, configHvc, mediaCapRes, ex_3;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          hevcSupportedRes = {
            isHEVCSupported: SupportedOptions.MAYBE_SUPPORTED,
            isPowerEfficient: SupportedOptions.MAYBE_SUPPORTED
          };
          if (!navigator.mediaCapabilities || !navigator.mediaCapabilities.decodingInfo) {
            return [2 /*return*/, hevcSupportedRes];
          }
          configHvc = {
            type: 'media-source',
            video: {
              contentType: CONTENT_TYPE_HVC_CODEC,
              width: (hevcConfig === null || hevcConfig === void 0 ? void 0 : hevcConfig.width) || WIDTH_DEFAULT,
              height: (hevcConfig === null || hevcConfig === void 0 ? void 0 : hevcConfig.height) || HEIGHT_DEFAULT,
              bitrate: (hevcConfig === null || hevcConfig === void 0 ? void 0 : hevcConfig.bitrate) || BITRATE_DEFAULT,
              framerate: (hevcConfig === null || hevcConfig === void 0 ? void 0 : hevcConfig.framerate) || FRAMERATE_DEFAULT
            }
          };
          _a.label = 1;
        case 1:
          _a.trys.push([1, 3, , 4]);
          return [4 /*yield*/, navigator.mediaCapabilities.decodingInfo(configHvc)];
        case 2:
          mediaCapRes = _a.sent();
          hevcSupportedRes.isHEVCSupported = mediaCapRes.supported ? SupportedOptions.SUPPORTED : SupportedOptions.NOT_SUPPORTED;
          hevcSupportedRes.isPowerEfficient = mediaCapRes.powerEfficient ? SupportedOptions.SUPPORTED : SupportedOptions.NOT_SUPPORTED;
          return [3 /*break*/, 4];
        case 3:
          ex_3 = _a.sent();
          _logger.debug('Failed to get the media capabilities from navigator. (' + ex_3.name + ': ' + ex_3.message + ').');
          hevcSupportedRes.isHEVCSupported = SupportedOptions.MAYBE_SUPPORTED;
          hevcSupportedRes.isPowerEfficient = SupportedOptions.MAYBE_SUPPORTED;
          return [3 /*break*/, 4];
        case 4:
          return [2 /*return*/, hevcSupportedRes];
      }
    });
  });
}
exports.default = getMediaCapabilities;
//# sourceMappingURL=media-capabilities.js.map
