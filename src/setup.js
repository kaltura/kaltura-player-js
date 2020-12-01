// @flow
import {KalturaPlayer} from './kaltura-player';
import {getPlayerProxy} from './proxy';
import {PluginsConfigure} from './common/plugins';
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
  const pluginsConfigure = new PluginsConfigure();
  pluginsConfigure.evaluatePluginsConfig(defaultOptions.plugins, defaultOptions);
  setStorageConfig(defaultOptions);
  const player = getPlayerProxy(defaultOptions, pluginsConfigure);
  setStorageTextStyle(player);
  applyStorageSupport(player);
  applyCastSupport(defaultOptions, player);
  attachToFirstClick(player);
  return player;
}

export {setup};
