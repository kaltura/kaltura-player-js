import { BasePluginConfigStore, templateRegex } from '../../common/plugins/plugins-config-store';

import { Utils } from '@playkit-js/playkit-js';

class PluginConfigStore extends BasePluginConfigStore {
  private _ovpPluginsConfig: { [pluginName: string]: any } = {
    ottAnalytics: {}
  };

  constructor() {
    super();

    this._config = Utils.Object.mergeDeep({}, this._basePluginsConfig, this._ovpPluginsConfig);
  }
}

export { PluginConfigStore, templateRegex };
