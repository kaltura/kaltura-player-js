// @flow
/**
 * Add poster with player dimensions.
 * If poster is string and width and height exists in template we need to make a thumbnail API call.
 * If poster is array of objects we need to choose the best fit dimensions according to the player dimensions.
 * @param {PKSourcesConfigObject} playerSources - player sources container
 * @param {ProviderMediaConfigSourcesObject} mediaSources - media config sources container
 * @param {Object} dimensions - player dimensions object
 * @returns {void}
 */
function addKalturaPoster(playerSources: PKSourcesConfigObject, mediaSources: ProviderMediaConfigSourcesObject, dimensions: Object): void {
  const playerPoster = playerSources.poster;
  const mediaConfigPoster = mediaSources.poster;
  const playerWidth = dimensions.width;
  const playerHeight = dimensions.height;
  if (typeof playerPoster === 'string' && playerPoster === mediaConfigPoster) {
    const regex = /.*\/thumbnail\/.*(?:width|height)\/\d+\/(?:height|width)\/\d+/;
    if (regex.test(playerPoster)) {
      playerSources.poster = setPlayerDimensionsOnPoster(playerPoster, playerWidth, playerHeight);
    } else if (Array.isArray(playerPoster)) {
      playerSources.poster = selectPosterByPlayerDimensions(playerPoster, playerWidth, playerHeight);
    }
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

export {addKalturaPoster};
