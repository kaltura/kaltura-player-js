'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getDefaultRedirectOptions = exports.setDefaultAnalyticsPlugin = void 0;
var playkit_js_1 = require('@playkit-js/playkit-js');
var external_stream_redirect_helper_1 = require('../common/utils/external-stream-redirect-helper');
/**
 * Sets the default analytics plugin for the ovp player.
 * @param {KalturaPlayerConfig} options - The player config.
 * @private
 * @returns {void}
 */
function setDefaultAnalyticsPlugin(options) {
  var kavaPlugin = playkit_js_1.Utils.Object.getPropertyPath(options, 'plugins.kava');
  if (!kavaPlugin) {
    kavaPlugin = playkit_js_1.Utils.Object.mergeDeep(options, {
      plugins: {
        kava: {}
      }
    });
  }
}
exports.setDefaultAnalyticsPlugin = setDefaultAnalyticsPlugin;
/**
 * get the default config for forcing external stream redirect.
 * @public
 * @param {KalturaPlayerConfig} playerOptions - The player config.
 * @param {KalturaPlayerConfig} mediaOptions - The media config.
 * @returns {Object} - config object
 */
function getDefaultRedirectOptions(playerOptions, mediaOptions) {
  var _a;
  var configObj = {};
  if (
    ((_a = mediaOptions === null || mediaOptions === void 0 ? void 0 : mediaOptions.sources) === null || _a === void 0 ? void 0 : _a.type) === playkit_js_1.MediaType.LIVE &&
    (playkit_js_1.Env.browser.name === 'IE' || playkit_js_1.Env.device.model === 'Chromecast')
  ) {
    var playerForceRedirectExternalStreams = playkit_js_1.Utils.Object.getPropertyPath(playerOptions, 'sources.options.forceRedirectExternalStreams');
    var mediaForceRedirectExternalStreams = playkit_js_1.Utils.Object.getPropertyPath(mediaOptions, 'sources.options.forceRedirectExternalStreams');
    if (typeof playerForceRedirectExternalStreams !== 'boolean' && typeof mediaForceRedirectExternalStreams !== 'boolean') {
      playkit_js_1.Utils.Object.mergeDeep(configObj, {
        sources: {
          options: {
            forceRedirectExternalStreams: true
          }
        }
      });
    }
  }
  return playkit_js_1.Utils.Object.mergeDeep(configObj, (0, external_stream_redirect_helper_1.getRedirectExternalStreamsHandler)(playerOptions, mediaOptions));
}
exports.getDefaultRedirectOptions = getDefaultRedirectOptions;
//# sourceMappingURL=player-defaults.js.map
