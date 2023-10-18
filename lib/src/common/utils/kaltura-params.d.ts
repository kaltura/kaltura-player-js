import { KalturaPlayer } from '../../kaltura-player';
import { PartialKPOptionsObject } from '../../../types/kaltura-player-options';
/**
 * @param {Player} player - player
 * @param {PartialKPOptionsObject} playerConfig - player config
 * @return {void}
 * @private
 */
declare function handleSessionId(player: KalturaPlayer, playerConfig: PartialKPOptionsObject): void;
/**
 * @param {string} url - url
 * @param {string} sessionId - session id
 * @param {string} paramName - optional param name of the session id
 * @return {string} - the url with the new sessionId
 * @private
 */
declare function updateSessionIdInUrl(url: string, sessionId?: string, paramName?: string): string;
/**
 * @return {string} - The referrer
 * @private
 */
declare function getReferrer(): string;
/**
 * @param {string} url - url
 * @return {string} - the url with the referrer appended in the query params
 * @private
 */
declare function addReferrer(url: string): string;
/**
 * @param {string} url - url
 * @param {PartialKPOptionsObject} playerConfig - player config
 * @return {string} - the url with the uiconf id appended in the query params
 * @private
 */
declare function addUIConfId(url: string, playerConfig: PartialKPOptionsObject): string;
/**
 * @param {string} url - url
 * @param {string} productVersion - product version
 * @return {string} - the url with the client tag appended in the query params
 * @private
 */
declare function addClientTag(url: string, productVersion?: string): string;
/**
 * Adding Kaltura specific params to player config and player sources.
 * @param {Player} player - player
 * @param {PartialKPOptionsObject} playerConfig - player config
 * @return {void}
 * @private
 */
declare function addKalturaParams(player: KalturaPlayer, playerConfig: PartialKPOptionsObject): void;
export { addKalturaParams, handleSessionId, updateSessionIdInUrl, getReferrer, addReferrer, addClientTag, addUIConfId };
//# sourceMappingURL=kaltura-params.d.ts.map
