import { MediaSourceObject } from './media-source';
import { ExternalCaptionObject } from './external-caption-object';
import { ExternalThumbnailsConfig } from './exteranl-thumbnails-object';
import { MediaSourceOptionsObject } from './media-source-options';
import { MetadataConfig } from './metadata-config';
import { ImageSourceOptions } from './image-player-options';
import { ProviderMediaConfigSources } from './provider/provider-media-config';

export interface SourcesConfig extends Omit<ProviderMediaConfigSources, 'poster'> {
  thumbnails?: ExternalThumbnailsConfig;
  options: MediaSourceOptionsObject;
  startTime: number;
  imageSourceOptions?: ImageSourceOptions;
  poster?: string;
}
