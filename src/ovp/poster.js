// @flow
import {THUMBNAIL_REGEX} from '../common/thumbnail-manager';

/**
 * Add poster with player dimensions to thumbnail API call
 * @param {PKSourcesConfigObject} playerSources - player sources container
 * @param {ProviderMediaConfigSourcesObject} mediaSources - media config sources container
 * @param {Object} dimensions - player dimensions object
 * @param {string} ks - ks
 * @private
 * @returns {void}
 */
function addKalturaPoster(
  playerSources: PKSourcesConfigObject,
  mediaSources: ProviderMediaConfigSourcesObject,
  dimensions: Object,
  ks?: string
): void {
  const playerPoster = playerSources.poster;
  const mediaConfigPoster = mediaSources.poster;
  const playerWidth = dimensions.width;
  const playerHeight = dimensions.height;
  if (typeof playerPoster === 'string' && THUMBNAIL_REGEX.test(playerPoster) && playerPoster === mediaConfigPoster) {
    playerSources.poster = `${playerPoster}/height/${playerHeight}/width/${playerWidth}${ks ? `/ks/${ks}` : ''}`;
  }
  mediaSources.poster = playerSources.poster || '';
}

export {addKalturaPoster};
