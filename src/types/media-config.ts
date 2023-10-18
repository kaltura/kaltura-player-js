import { PlaybackConfig } from './playback-config';
import { SessionConfig } from './session-config';
import { ProviderMediaConfigSources } from './provider/provider-media-config';

/**
 * @typedef {Object} KPMediaConfig
 * @property {ProviderMediaConfigSourcesObject} sources
 * @property {ProviderMediaConfigSessionObject} session
 * @property {{[plugin: string]: Object}} plugins
 */
export interface KPMediaConfig extends PlaybackConfig {
  sources: ProviderMediaConfigSources;
  session?: SessionConfig;
  plugins?: { [plugin: string]: Object };
}
