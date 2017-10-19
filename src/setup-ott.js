// @flow
import {loadPlayer} from 'playkit-js'
import KalturaPlayer from './kaltura-player-ott'
import {evaluatePluginsConfig} from './plugins/plugins-config'
import {
  extractPlayerConfig,
  extractProvidersConfig,
  createKalturaPlayerContainer,
  validateTargetId,
  validateProvidersConfig,
  setDefaultPlayerConfig,
  setStorageConfig,
  applyStorageSupport
} from "./utils/setup-helpers"

/**
 * @param {string} targetId - target id
 * @param {Object} options - options
 * @returns {Player} - Player
 */
function setup(targetId: string, options: Object): KalturaPlayer {
  validateTargetId(targetId);
  validateProvidersConfig(options);
  let userPlayerConfig = extractPlayerConfig(options);
  let userProvidersConfig = extractProvidersConfig(options);
  let containerId = createKalturaPlayerContainer(targetId);
  setDefaultPlayerConfig(userPlayerConfig);
  evaluatePluginsConfig(userPlayerConfig);
  setStorageConfig(options.disableUserCache, userPlayerConfig);
  let player = loadPlayer(userPlayerConfig);
  let kalturaPlayerApi = new KalturaPlayer(player, containerId, userProvidersConfig);
  let kalturaPlayer = Object.assign(player, kalturaPlayerApi);
  applyStorageSupport(kalturaPlayer);
  return kalturaPlayer;
}

export {setup};
