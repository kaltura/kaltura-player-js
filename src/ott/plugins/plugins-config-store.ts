import { BasePluginConfigStore, templateRegex } from '../../common/plugins/plugins-config-store';

import { Utils } from '@playkit-js/playkit-js';

class PluginConfigStore extends BasePluginConfigStore {
  private _ottPluginsConfig: { [pluginName: string]: any } = {
    kava: {
      ks: ''
    }
  };

  constructor() {
    super();

    this._config = Utils.Object.mergeDeep({}, this._basePluginsConfig, this._ottPluginsConfig);
  }
}

export { PluginConfigStore, templateRegex };
