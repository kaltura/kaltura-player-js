// @flow
import evaluate from './evaluate'

export const DEFAULT_THUMBS_WIDTH: number = 164;
export const DEFAULT_THUMBS_SLICES: number = 100;
const TEMPLATE: string = '{{thumbnailUrl}}/width/{{width}}/vid_slices/{{slices}}/ks/{{ks}}';

/**
 * Builds thumbnail slices url for the ui.
 * @param {Object} data - The prover data.
 * @param {Object} uiConfig - The ui config.
 * @returns {string} - The thumbnail slices url.
 */
export function getThumbSlicesUrl(data: Object, uiConfig: Object = {}): string {
  try {
    const model: Object = {
      thumbnailUrl: data.metadata.poster,
      ks: data.session.ks,
      width: uiConfig.thumbsWidth || DEFAULT_THUMBS_WIDTH,
      slices: uiConfig.thumbsSlices || DEFAULT_THUMBS_SLICES,
    };
    return evaluate(TEMPLATE, model);
  } catch (e) {
    return '';
  }
}
