import { PluginConfigStore } from 'plugins-config-store';
import { KalturaPlayerConfig } from '../../types/kaltura-player-options';
import { PluginsConfig } from '../../types/plugins-config';
/**
 * @return {string} - The referrer after URIComponent encoded
 * @private
 */
declare function getEncodedReferrer(): string;
declare class ConfigEvaluator {
  _pluginConfigStore: PluginConfigStore;
  /**
   * constructor
   * @constructor
   */
  constructor();
  /**
   * @param {KPPluginsConfigObject} options - plugins options
   * @param {KPOptionsObject} config - player config
   * @return {void}
   */
  evaluatePluginsConfig(options: PluginsConfig | undefined, config: Partial<KalturaPlayerConfig>): void;
}
export { ConfigEvaluator, getEncodedReferrer };
//# sourceMappingURL=plugins-config.d.ts.map
