// @flow
import KalturaPlayer from './kaltura-player'
import {evaluatePluginsConfig} from './common/plugins/plugins-config'
import {
  validateConfig,
  setStorageConfig,
  applyStorageSupport,
  setStorageTextStyle,
  setLogLevel,
  getDefaultOptions
} from './common/utils/setup-helpers'

/**
 * @param {PartialKalturaPlayerOptionsObject} options - partial kaltura player options
 * @returns {KalturaPlayer} - kaltura player
 */
function setup(options: PartialKalturaPlayerOptionsObject): KalturaPlayer {
  validateConfig(options);
  const defaultOptions = getDefaultOptions(options);
  setLogLevel(defaultOptions);
  evaluatePluginsConfig(defaultOptions.player);
  setStorageConfig(defaultOptions);
  const kalturaPlayer = new KalturaPlayer(defaultOptions);
  setStorageTextStyle(kalturaPlayer);
  applyStorageSupport(kalturaPlayer);
  return kalturaPlayer;
}

export {setup};
