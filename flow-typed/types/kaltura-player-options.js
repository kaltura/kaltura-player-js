// @flow
import {KPPlaylistObject} from './playlist';
import type {ProviderEnumType} from '../../src/provider-manager';

declare type KPOptionsObject = {
  targetId: string,
  log?: KPLogConfigObject,
  disableUserCache?: boolean,
  playback?: PKPlaybackConfigObject,
  sources?: PKSourcesConfigObject,
  plugins?: PKPluginsConfigObject,
  session?: PKSessionConfigObject,
  provider: ProviderOptionsObject & {type: ProviderEnumType},
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
  provider: ProviderOptionsObject & {type: ProviderEnumType},
  ui?: UIOptionsObject,
  cast?: { [key: string]: any }
};

declare type LegacyPartialKPOptionsObject = {
  targetId: string,
  logLevel?: string,
  disableUserCache?: boolean,
  player?: PKPlayerOptionsObject,
  provider: ProviderOptionsObject & {type: ProviderEnumType},
  ui?: UIOptionsObject
};
