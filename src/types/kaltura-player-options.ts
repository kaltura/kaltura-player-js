import { LogConfig } from './log-level';
import { TextConfig } from './text-config';
import { PlaybackConfig } from './playback-config';
import { SourcesConfig } from './sources-config';
import { SessionConfig } from './session-config';
import { AdvertisingConfig } from './advertising-config';
import { ProviderConfig } from './provider-options';
import { PlaylistConfig } from './playlist-object';
import { DimensionsConfig } from './dimensions-config';
import { UiConfig } from './ui-config';
import { ViewabilityConfig } from './visibility-config';
import { NetworkConfig } from './network-config';
import { AbrConfig } from './abr-config';
import { PluginsConfig } from './plugins-config';

export interface KalturaPlayerConfig {
  targetId: string;
  log?: LogConfig;
  disableUserCache?: boolean;
  text?: TextConfig;
  playback: PlaybackConfig;
  sources: SourcesConfig;
  plugins: PluginsConfig;
  advertising: AdvertisingConfig;
  session?: SessionConfig;
  provider: ProviderConfig;
  playlist?: PlaylistConfig;
  dimensions?: DimensionsConfig;
  ui: UiConfig;
  cast?: { [key: string]: any };
  productVersion?: string;
  viewability: ViewabilityConfig;
  network?: NetworkConfig;
  abr?: AbrConfig;
}

export type PartialKPOptionsObject = Omit<KalturaPlayerConfig, 'productVersion'>;

export interface LegacyPartialKPOptionsObject {
  targetId: string;
  logLevel?: string;
  disableUserCache?: boolean;
  // TODO - fix
  // player?: PKPlayerOptionsObject;
  player?: any;
  provider: ProviderConfig;
  ui?: UiConfig;
}
