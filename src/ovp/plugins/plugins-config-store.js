//@flow

import {BasePluginConfigStore, templateRegex} from '../../common/plugins/plugins-config-store';

import {Utils} from '@playkit-js/playkit-js';

class PluginConfigStore extends BasePluginConfigStore {
  _ovpPluginsConfig: {[pluginName: string]: Object} = {
    ottAnalytics: {}
  };

  constructor() {
    super();

    this._config = Utils.Object.mergeDeep({}, this._basePluginsConfig, this._ovpPluginsConfig);
    //console.log(this._config);
  }
}

export {PluginConfigStore, templateRegex};
