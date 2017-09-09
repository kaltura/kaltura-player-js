// @flow
import {loadPlayer, Utils} from 'playkit-js'
import KalturaPlayer from './kaltura-player'
import StorageManager from './storage/storage-manager'
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
  let storageManager = new StorageManager();
  if (!options.disableUserCache && storageManager.hasStorage()) {
    let storageConfig = storageManager.getStorage();
    playerConfig = Utils.Object.mergeDeep({}, storageConfig, playerConfig);
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
