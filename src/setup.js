// @flow
import KalturaPlayer from './kaltura-player'
import {evaluatePluginsConfig} from './common/plugins/plugins-config'
import {
  applyCastSupport,
  applyStorageSupport,
  getDefaultOptions,
  printSetupMessages,
  setLogLevel,
  setStorageConfig,
  setStorageTextStyle,
  supportLegacyOptions,
  validateConfig
} from './common/utils/setup-helpers'

/**
 * Setup the Kaltura Player.
 * @param {PartialKPOptionsObject|LegacyPartialKPOptionsObject} options - partial kaltura player options
 * @returns {KalturaPlayer} - The Kaltura Player.
 */
function setup(options: PartialKPOptionsObject | LegacyPartialKPOptionsObject): KalturaPlayer {
  options = supportLegacyOptions(options);
  validateConfig(options);
  const defaultOptions = getDefaultOptions(options);
  setLogLevel(defaultOptions);
  printSetupMessages();
  evaluatePluginsConfig(defaultOptions);
  setStorageConfig(defaultOptions);
  const player = new KalturaPlayer(defaultOptions);
  setStorageTextStyle(player);
  applyStorageSupport(player);
  applyCastSupport(defaultOptions, player);
  return player;
}

export {setup};
