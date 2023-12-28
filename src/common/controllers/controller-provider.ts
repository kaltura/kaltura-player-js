import { PluginManager } from '../plugins';
import { IAdsPluginController, IAdsControllerProvider } from '../../types';

/**
 * Controller provider
 * @classdesc
 */
class ControllerProvider {
  private _pluginManager: PluginManager;

  /**
   * @constructor
   * @param {PluginManager} pluginManager - the plugin manager
   */
  constructor(pluginManager: PluginManager) {
    this._pluginManager = pluginManager;
  }

  /**
   * Get the ads controller of the all ads plugins.
   * @returns {Array<IAdsPluginController>} - the ads controllers.
   */
  public getAdsControllers(): Array<IAdsPluginController> {
    // eslint-disable-next-line  @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const adPlugins: Array<IAdsControllerProvider> = Object.values(this._pluginManager.getAll()).filter(
      // eslint-disable-next-line  @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (plugin) => typeof plugin.getAdsController === 'function'
    );
    return adPlugins.map((plugin) => plugin.getAdsController());
  }
}

export { ControllerProvider };
