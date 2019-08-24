// @flow
/**
 * Add poster with player dimensions to thumbnail API call
 * @param {PKPlayerOptionsObject} playerOptions - player options container
 * @param {ProviderMediaConfigSourcesObject} mediaSources - media config sources container
 * @param {Object} dimensions - player dimensions object
 * @private
 * @returns {void}
 */
function addKalturaPoster(playerOptions: PKPlayerOptionsObject, mediaSources: ProviderMediaConfigSourcesObject, dimensions: Object): void {
  const playerPoster = playerOptions.sources.poster;
  const mediaConfigPoster = mediaSources.poster;
  const playerWidth = dimensions.width;
  const playerHeight = dimensions.height;
  const ks = playerOptions.session.ks;
  if (typeof playerPoster === 'string' && playerPoster === mediaConfigPoster) {
    playerOptions.sources.poster = `${playerPoster}/height/${playerHeight}/width/${playerWidth}`;
  }
  if (typeof ks === 'string' && ks !== '') {
    playerOptions.sources.poster += `/ks/${ks}`;
  }
}

export {addKalturaPoster};
