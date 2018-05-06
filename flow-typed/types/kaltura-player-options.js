// @flow
declare type KalturaPlayerOptionsObject = {
  targetId: string,
  logLevel?: string,
  disableUserCache?: boolean,
  playback?: PKPlaybackConfigObject,
  sources?: PKSourcesConfigObject,
  plugins?: PKPluginsConfigObject,
  session?: PKSessionConfigObject,
  provider: ProviderOptionsObject,
  ui: UIOptionsObject
};

declare type PartialKalturaPlayerOptionsObject = {
  targetId: string,
  logLevel?: string,
  disableUserCache?: boolean,
  playback?: PKPlaybackConfigObject,
  sources?: PKSourcesConfigObject,
  plugins?: PKPluginsConfigObject,
  session?: PKSessionConfigObject,
  provider: ProviderOptionsObject,
  ui?: UIOptionsObject
};

declare type LegacyPartialKalturaPlayerOptionsObject = {
  targetId: string,
  logLevel?: string,
  disableUserCache?: boolean,
  player?: PKPlayerOptionsObject,
  provider: ProviderOptionsObject,
  ui?: UIOptionsObject
};
