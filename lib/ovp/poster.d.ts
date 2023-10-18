import { SourcesConfig } from '../types/sources-config';
import { ProviderMediaConfigSources } from '../types/provider/provider-media-config';
import { DimensionsConfig } from '../types/dimensions-config';
/**
 * Add poster with player dimensions to thumbnail API call
 * @param {PKSourcesConfigObject} playerSources - player sources container
 * @param {ProviderMediaConfigSourcesObject} mediaSources - media config sources container
 * @param {Object} dimensions - player dimensions object
 * @param {string} ks - ks
 * @private
 * @returns {void}
 */
declare function addKalturaPoster(playerSources: SourcesConfig, mediaSources: ProviderMediaConfigSources, dimensions: DimensionsConfig, ks?: string): void;
export { addKalturaPoster };
//# sourceMappingURL=poster.d.ts.map
