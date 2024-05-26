import { LogConfig } from './log-level';
import { PlaybackConfig } from './playback-config';
import { AdvertisingConfig } from './advertising-config';
import { PlaylistConfig } from './playlist-object';
import { UiConfig } from './ui-config';
import { ViewabilityConfig } from './visibility-config';
import { NetworkConfig } from './network-config';
import { PluginsConfig } from './plugins';

import {
  PKAbrConfigObject,
  PKDimensionsConfig,
  PKSessionConfigObject,
  PKSourcesConfigObject,
  PKTextConfigObject
} from '@playkit-js/playkit-js';
import { ProviderOptionsObject } from "@playkit-js/playkit-js-providers/types";

export interface KalturaPlayerConfig {
  targetId: string;
  log?: LogConfig;
  disableUserCache?: boolean;
  text?: PKTextConfigObject;
  playback: PlaybackConfig;
  sources: PKSourcesConfigObject;
  plugins: PluginsConfig;
  advertising: AdvertisingConfig;
  session?: PKSessionConfigObject;
  provider: ProviderOptionsObject;
  playlist?: PlaylistConfig;
  dimensions?: PKDimensionsConfig;
  ui: UiConfig;
  cast?: { [key: string]: any };
  productVersion?: string;
  viewability: ViewabilityConfig;
  network?: NetworkConfig;
  abr?: PKAbrConfigObject;
  uiConfData?: UIConfDataObject;
}

export type PartialKPOptionsObject = Omit<
  KalturaPlayerConfig,
  'productVersion'
>;

export interface LegacyPartialKPOptionsObject {
  targetId: string;
  logLevel?: string;
  disableUserCache?: boolean;
  // TODO - fix
  // player?: PKPlayerOptionsObject;
  player?: any;
  provider: ProviderOptionsObject;
  ui?: UiConfig;
}

export interface UIConfDataObject {
  width?: string;
  height?: string;
  name?: string;
}
