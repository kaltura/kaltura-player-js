// @flow
import {Env, Utils, MediaType} from '@playkit-js/playkit-js';
import {getDirectManifestUri} from '../common/utils/external-stream-redirect-helper';

/**
 * Sets the default analytics plugin for the ovp player.
 * @param {KPOptionsObject} options - The player config.
 * @private
 * @returns {void}
 */
export function setDefaultAnalyticsPlugin(options: KPOptionsObject): void {
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
 * @param {KPOptionsObject} playerOptions - The player config.
 * @param {KPOptionsObject} mediaOptions - The media config.
 * @returns {Object} - config object
 */
export function getDefaultRedirectOptions(playerOptions: KPOptionsObject, mediaOptions: KPOptionsObject = {}): Object {
  const configObj = {};
  if (mediaOptions.sources && mediaOptions.sources.type === MediaType.LIVE && (Env.browser.name === 'IE' || Env.device.model === 'Chromecast')) {
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
  const playerRedirectExternalStreamsHandler = Utils.Object.getPropertyPath(playerOptions, 'sources.options.redirectExternalStreamsHandler');
  const mediaRedirectExternalStreamsHandler = Utils.Object.getPropertyPath(mediaOptions, 'sources.options.redirectExternalStreamsHandler');
  if (typeof playerRedirectExternalStreamsHandler !== 'function' && typeof mediaRedirectExternalStreamsHandler !== 'function') {
    Utils.Object.mergeDeep(configObj, {
      sources: {
        options: {
          redirectExternalStreamsHandler: getDirectManifestUri
        }
      }
    });
  }
  return configObj;
}
