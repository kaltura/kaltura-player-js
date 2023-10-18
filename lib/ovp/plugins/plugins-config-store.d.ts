import { BasePluginConfigStore, templateRegex } from '../../common/plugins/plugins-config-store';
declare class PluginConfigStore extends BasePluginConfigStore {
  _ovpPluginsConfig: {
    [pluginName: string]: Object;
  };
  constructor();
}
export { PluginConfigStore, templateRegex };
//# sourceMappingURL=plugins-config-store.d.ts.map
