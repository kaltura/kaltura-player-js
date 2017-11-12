// @flow
import {loadPlayer} from 'playkit-js'
import KalturaPlayer from './kaltura-player'
import {setLogLevel, LogLevel} from './utils/logger'
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
  isDebugMode
} from "./utils/setup-helpers"

/**
 * @param {string} targetId - target id
 * @param {Object} options - options
 * @returns {Player} - Player
 */
function setup(targetId: string, options: Object): KalturaPlayer {
  if (isDebugMode()){
    setLogLevel(LogLevel.DEBUG)
  } else {
    if (options.logLevel && LogLevel[options.logLevel]){
      setLogLevel(LogLevel[options.logLevel]);
    }
  }
  validateTargetId(targetId);
  validateProvidersConfig(options);
  let userPlayerConfig = extractPlayerConfig(options);
  let userProvidersConfig = extractProvidersConfig(options);
  let containerId = createKalturaPlayerContainer(targetId);
  setDefaultPlayerConfig(userPlayerConfig);
  evaluatePluginsConfig(userPlayerConfig);
  setStorageConfig(userPlayerConfig);
  let player = loadPlayer(userPlayerConfig);
  let kalturaPlayerApi = new KalturaPlayer(player, containerId, userPlayerConfig, userProvidersConfig);
  let kalturaPlayer = Object.assign(player, kalturaPlayerApi);
  setStorageTextStyle(kalturaPlayer);
  applyStorageSupport(kalturaPlayer);
  return kalturaPlayer;
}

export {setup};
