import { PlaybackConfig } from './playback-config';
import {ProviderMediaConfigSessionObject, ProviderMediaConfigSourcesObject} from '@playkit-js/playkit-js-providers';

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
