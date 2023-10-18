import { PluginManager } from '../plugins';
import { IAdsPluginController } from '../../types/ads/ads-plugin-controller';
/**
 * Controller provider
 * @classdesc
 */
declare class ControllerProvider {
  _pluginManager: PluginManager;
  /**
   * @constructor
   * @param {PluginManager} pluginManager - the plugin manager
   */
  constructor(pluginManager: PluginManager);
  /**
   * Get the ads controller of the all ads plugins.
   * @returns {Array<IAdsPluginController>} - the ads controllers.
   */
  getAdsControllers(): Array<IAdsPluginController>;
}
export { ControllerProvider };
//# sourceMappingURL=controller-provider.d.ts.map
