// @flow
import {DEFAULT_THUMBS_SLICES, DEFAULT_THUMBS_WIDTH} from '../common/utils/thumbs'
import {Utils} from 'playkit-js'

/**
 * Add poster with player dimensions.
 * If poster is string and width and height exists in template we need to make a thumbnail API call.
 * If poster is array of objects we need to choose the best fit dimensions according to the player dimensions.
 * @param {Object} metadata - metadata container
 * @param {number} width - player width in px
 * @param {number} height - player height in px
 * @returns {void}
 */
function addKalturaPoster(metadata: Object, width: number, height: number): void {
  if (typeof metadata.poster === 'string') {
    const regex = /.*\/thumbnail\/.*(?:width|height)\/\d+\/(?:height|width)\/\d+/;
    if (regex.test(metadata.poster)) {
      metadata.poster = setPlayerDimensionsOnPoster(metadata.poster, width, height);
    }
  } else if (Array.isArray(metadata.poster)) {
    metadata.poster = selectPosterByPlayerDimensions(metadata.poster, width, height);
  }
}

/**
 * Sets the preview thumbnail config for the ui seekbar component.
 * @param {UIManager} uiManager - The ui manager.
 * @returns {void}
 */
function setUISeekbarConfig(uiManager: UIManager): void {
  let seekbarConfig = Utils.Object.getPropertyPath(uiManager, 'config.components.seekbar');
  if (seekbarConfig) {
    seekbarConfig = Utils.Object.mergeDeep({
      thumbsWidth: DEFAULT_THUMBS_WIDTH,
      thumbsSlices: DEFAULT_THUMBS_SLICES
    }, seekbarConfig);
    uiManager.setConfig(seekbarConfig, "seekbar");
  }
}

/**
 * Replace the current dimensions with the player dimensions.
 * @param {string} poster - Player url.
 * @param {number} width - Player width.
 * @param {height} height - Player height.
 * @return {string} - The new poster url including the player dimensions.
 */
function setPlayerDimensionsOnPoster(poster: string, width: number, height: number): string {
  const parts = poster.split('/');
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] === 'width') {
      parts[i + 1] = width.toString();
      i += 2;
    } else if (parts[i] === 'height') {
      parts[i + 1] = height.toString();
      i += 2;
    }
  }
  return parts.join('/');
}

/**
 * Selects the best fit poster depends on the player dimensions.
 * @param {string} posters - Array of posters candidates.
 * @param {number} width - Player width.
 * @param {height} height - Player height.
 * @return {string} - The poster url.
 */
function selectPosterByPlayerDimensions(posters: Array<Object>, width: number, height: number): string {
  let min = Infinity;
  let url = '';
  posters.forEach(picture => {
    const w = picture.width;
    const h = picture.height;
    const widthDelta = Math.abs(w - width);
    const heightDelta = Math.abs(h - height);
    const delta = widthDelta + heightDelta;
    if (delta < min) {
      min = delta;
      url = picture.url;
    }
  });
  return url;
}

export {addKalturaPoster, setUISeekbarConfig};
