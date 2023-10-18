import { IAdsPluginController } from './ads-plugin-controller';

export interface IAdsControllerProvider {
  getAdsController(): IAdsPluginController;
}
