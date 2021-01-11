// @flow
declare type KPMediaConfig = {
  sources: ProviderMediaConfigSourcesObject,
  session?: ProviderMediaConfigSessionObject,
  plugins?: {[plugin: string]: Object}
} & PKPlaybackConfigObject;
