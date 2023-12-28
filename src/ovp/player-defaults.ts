import { Env, Utils, MediaType } from '@playkit-js/playkit-js';
import { getRedirectExternalStreamsHandler } from '../common/utils/external-stream-redirect-helper';
import { KalturaPlayerConfig } from "../types";

/**
 * Sets the default analytics plugin for the ovp player.
 * @param {KalturaPlayerConfig} options - The player config.
 * @private
 * @returns {void}
 */
export function setDefaultAnalyticsPlugin(options: KalturaPlayerConfig): void {
  let kavaPlugin = Utils.Object.getPropertyPath(options, 'plugins.kava');
  if (!kavaPlugin) {
    kavaPlugin = Utils.Object.mergeDeep(options, {
      plugins: {
        kava: {}
      }
    });
  }
}

/**
 * get the default config for forcing external stream redirect.
 * @public
 * @param {KalturaPlayerConfig} playerOptions - The player config.
 * @param {KalturaPlayerConfig} mediaOptions - The media config.
 * @returns {Object} - config object
 */
export function getDefaultRedirectOptions(playerOptions: Partial<KalturaPlayerConfig>, mediaOptions?: KalturaPlayerConfig): any {
  const configObj = {};
  if (mediaOptions?.sources?.type === MediaType.LIVE && (Env.browser.name === 'IE' || Env.device.model === 'Chromecast')) {
    const playerForceRedirectExternalStreams = Utils.Object.getPropertyPath(playerOptions, 'sources.options.forceRedirectExternalStreams');
    const mediaForceRedirectExternalStreams = Utils.Object.getPropertyPath(mediaOptions, 'sources.options.forceRedirectExternalStreams');
    if (typeof playerForceRedirectExternalStreams !== 'boolean' && typeof mediaForceRedirectExternalStreams !== 'boolean') {
      Utils.Object.mergeDeep(configObj, {
        sources: {
          options: {
            forceRedirectExternalStreams: true
          }
        }
      });
    }
  }
  return Utils.Object.mergeDeep(configObj, getRedirectExternalStreamsHandler(playerOptions, mediaOptions));
}
