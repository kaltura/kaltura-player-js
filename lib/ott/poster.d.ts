import { SourcesConfig } from '../types/sources-config';
import { ProviderMediaConfigSources } from '../types/provider/provider-media-config';
import { DimensionsConfig } from '../types/dimensions-config';
/**
 * Add poster with player dimensions.
 * If poster is string and width and height exists in template we need to make a thumbnail API call.
 * If poster is array of objects we need to choose the best fit dimensions according to the player dimensions.
 * @param {PKSourcesConfigObject} playerSources - player sources container
 * @param {ProviderMediaConfigSourcesObject} mediaSources - media config sources container
 * @param {Object} dimensions - player dimensions object
 * @private
 * @returns {void}
 */
declare function addKalturaPoster(playerSources: SourcesConfig, mediaSources: ProviderMediaConfigSources, dimensions: DimensionsConfig): void;
export { addKalturaPoster };
//# sourceMappingURL=poster.d.ts.map
