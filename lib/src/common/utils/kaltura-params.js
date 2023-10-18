'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.addUIConfId = exports.addClientTag = exports.addReferrer = exports.getReferrer = exports.updateSessionIdInUrl = exports.handleSessionId = exports.addKalturaParams = void 0;
var playkit_js_1 = require('@playkit-js/playkit-js');
var setup_helpers_1 = require('./setup-helpers');
var PLAY_MANIFEST = 'playmanifest/';
var PLAY_SESSION_ID = 'playSessionId=';
var DRM_SESSION_ID = 'sessionId=';
var REFERRER = 'referrer=';
var UICONF_ID = 'uiConfId=';
var CLIENT_TAG = 'clientTag=html5:v';
var UDRM_DOMAIN = 'kaltura.com';
var CUSTOM_DATA = 'custom_data=';
var SIGNATURE = 'signature=';
/**
 * @param {Player} player - player
 * @param {PartialKPOptionsObject} playerConfig - player config
 * @return {void}
 * @private
 */
function handleSessionId(player, playerConfig) {
  // @ts-ignore
  if (player.config.session && player.config.session.id) {
    // on change media
    updateSessionId(player, playerConfig);
  } else {
    // on first playback
    addSessionId(playerConfig);
  }
}
exports.handleSessionId = handleSessionId;
/**
 * @param {PartialKPOptionsObject} playerConfig - player config
 * @return {void}
 * @private
 */
function addSessionId(playerConfig) {
  var primaryGUID = playkit_js_1.Utils.Generator.guid();
  var secondGUID = playkit_js_1.Utils.Generator.guid();
  setSessionId(playerConfig, primaryGUID + ':' + secondGUID);
}
/**
 * @param {Player} player - player
 * @param {PartialKPOptionsObject} playerConfig - player config
 * @return {void}
 * @private
 */
function updateSessionId(player, playerConfig) {
  var secondGuidInSessionIdRegex = /:((?:[a-z0-9]|-)*)/i;
  // @ts-ignore
  var secondGuidInSessionId = secondGuidInSessionIdRegex.exec(player.config.session.id);
  if (secondGuidInSessionId && secondGuidInSessionId[1]) {
    // @ts-ignore
    setSessionId(playerConfig, player.config.session.id.replace(secondGuidInSessionId[1], playkit_js_1.Utils.Generator.guid()));
  }
}
/**
 * @param {PartialKPOptionsObject} playerConfig - player config
 * @param {string} sessionId - the session id
 * @return {void}
 * @private
 */
function setSessionId(playerConfig, sessionId) {
  playerConfig.session = playerConfig.session || {};
  playerConfig.session.id = sessionId;
}
/**
 * @param {string} url - url
 * @param {string} sessionId - session id
 * @param {string} paramName - optional param name of the session id
 * @return {string} - the url with the new sessionId
 * @private
 */
function updateSessionIdInUrl(url, sessionId, paramName) {
  if (paramName === void 0) {
    paramName = PLAY_SESSION_ID;
  }
  if (sessionId) {
    var sessionIdInUrlRegex = new RegExp(paramName + '((?:[a-z0-9]|-)*:(?:[a-z0-9]|-)*)', 'i');
    var sessionIdInUrl = sessionIdInUrlRegex.exec(url);
    if (sessionIdInUrl && sessionIdInUrl[1]) {
      // this url has session id (has already been played)
      url = url.replace(sessionIdInUrl[1], sessionId);
    } else {
      url += getQueryStringParamDelimiter(url) + paramName + sessionId;
    }
  }
  return url;
}
exports.updateSessionIdInUrl = updateSessionIdInUrl;
/**
 * @return {string} - The referrer
 * @private
 */
function getReferrer() {
  var referrer;
  try {
    referrer = window.parent.document.URL;
  } catch (e) {
    // unfriendly iframe
    referrer = document.referrer;
  }
  return referrer;
}
exports.getReferrer = getReferrer;
/**
 * @param {string} url - url
 * @return {string} - the url with the referrer appended in the query params
 * @private
 */
function addReferrer(url) {
  if (url.indexOf(REFERRER) === -1) {
    var referrer = btoa(getReferrer().substr(0, 1000));
    url += getQueryStringParamDelimiter(url) + REFERRER + referrer;
  }
  return url;
}
exports.addReferrer = addReferrer;
/**
 * @param {string} url - url
 * @param {PartialKPOptionsObject} playerConfig - player config
 * @return {string} - the url with the uiconf id appended in the query params
 * @private
 */
function addUIConfId(url, playerConfig) {
  var uiConfId = playkit_js_1.Utils.Object.getPropertyPath(playerConfig, 'provider.uiConfId');
  if (url.indexOf(UICONF_ID) === -1 && typeof uiConfId === 'number') {
    url += getQueryStringParamDelimiter(url) + UICONF_ID + uiConfId;
  }
  return url;
}
exports.addUIConfId = addUIConfId;
/**
 * @param {string} url - url
 * @return {string} - returns the next param delimiter (? or &) according to the current url structure
 * @private
 */
function getQueryStringParamDelimiter(url) {
  return url.indexOf('?') === -1 ? '?' : '&';
}
/**
 * @param {string} url - url
 * @param {string} productVersion - product version
 * @return {string} - the url with the client tag appended in the query params
 * @private
 */
function addClientTag(url, productVersion) {
  if (url.indexOf(CLIENT_TAG) === -1) {
    url += getQueryStringParamDelimiter(url) + CLIENT_TAG + (productVersion || __VERSION__);
  }
  return url;
}
exports.addClientTag = addClientTag;
/**
 * Adding Kaltura specific params to player config and player sources.
 * @param {Player} player - player
 * @param {PartialKPOptionsObject} playerConfig - player config
 * @return {void}
 * @private
 */
function addKalturaParams(player, playerConfig) {
  var _a;
  handleSessionId(player, playerConfig);
  var sources = playerConfig.sources;
  var sessionId = playerConfig.session && playerConfig.session.id;
  var productVersion = (_a = (0, setup_helpers_1.getServerUIConf)()) === null || _a === void 0 ? void 0 : _a.productVersion;
  Object.values(playkit_js_1.StreamType).forEach(function (key) {
    // $FlowFixMe
    if (sources[key]) {
      sources[key].forEach(function (source) {
        // @ts-ignore
        if (typeof source.url === 'string' && source.url.toLowerCase().indexOf(PLAY_MANIFEST) > -1 && !source.localSource) {
          source.url = updateSessionIdInUrl(source.url, sessionId);
          source.url = addReferrer(source.url);
          source.url = addClientTag(source.url, productVersion);
        }
        if (source.drmData && source.drmData.length) {
          source.drmData.forEach(function (drmData) {
            if (
              typeof drmData.licenseUrl === 'string' &&
              [UDRM_DOMAIN, CUSTOM_DATA, SIGNATURE].every(function (t) {
                return drmData.licenseUrl.includes(t);
              })
            ) {
              drmData.licenseUrl = updateSessionIdInUrl(drmData.licenseUrl, sessionId, DRM_SESSION_ID);
              drmData.licenseUrl = addClientTag(drmData.licenseUrl, productVersion);
              drmData.licenseUrl = addReferrer(drmData.licenseUrl);
              drmData.licenseUrl = addUIConfId(drmData.licenseUrl, playerConfig);
            }
          });
        }
      });
    }
  });
}
exports.addKalturaParams = addKalturaParams;
//# sourceMappingURL=kaltura-params.js.map
