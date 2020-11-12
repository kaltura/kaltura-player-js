// @flow
import {Env, Utils} from '@playkit-js/playkit-js';

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
 * @param {KPOptionsObject} options - The player config.
 * @returns {Object} - config object
 */
export function getDefaultRedirectOptions(options: KPOptionsObject): Object {
  const configObj = {};
  if (Env.browser.name === 'IE') {
    const forceRedirectExternalStreams = Utils.Object.getPropertyPath(options, 'sources.options.forceRedirectExternalStreams');
    if (typeof forceRedirectExternalStreams !== 'boolean') {
      configObj.sources = {
        options: {
          forceRedirectExternalStreams: true
        }
      };
    }
  }
  return configObj;
}
