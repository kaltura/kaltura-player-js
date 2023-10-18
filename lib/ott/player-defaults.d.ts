import { KalturaPlayerConfig } from '../types/kaltura-player-options';
/**
 * Sets the default analytics plugin for the ott player.
 * @param {KPOptionsObject} options - The player config.
 * @private
 * @returns {void}
 */
export declare function setDefaultAnalyticsPlugin(options: KalturaPlayerConfig): void;
/**
 * get the default config for forcing external stream redirect.
 * @public
 * @param {KPOptionsObject} playerOptions - The player config.
 * @param {KPOptionsObject} mediaOptions - The media config.
 * @returns {Object} - config object
 */
export declare function getDefaultRedirectOptions(playerOptions: KalturaPlayerConfig, mediaOptions?: KalturaPlayerConfig | {}): Object;
//# sourceMappingURL=player-defaults.d.ts.map
