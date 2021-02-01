// @flow
import evaluate from './evaluate';
import {MediaType} from '@playkit-js/playkit-js';

export const DEFAULT_THUMBS_WIDTH: number = 164;
export const DEFAULT_THUMBS_SLICES: number = 100;
export const THUMBNAIL_REGEX = /.*\/p\/\d+\/(?:[a-zA-Z]+\/\d+\/)*thumbnail\/entry_id\/\w+\/.*\d+/;

const TEMPLATE: string = '{{thumbnailUrl}}/width/{{width}}/vid_slices/{{slices}}/ks/{{ks}}';

/**
 * Builds thumbnail slices url for the ui.
 * @private
 * @param {KPMediaConfig} mediaConfig - The player media config.
 * @param {SeekbarConfig?} seekbarConfig - The seek bar config.
 * @returns {string} - The thumbnail slices url.
 */
export function getThumbSlicesUrl(mediaConfig: KPMediaConfig, seekbarConfig?: SeekbarConfig): string {
  const mediaConfigPoster = mediaConfig.sources && mediaConfig.sources.poster;
  const isVod = mediaConfig.sources && mediaConfig.sources.type === MediaType.VOD;
  if (typeof mediaConfigPoster === 'string' && isVod) {
    if (THUMBNAIL_REGEX.test(mediaConfigPoster)) {
      try {
        const model: Object = {
          thumbnailUrl: mediaConfigPoster,
          ks: mediaConfig.session && mediaConfig.session.ks,
          width: (seekbarConfig && seekbarConfig.thumbsWidth) || DEFAULT_THUMBS_WIDTH,
          slices: (seekbarConfig && seekbarConfig.thumbsSlices) || DEFAULT_THUMBS_SLICES
        };
        return evaluate(TEMPLATE, model);
      } catch (e) {
        return '';
      }
    }
  }
  return '';
}
