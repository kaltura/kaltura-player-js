import { KalturaPlayer } from "../../kaltura-player";
import { BasePlugin } from "../../common/plugins";

export interface PluginClassType {
  new (name: string, player: KalturaPlayer, config?: any): BasePlugin;
  defaultConfig: any;
  isValid: () => boolean;
}
