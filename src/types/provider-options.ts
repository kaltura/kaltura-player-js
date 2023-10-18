import { ProviderNetworkRetryParameters } from './provider/network-retry-parameters';
import { ProviderFilterOptions } from './provider/filter-options';
import { ProviderEnvConfig } from './provider/env-config';
import { Logger } from './provider/Logger';

export interface ProviderConfig {
  partnerId: number;
  widgetId?: string;
  logger?: Logger;
  ks?: string;
  uiConfId?: number;
  env?: ProviderEnvConfig;
  networkRetryParameters?: ProviderNetworkRetryParameters;
  filterOptions?: ProviderFilterOptions;
  ignoreServerConfig?: boolean;
  loadThumbnailWithKs?: boolean;
}
