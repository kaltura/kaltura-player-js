// @flow
import {loadPlayer} from 'playkit-js'
import KalturaPlayer from './kaltura-player'
import LocalStorageManager from './storage/storage-manager'
import {
  extractPlayerConfig,
  extractProvidersConfig,
  createKalturaPlayerContainer,
  validateTargetId, validateProvidersConfig
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
  let storageManager = new LocalStorageManager();
  if (!options.disableUserCache && storageManager.hasStorage()) {
    let storageConfig = storageManager.getStorage();
    Object.assign(playerConfig, storageConfig);
  }
  let providersConfig = extractProvidersConfig(options);
  let containerId = createKalturaPlayerContainer(targetId);
  let player = loadPlayer(containerId, playerConfig);
  let kalturaPlayerApi = new KalturaPlayer(player, containerId, providersConfig);
  let kalturaPlayer = Object.assign(player, kalturaPlayerApi);
  storageManager.attach(kalturaPlayer);
  return kalturaPlayer;
}

export {setup};
