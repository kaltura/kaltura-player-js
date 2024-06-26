import { PlaybackConfig } from './playback-config';
import { ProviderMediaConfigSourcesObject, ProviderMediaConfigSessionObject } from "@playkit-js/playkit-js-providers/types";


/**
 * @typedef {Object} KPMediaConfig
 * @property {ProviderMediaConfigSourcesObject} sources
 * @property {ProviderMediaConfigSessionObject} session
 * @property {{[plugin: string]: Object}} plugins
 */
export interface KPMediaConfig extends PlaybackConfig {
  sources: ProviderMediaConfigSourcesObject;
  session?: ProviderMediaConfigSessionObject;
  plugins?: { [plugin: string]: Object };
}
