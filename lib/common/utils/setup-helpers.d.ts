import { KalturaPlayer } from '../../kaltura-player';
import { KalturaPlayerConfig, LegacyPartialKPOptionsObject, PartialKPOptionsObject } from '../../types/kaltura-player-options';
import { PluginsConfig } from '../../types/plugins-config';
import { SourcesConfig } from '../../types/sources-config';
import { PlaybackConfig } from '../../types/playback-config';
declare const KALTURA_PLAYER_START_TIME_QS: string;
/**
 * Validate the initial user config.
 * @private
 * @param {PartialKPOptionsObject} options - partial kaltura player options.
 * @returns {void}
 */
declare function validateConfig(options: PartialKPOptionsObject): void;
/**
 * Validate the initial user input for the provider options.
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
declare function validateProviderConfig(options: KalturaPlayerConfig): void;
/**
 * Creates the player container dom element.
 * @private
 * @param {string} targetId - The div id which the player will append to.
 * @returns {string} - The player container id.
 */
declare function createKalturaPlayerContainer(targetId: string): string;
/**
 * Sets the storage config on the player config if certain conditions are met.
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
declare function setStorageConfig(options: KalturaPlayerConfig): void;
/**
 * Applies cache support if it's supported by the environment.
 * @private
 * @param {KalturaPlayer} player - The Kaltura player.
 * @returns {void}
 */
declare function applyStorageSupport(player: KalturaPlayer): void;
/**
 * Loads the registered remote players.
 * @private
 * @param {KalturaPlayerConfig} defaultOptions - The kaltura player options.
 * @param {KalturaPlayer} player - The Kaltura player.
 * @returns {void}
 */
declare function applyCastSupport(defaultOptions: KalturaPlayerConfig, player: KalturaPlayer): void;
/**
 * Sets the player text style from storage.
 * @private
 * @param {KalturaPlayer} player - The Kaltura player.
 * @returns {void}
 */
declare function setStorageTextStyle(player: KalturaPlayer): void;
/**
 * Call to setCapabilities on the first UI_CLICKED event
 * @private
 * @param {Player} player - The Kaltura player.
 * @returns {void}
 */
declare function attachToFirstClick(player: KalturaPlayer): void;
/**
 * get the parameter for start time
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
declare function maybeApplyStartTimeQueryParam(options: KalturaPlayerConfig): void;
/**
 * set the logger
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
declare function setLogOptions(options: KalturaPlayerConfig): void;
/**
 * get the server UIConf
 * @private
 * @returns {Object} - The server UIConf
 */
declare function getServerUIConf(): any;
/**
 * Gets the default options after merging the user options with the uiConf options and the default internal options.
 * @private
 * @param {PartialKPOptionsObject} options - partial user kaltura player options.
 * @returns {KalturaPlayerConfig} - default kaltura player options.
 */
declare function getDefaultOptions(options: PartialKPOptionsObject): KalturaPlayerConfig;
/**
 * Sets config option for native HLS playback
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
declare function checkNativeHlsSupport(options: KalturaPlayerConfig): void;
/**
 * print kaltura version to log by configuration
 * @private
 * @param {KalturaPlayerConfig} options - kaltura player options
 * @returns {void}
 */
declare function printKalturaPlayerVersionToLog(options: PartialKPOptionsObject | LegacyPartialKPOptionsObject): void;
/**
 * Transform options structure from legacy structure to new structure.
 * @private
 * @param {Object} options - The options with the legacy structure.
 * @return {PartialKPOptionsObject} - Partial options with the expected structure.
 */
declare function supportLegacyOptions(options: LegacyPartialKPOptionsObject): PartialKPOptionsObject;
/**
 * Prints early setup messages.
 * @private
 * @returns {void}
 */
declare function printSetupMessages(): void;
/**
 * set stream priority according to playerConfig
 * @param {Player} player - player
 * @param {PKSourcesConfigObject} sources - sources
 * @return {void}
 */
declare function maybeSetStreamPriority(player: KalturaPlayer, sources: SourcesConfig): PlaybackConfig | null;
/**
 * returns true if sources contain youtube video source
 * @param {PKSourcesConfigObject} sources - thr sources object
 * @returns {boolean} - true if sources contain youtube source
 */
declare function hasYoutubeSource(sources: SourcesConfig): boolean;
/**
 * returns true if sources contain image source
 * @param {PKSourcesConfigObject} sources - thr sources object
 * @returns {boolean} - true if sources contain image source
 */
declare function hasImageSource(sources: SourcesConfig): boolean;
/**
 * Merge the provider plugins config (e.g. bumper) into the app config and returns it and the respective app config to restore in change media
 * @param {PluginsConfig} providerPluginsConfig - the provider plugins config
 * @param {KalturaPlayerConfig} appPluginsConfig - the entire app plugins config
 * @returns {Array<PluginsConfig>} - the merged plugins config and the partial respective app plugins config
 */
declare function mergeProviderPluginsConfig(providerPluginsConfig: PluginsConfig, appPluginsConfig: PluginsConfig): Array<PluginsConfig>;
export {
  printSetupMessages,
  supportLegacyOptions,
  printKalturaPlayerVersionToLog,
  setStorageConfig,
  applyStorageSupport,
  applyCastSupport,
  setStorageTextStyle,
  attachToFirstClick,
  validateConfig,
  validateProviderConfig,
  setLogOptions,
  maybeApplyStartTimeQueryParam,
  createKalturaPlayerContainer,
  checkNativeHlsSupport,
  getDefaultOptions,
  maybeSetStreamPriority,
  hasYoutubeSource,
  hasImageSource,
  mergeProviderPluginsConfig,
  getServerUIConf,
  KALTURA_PLAYER_START_TIME_QS
};
//# sourceMappingURL=setup-helpers.d.ts.map
