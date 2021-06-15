// @flow
import {KPPlaylistObject} from './playlist';

declare type KPOptionsObject = {
  targetId: string,
  log?: KPLogConfigObject,
  disableUserCache?: boolean,
  text?: PKTextConfigObject,
  playback?: PKPlaybackConfigObject,
  plugins: KPPluginsConfigObject,
  advertising: KPAdvertisingConfigObject,
  session?: PKSessionConfigObject,
  provider: ProviderOptionsObject,
  playlist?: KPPlaylistObject,
  dimensions?: PKDimensionsConfig,
  ui: KPUIOptionsObject,
  cast?: {[key: string]: any},
  productVersion?: string,
  viewability?: KPViewabilityConfigObject
};

declare type PartialKPOptionsObject = {
  targetId: string,
  log?: KPLogConfigObject,
  disableUserCache?: boolean,
  text?: PKTextConfigObject,
  playback?: PKPlaybackConfigObject,
  plugins: KPPluginsConfigObject,
  advertising: KPAdvertisingConfigObject,
  session?: PKSessionConfigObject,
  provider: ProviderOptionsObject,
  playlist?: KPPlaylistObject,
  dimensions?: PKDimensionsConfig,
  ui?: KPUIOptionsObject,
  cast?: {[key: string]: any}
};

declare type LegacyPartialKPOptionsObject = {
  targetId: string,
  logLevel?: string,
  disableUserCache?: boolean,
  player?: PKPlayerOptionsObject,
  provider: ProviderOptionsObject,
  ui?: KPUIOptionsObject
};
