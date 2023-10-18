import { DrmDataObject } from './drm-data';

export interface MediaSourceObject {
  mimetype: string;
  url: string;
  id?: string;
  bandwidth?: number;
  width?: number;
  height?: number;
  label?: string;
  drmData?: DrmDataObject[];
}
