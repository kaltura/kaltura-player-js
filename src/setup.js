// @flow
import KalturaPlayer from './kaltura-player';
import {evaluatePluginsConfig} from './common/plugins/plugins-config';
import {
  applyStorageSupport,
  getDefaultOptions,
  printSetupMessages,
  setLogLevel,
  setStorageConfig,
  setStorageTextStyle,
  supportLegacyOptions,
  validateConfig,
  attachToFirstClick
} from './common/utils/setup-helpers';

/**
 * Setup the Kaltura Player.
 * @param {PartialKalturaPlayerOptionsObject|LegacyPartialKalturaPlayerOptionsObject} options - partial kaltura player options
 * @returns {KalturaPlayer} - The Kaltura Player.
 */
function setup(options: PartialKalturaPlayerOptionsObject | LegacyPartialKalturaPlayerOptionsObject): KalturaPlayer {
  options = supportLegacyOptions(options);
  validateConfig(options);
  const defaultOptions = getDefaultOptions(options);
  setLogLevel(defaultOptions);
  printSetupMessages();
  evaluatePluginsConfig(defaultOptions);
  setStorageConfig(defaultOptions);
  const kalturaPlayer = new KalturaPlayer(defaultOptions);
  setStorageTextStyle(kalturaPlayer);
  applyStorageSupport(kalturaPlayer);
  attachToFirstClick(kalturaPlayer);
  return kalturaPlayer;
}

export {setup};
