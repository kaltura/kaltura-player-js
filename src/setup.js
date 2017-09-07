// @flow
import {Env, loadPlayer} from 'playkit-js'
import KalturaPlayer from './kaltura-player'
import {
  extractPlayerConfig,
  extractProvidersConfig,
  createKalturaPlayerContainer,
  validateTargetId,
  validateProvidersConfig,
  checkNativeHlsSupport
} from "./utils/setup-helpers"

/**
 * @param {string} targetId - target id
 * @param {Object} options - options
 * @returns {Player} - Player
 */
function setup(targetId: string, options: Object): KalturaPlayer {
  validateTargetId(targetId);
  validateProvidersConfig(options);
  let playerConfig = extractPlayerConfig(options);
  let providersConfig = extractProvidersConfig(options);
  let containerId = createKalturaPlayerContainer(targetId);
  playerConfig = checkNativeHlsSupport(playerConfig, Env);
  let player = loadPlayer(containerId, playerConfig);
  let kalturaPlayer = new KalturaPlayer(player, containerId, providersConfig);
  return Object.assign(player, kalturaPlayer);
}

export {setup};
