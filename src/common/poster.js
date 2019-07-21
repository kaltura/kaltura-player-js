// @flow
/**
 * get poster with player dimensions to thumbnail API call
 * @param {string} providerType - the provider type
 * @param {PKSourcesConfigObject} playerSources - player sources container
 * @param {ProviderMediaConfigSourcesObject} mediaSources - media config sources container
 * @param {Object} dimensions - player dimensions object
 * @private
 * @returns {string | null} the poster
 */
function getKalturaPoster(
  providerType: string,
  playerSources: PKSourcesConfigObject,
  mediaSources: ProviderMediaConfigSourcesObject,
  dimensions: Object
): string | null {
  let poster = null;
  switch (providerType) {
    case 'ott':
      poster = getKalturaOvpPoster(playerSources, mediaSources, dimensions);
      break;
    case 'ovp':
      poster = getKalturaOttPoster(playerSources, mediaSources, dimensions);
      break;
    case null:
      break;
  }
  return poster;
}

/**
 * get poster with player dimensions to thumbnail API call
 * @param {PKSourcesConfigObject} playerSources - player sources container
 * @param {ProviderMediaConfigSourcesObject} mediaSources - media config sources container
 * @param {Object} dimensions - player dimensions object
 * @private
 * @returns {string | null} the poster
 */
function getKalturaOvpPoster(
  playerSources: PKSourcesConfigObject,
  mediaSources: ProviderMediaConfigSourcesObject,
  dimensions: Object
): string | null {
  let poster = null;
  const playerPoster = playerSources.poster;
  const mediaConfigPoster = mediaSources.poster;
  const playerWidth = dimensions.width;
  const playerHeight = dimensions.height;
  if (typeof playerPoster === 'string' && playerPoster === mediaConfigPoster) {
    poster = `${playerPoster}/height/${playerHeight}/width/${playerWidth}`;
  }
  return poster;
}

/**
 * get poster with player dimensions.
 * If poster is string and width and height exists in template we need to make a thumbnail API call.
 * If poster is array of objects we need to choose the best fit dimensions according to the player dimensions.
 * @param {PKSourcesConfigObject} playerSources - player sources container
 * @param {ProviderMediaConfigSourcesObject} mediaSources - media config sources container
 * @param {Object} dimensions - player dimensions object
 * @private
 * @returns {string | null} the poster
 */
function getKalturaOttPoster(
  playerSources: PKSourcesConfigObject,
  mediaSources: ProviderMediaConfigSourcesObject,
  dimensions: Object
): string | null {
  let poster = null;
  const playerPoster = playerSources.poster;
  const mediaConfigPoster = mediaSources.poster;
  const playerWidth = dimensions.width;
  const playerHeight = dimensions.height;
  if (typeof playerPoster === 'string' && playerPoster === mediaConfigPoster) {
    const regex = /.*\/thumbnail\/.*(?:width|height)\/\d+\/(?:height|width)\/\d+/;
    if (regex.test(playerPoster)) {
      poster = setPlayerDimensionsOnPoster(playerPoster, playerWidth, playerHeight);
    }
  } else if (Array.isArray(playerPoster)) {
    poster = selectPosterByPlayerDimensions(playerPoster, playerWidth, playerHeight);
  }
  return poster;
}

/**
 * Replace the current dimensions with the player dimensions.
 * @param {string} poster - Player url.
 * @param {number} playerWidth - Player width.
 * @param {height} playerHeight - Player height.
 * @private
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
 * @private
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

export {getKalturaPoster};
