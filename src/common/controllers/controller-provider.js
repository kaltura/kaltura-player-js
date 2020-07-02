//@flow

import {PluginManager} from '@playkit-js/playkit-js';

/**
 * Controller provider
 * @classdesc
 */
class ControllerProvider {
  _pluginManager: PluginManager;

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
  getAdsControllers(): Array<IAdsPluginController> {
    //$FlowFixMe
    const adPlugins: Array<IAdsControllerProvider> = Object.values(this._pluginManager.getAll()).filter(
      //$FlowFixMe
      plugin => typeof plugin.getAdsController === 'function'
    );
    return adPlugins.map(plugin => plugin.getAdsController());
  }
}

export {ControllerProvider};
