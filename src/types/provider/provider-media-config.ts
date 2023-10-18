import { MediaSourceObject } from '../media-source';
import { ExternalCaptionObject } from '../external-caption-object';
import { MetadataConfig } from '../metadata-config';
import { Poster } from './poster';

export interface ProviderMediaConfigSources {
  hls: MediaSourceObject[];
  dash: MediaSourceObject[];
  progressive: MediaSourceObject[];
  image: MediaSourceObject[]; // TODO - should be replaced to ImageSource
  duration?: number;
  type: string;
  id?: string;
  poster: string | Poster[];
  dvr: boolean;
  vr: Object | undefined;
  metadata: MetadataConfig;
  captions?: ExternalCaptionObject[];
}
