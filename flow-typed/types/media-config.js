// @flow


/**
 * @typedef {Object} KPMediaConfig
 * @property {ProviderMediaConfigSourcesObject} sources
 * @property {ProviderMediaConfigSessionObject} session
 * @property {{[plugin: string]: Object}} plugins
 */
declare type KPMediaConfig = {
  sources: ProviderMediaConfigSourcesObject,
  session?: ProviderMediaConfigSessionObject,
  plugins?: {[plugin: string]: Object}
} & PKPlaybackConfigObject;
