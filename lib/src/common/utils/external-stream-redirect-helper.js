'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getRedirectExternalStreamsHandler = void 0;
var playkit_js_1 = require('@playkit-js/playkit-js');
/**
 * JSONP handler function, returns the direct manifest uri.
 * @private
 * @param {Object} data - The json object that returns from the server.
 * @param {string} uri - Original request uri.
 * @returns {string} - The direct uri.
 */
function getDirectManifestUri(data, uri) {
  var getHostName = function (uri) {
    var parser = document.createElement('a');
    parser.href = uri;
    return parser.hostname;
  };
  // if the json contains one url, it means it is a redirect url. if it contains few urls, it means its the flavours
  // so we should use the original url.
  var uriHost = getHostName(uri);
  var hasOneFlavor = false;
  var redirectedUriHost = '';
  var redirectedUri = '';
  if (data) {
    if (data.flavors && Array.isArray(data.flavors)) {
      hasOneFlavor = data.flavors.length === 1;
      redirectedUriHost = hasOneFlavor && getHostName(data.flavors[0].url);
      redirectedUri = data.flavors[0].url;
    } else if (data.result) {
      hasOneFlavor = true;
      redirectedUriHost = getHostName(data.result.url);
      redirectedUri = data.result.url;
    }
  }
  if (hasOneFlavor && uriHost !== redirectedUriHost) {
    return redirectedUri;
  }
  return uri;
}
/**
 * Get the redirect external stream handler.
 * @public
 * @param {KPOptionsObject} playerOptions - The player config.
 * @param {KPOptionsObject} mediaOptions - The media config.
 * @returns {void}
 */
function getRedirectExternalStreamsHandler(playerOptions, mediaOptions) {
  if (mediaOptions === void 0) {
    mediaOptions = {};
  }
  var configObj = {};
  var playerRedirectExternalStreamsHandler = playkit_js_1.Utils.Object.getPropertyPath(playerOptions, 'sources.options.redirectExternalStreamsHandler');
  var mediaRedirectExternalStreamsHandler = playkit_js_1.Utils.Object.getPropertyPath(mediaOptions, 'sources.options.redirectExternalStreamsHandler');
  if (typeof playerRedirectExternalStreamsHandler !== 'function' && typeof mediaRedirectExternalStreamsHandler !== 'function') {
    playkit_js_1.Utils.Object.mergeDeep(configObj, {
      sources: {
        options: {
          redirectExternalStreamsHandler: getDirectManifestUri
        }
      }
    });
  }
  return configObj;
}
exports.getRedirectExternalStreamsHandler = getRedirectExternalStreamsHandler;
//# sourceMappingURL=external-stream-redirect-helper.js.map
