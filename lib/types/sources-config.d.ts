import { ExternalThumbnailsConfig } from './exteranl-thumbnails-object';
import { MediaSourceOptionsObject } from './media-source-options';
import { ImageSourceOptions } from './image-player-options';
import { ProviderMediaConfigSources } from './provider/provider-media-config';
export interface SourcesConfig extends Omit<ProviderMediaConfigSources, 'poster'> {
  thumbnails?: ExternalThumbnailsConfig;
  options: MediaSourceOptionsObject;
  startTime: number;
  imageSourceOptions?: ImageSourceOptions;
  poster?: string;
}
//# sourceMappingURL=sources-config.d.ts.map
