import { BasePlugin } from '../common/plugins';

export interface PluginsConfig {
  [plugin: string]: BasePlugin<any>;
}
