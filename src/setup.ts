import { KalturaPlayer } from './kaltura-player';
import { getPlayerProxy } from './proxy';
import {
  applyCastSupport,
  applyStorageSupport,
  attachToFirstClick,
  getDefaultOptions,
  maybeApplyStartTimeQueryParam,
  maybeApplyClipQueryParams,
  printKalturaPlayerVersionToLog,
  printSetupMessages,
  initializeStorageManagers,
  setLogOptions,
  setStorageConfig,
  setStorageTextStyle,
  supportLegacyOptions,
  validateConfig,
  validateProviderConfig
} from './common/utils/setup-helpers';
import { PartialKPOptionsObject } from './types/kaltura-player-options';

/**
 * Setup the Kaltura Player.
 * @param {PartialKPOptionsObject|LegacyPartialKPOptionsObject} options - partial kaltura player options
 * @private
 * @returns {KalturaPlayer} - The Kaltura Player.
 */
function setup(options: PartialKPOptionsObject): KalturaPlayer {
  printKalturaPlayerVersionToLog(options);
  options = supportLegacyOptions(options);
  validateConfig(options);
  const defaultOptions = getDefaultOptions(options);
  validateProviderConfig(defaultOptions);
  setLogOptions(defaultOptions);
  maybeApplyStartTimeQueryParam(defaultOptions);
  maybeApplyClipQueryParams(defaultOptions);
  printSetupMessages();
  initializeStorageManagers();
  setStorageConfig(defaultOptions);
  const player = getPlayerProxy(defaultOptions);
  setStorageTextStyle(player);
  applyStorageSupport(player);
  applyCastSupport(defaultOptions, player);
  attachToFirstClick(player);
  return player;
}

export { setup };
