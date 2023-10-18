import { AdapterDataConfig } from './adapter-data-config';

export interface OVPProviderMediaInfo {
  entryId?: string;
  referenceId?: string;
  ks?: string;
}

export interface OTTProviderMediaInfo extends OVPProviderMediaInfo {
  mediaType: string;
  contextType: string;
  protocol?: string;
  fileIds?: string;
  streamerType?: string;
  urlType?: string;
  adapterData?: AdapterDataConfig;
  assetReferenceType?: string;
  formats?: Array<string>;
}

export type ProviderMediaInfo = OVPProviderMediaInfo | OTTProviderMediaInfo;
