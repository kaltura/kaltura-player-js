// @flow
import {DEFAULT_THUMBS_SLICES, DEFAULT_THUMBS_WIDTH, getThumbSlicesUrl} from '../common/utils/thumbs'
import {UIManager} from 'playkit-js-ui'

/**
 * Add poster with player dimensions to thumbnail API call
 * @param {Object} metadata - metadata container
 * @param {number} playerWidth - player width in px
 * @param {number} playerHeight - player height in px
 * @returns {void}
 */
function addKalturaPoster(metadata: Object, playerWidth: number, playerHeight: number): void {
  if (metadata.poster) {
    metadata.poster = `${metadata.poster}/height/${playerHeight}/width/${playerWidth}`;
  }
}

/**
 * Gets the preview thumbnail config for the ui seekbar component.
 * @param {UIManager} uiManager - The ui manager.
 * @param {Object} mediaConfig - The provider media config.
 * @returns {Object} - The preview thumbnail config.
 */
function getPreviewThumbnailConfig(uiManager: UIManager, mediaConfig: Object): Object {
  return {
    thumbsSprite: getThumbSlicesUrl(mediaConfig),
    thumbsWidth: DEFAULT_THUMBS_WIDTH,
    thumbsSlices: DEFAULT_THUMBS_SLICES
  };
}

export {addKalturaPoster, getPreviewThumbnailConfig};
