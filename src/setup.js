// @flow
import {loadPlayer} from 'playkit-js'
import KalturaPlayer from './kaltura-player'
import {evaluatePluginsConfig} from './plugins/plugins-config'
import {
  extractPlayerConfig,
  extractProvidersConfig,
  createKalturaPlayerContainer,
  validateTargetId,
  validateProvidersConfig,
  setDefaultPlayerConfig,
  setStorageConfig,
  applyStorageSupport,
  setStorageTextStyle,
  setLogLevel
} from "./utils/setup-helpers"

/**
 * @param {string} targetId - target id
 * @param {Object} options - options
 * @returns {Player} - Player
 */
function setup(targetId: string, options: Object = {}): KalturaPlayer {
  setLogLevel(options);
  validateTargetId(targetId);
  validateProvidersConfig(options);
  const playerConfig = extractPlayerConfig(options);
  const providersConfig = extractProvidersConfig(options);
  const containerId = createKalturaPlayerContainer(targetId);
  setDefaultPlayerConfig(playerConfig);
  evaluatePluginsConfig(playerConfig);
  setStorageConfig(playerConfig);
  const player = loadPlayer(playerConfig);
  const kalturaPlayerApi = new KalturaPlayer(player, containerId, playerConfig, providersConfig);
  const kalturaPlayer = Object.assign(player, kalturaPlayerApi);
  setStorageTextStyle(kalturaPlayer);
  applyStorageSupport(kalturaPlayer);
  return kalturaPlayer;
}

export {setup};
