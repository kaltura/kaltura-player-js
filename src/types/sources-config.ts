import { ExternalThumbnailsConfig } from './exteranl-thumbnails-object';
import { MediaSourceOptionsObject } from './media-source-options';
import { ImageSourceOptions } from './image-player-options';
import { ProviderMediaConfigSourcesObject } from "@playkit-js/playkit-js-providers/types";

export interface SourcesConfig
  extends Omit<ProviderMediaConfigSourcesObject, 'poster'> {
  thumbnails?: ExternalThumbnailsConfig;
  options: MediaSourceOptionsObject;
  startTime: number;
  imageSourceOptions?: ImageSourceOptions;
  poster?: string;
}