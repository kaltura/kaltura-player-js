'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getDefaultRedirectOptions = exports.setDefaultAnalyticsPlugin = void 0;
var playkit_js_1 = require('@playkit-js/playkit-js');
var external_stream_redirect_helper_1 = require('../common/utils/external-stream-redirect-helper');
/**
 * Sets the default analytics plugin for the ott player.
 * @param {KPOptionsObject} options - The player config.
 * @private
 * @returns {void}
 */
function setDefaultAnalyticsPlugin(options) {
  var kavaPlugin = playkit_js_1.Utils.Object.getPropertyPath(options, 'plugins.kava');
  if (!kavaPlugin) {
    playkit_js_1.Utils.Object.mergeDeep(options, {
      plugins: {
        kava: {
          disable: true
        }
      }
    });
  }
  var ottAnalyticsPlugin = playkit_js_1.Utils.Object.getPropertyPath(options, 'plugins.ottAnalytics');
  if (!ottAnalyticsPlugin) {
    playkit_js_1.Utils.Object.mergeDeep(options, {
      plugins: {
        ottAnalytics: {}
      }
    });
  }
}
exports.setDefaultAnalyticsPlugin = setDefaultAnalyticsPlugin;
/**
 * get the default config for forcing external stream redirect.
 * @public
 * @param {KPOptionsObject} playerOptions - The player config.
 * @param {KPOptionsObject} mediaOptions - The media config.
 * @returns {Object} - config object
 */
function getDefaultRedirectOptions(playerOptions, mediaOptions) {
  if (mediaOptions === void 0) {
    mediaOptions = {};
  }
  return playkit_js_1.Utils.Object.mergeDeep({}, (0, external_stream_redirect_helper_1.getRedirectExternalStreamsHandler)(playerOptions, mediaOptions));
}
exports.getDefaultRedirectOptions = getDefaultRedirectOptions;
//# sourceMappingURL=player-defaults.js.map
