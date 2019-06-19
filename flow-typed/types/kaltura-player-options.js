// @flow
import {KPPlaylistObject} from './playlist';

declare type KPOptionsObject = {
  targetId: string,
  log?: KPLogConfigObject,
  disableUserCache?: boolean,
  playback?: PKPlaybackConfigObject,
  sources?: PKSourcesConfigObject,
  plugins?: PKPluginsConfigObject,
  session?: PKSessionConfigObject,
  provider: ProviderOptionsObject,
  playlist?: KPPlaylistObject,
  ui: UIOptionsObject,
  cast?: { [key: string]: any }
};

declare type PartialKPOptionsObject = {
  targetId: string,
  log?: KPLogConfigObject,
  disableUserCache?: boolean,
  playback?: PKPlaybackConfigObject,
  sources?: PKSourcesConfigObject,
  plugins?: PKPluginsConfigObject,
  session?: PKSessionConfigObject,
  provider: ProviderOptionsObject,
  ui?: UIOptionsObject,
  cast?: { [key: string]: any }
};

declare type LegacyPartialKPOptionsObject = {
  targetId: string,
  logLevel?: string,
  disableUserCache?: boolean,
  player?: PKPlayerOptionsObject,
  provider: ProviderOptionsObject,
  ui?: UIOptionsObject
};
