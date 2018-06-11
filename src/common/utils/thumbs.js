// @flow
import evaluate from './evaluate'

export const DEFAULT_THUMBS_WIDTH: number = 164;
export const DEFAULT_THUMBS_SLICES: number = 100;
const TEMPLATE: string = '{{thumbnailUrl}}/width/{{width}}/vid_slices/{{slices}}/ks/{{ks}}';

/**
 * Builds thumbnail slices url for the ui.
 * @param {ProviderMediaConfigObject} mediaConfig - The prover media config.
 * @param {SeekbarConfig?} seekbarConfig - The seek bar config.
 * @returns {string} - The thumbnail slices url.
 */
export function getThumbSlicesUrl(mediaConfig: ProviderMediaConfigObject, seekbarConfig?: SeekbarConfig): string {
  try {
    const model: Object = {
      thumbnailUrl: mediaConfig.sources.poster,
      ks: mediaConfig.session.ks,
      width: (seekbarConfig && seekbarConfig.thumbsWidth) || DEFAULT_THUMBS_WIDTH,
      slices: (seekbarConfig && seekbarConfig.thumbsSlices) || DEFAULT_THUMBS_SLICES,
    };
    return evaluate(TEMPLATE, model);
  } catch (e) {
    return '';
  }
}
