// @flow
import {DEFAULT_THUMBS_SLICES, DEFAULT_THUMBS_WIDTH} from '../common/utils/thumbs'
import {Utils} from 'playkit-js'
import {UIManager} from 'playkit-js-ui'

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
 * @param {number} playerWidth - Player width.
 * @param {height} playerHeight - Player height.
 * @return {string} - The new poster url including the player dimensions.
 */
function setPlayerDimensionsOnPoster(poster: string, playerWidth: number, playerHeight: number): string {
  const widthMatch = poster.match(/width\/(\d+)/);
  const heightMatch = poster.match(/height\/(\d+)/);
  if (Array.isArray(widthMatch)) {
    poster = poster.replace(widthMatch[1], playerWidth.toString());
  }
  if (Array.isArray(heightMatch)) {
    poster = poster.replace(heightMatch[1], playerHeight.toString());
  }
  return poster;
}

/**
 * Selects the best fit poster depends on the player dimensions.
 * @param {string} posters - Array of posters candidates.
 * @param {number} playerWidth - Player width.
 * @param {height} playerHeight - Player height.
 * @return {string} - The poster url.
 */
function selectPosterByPlayerDimensions(posters: Array<Object>, playerWidth: number, playerHeight: number): string {
  let min = Infinity;
  let url = '';
  posters.forEach(picture => {
    const picWidth = picture.width;
    const picHeight = picture.height;
    const widthDelta = Math.abs(picWidth - playerWidth);
    const heightDelta = Math.abs(picHeight - playerHeight);
    const delta = widthDelta + heightDelta;
    if (delta < min) {
      min = delta;
      url = picture.url;
    }
  });
  return url;
}

export {addKalturaPoster, setUISeekbarConfig};
