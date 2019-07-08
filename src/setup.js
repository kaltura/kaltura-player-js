// @flow
import {KalturaPlayer} from './kaltura-player';
import {getPlayerProxy} from './proxy';
import {evaluatePluginsConfig} from './common/plugins/plugins-config';
import {
  applyCastSupport,
  applyStorageSupport,
  attachToFirstClick,
  getDefaultOptions,
  printKalturaPlayerVersionToLog,
  printSetupMessages,
  setLogOptions,
  setStorageConfig,
  setStorageTextStyle,
  supportLegacyOptions,
  validateConfig
} from './common/utils/setup-helpers';

/**
 * Setup the Kaltura Player.
 * @param {PartialKPOptionsObject|LegacyPartialKPOptionsObject} options - partial kaltura player options
 * @private
 * @returns {KalturaPlayer} - The Kaltura Player.
 */
function setup(options: PartialKPOptionsObject | LegacyPartialKPOptionsObject): KalturaPlayer {
  printKalturaPlayerVersionToLog(options);
  options = supportLegacyOptions(options);
  validateConfig(options);
  const defaultOptions = getDefaultOptions(options);
  setLogOptions(defaultOptions);
  printSetupMessages();
  evaluatePluginsConfig(defaultOptions.plugins, defaultOptions);
  setStorageConfig(defaultOptions);
  const player = getPlayerProxy(defaultOptions);
  setStorageTextStyle(player);
  applyStorageSupport(player);
  applyCastSupport(defaultOptions, player);
  attachToFirstClick(player);
  return player;
}

export {setup};
