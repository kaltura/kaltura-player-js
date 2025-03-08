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
  validateProviderConfig, maybeLoadInitialServerResponse
} from './common/utils/setup-helpers';
import { PartialKPOptionsObject } from './types';

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
  //add function that gets server version based on service admin action version

  maybeApplyStartTimeQueryParam(defaultOptions);
  maybeApplyClipQueryParams(defaultOptions);
  printSetupMessages();
  initializeStorageManagers();
  setStorageConfig(defaultOptions);
  const player = getPlayerProxy(defaultOptions);
  maybeLoadInitialServerResponse(player);
  setStorageTextStyle(player);
  applyStorageSupport(player);
  applyCastSupport(defaultOptions, player);
  attachToFirstClick(player);
  return player;
}

export { setup };
