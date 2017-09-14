// @flow
import {loadPlayer, Utils} from 'playkit-js'
import KalturaPlayer from './kaltura-player'
import StorageManager from './storage/storage-manager'
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
  let userPlayerConfig = extractPlayerConfig(options);
  let userProvidersConfig = extractProvidersConfig(options);
  let containerId = createKalturaPlayerContainer(targetId);
  checkNativeHlsSupport(userPlayerConfig);
  let player = loadPlayer(userPlayerConfig);
  let kalturaPlayerApi = new KalturaPlayer(player, containerId, userProvidersConfig);
  let kalturaPlayer = Object.assign(player, kalturaPlayerApi);
  if (StorageManager.isLocalStorageAvailable()) {
    let storageManager = new StorageManager();
    storageManager.attach(kalturaPlayer);
    if (!options.disableUserCache && storageManager.hasStorage()) {
      let storageConfig = storageManager.getStorage();
      let storageAndUserPlayerConfig = {};
      Utils.Object.mergeDeep(storageAndUserPlayerConfig, storageConfig, userPlayerConfig);
      kalturaPlayer.configure(storageAndUserPlayerConfig);
    }
  }
  return kalturaPlayer;
}

export {setup};
