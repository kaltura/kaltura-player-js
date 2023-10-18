'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.setup = void 0;
var proxy_1 = require('./proxy');
var setup_helpers_1 = require('./common/utils/setup-helpers');
/**
 * Setup the Kaltura Player.
 * @param {PartialKPOptionsObject|LegacyPartialKPOptionsObject} options - partial kaltura player options
 * @private
 * @returns {KalturaPlayer} - The Kaltura Player.
 */
function setup(options) {
  (0, setup_helpers_1.printKalturaPlayerVersionToLog)(options);
  options = (0, setup_helpers_1.supportLegacyOptions)(options);
  (0, setup_helpers_1.validateConfig)(options);
  var defaultOptions = (0, setup_helpers_1.getDefaultOptions)(options);
  (0, setup_helpers_1.validateProviderConfig)(defaultOptions);
  (0, setup_helpers_1.setLogOptions)(defaultOptions);
  (0, setup_helpers_1.maybeApplyStartTimeQueryParam)(defaultOptions);
  (0, setup_helpers_1.printSetupMessages)();
  (0, setup_helpers_1.setStorageConfig)(defaultOptions);
  var player = (0, proxy_1.getPlayerProxy)(defaultOptions);
  (0, setup_helpers_1.setStorageTextStyle)(player);
  (0, setup_helpers_1.applyStorageSupport)(player);
  (0, setup_helpers_1.applyCastSupport)(defaultOptions, player);
  (0, setup_helpers_1.attachToFirstClick)(player);
  return player;
}
exports.setup = setup;
//# sourceMappingURL=setup.js.map
