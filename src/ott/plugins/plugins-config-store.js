//@flow

import {BasePluginConfigStore, templateRegex} from '../../common/plugins/plugins-config-store';

import {Utils} from '@playkit-js/playkit-js';

class PluginConfigStore extends BasePluginConfigStore {
  _ottPluginsConfig: {[pluginName: string]: Object} = {
    kava: {
      ks: ''
    }
  };

  constructor() {
    super();

    this._config = Utils.Object.mergeDeep({}, this._basePluginsConfig, this._ottPluginsConfig);
  }
}

export {PluginConfigStore, templateRegex};
