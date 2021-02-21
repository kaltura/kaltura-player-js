// @flow
import {Utils} from '@playkit-js/playkit-js';
import {getRedirectExternalStreamsHandler} from '../common/utils/external-stream-redirect-helper';

/**
 * Sets the default analytics plugin for the ott player.
 * @param {KPOptionsObject} options - The player config.
 * @private
 * @returns {void}
 */
export function setDefaultAnalyticsPlugin(options: KPOptionsObject): void {
  const kavaPlugin = Utils.Object.getPropertyPath(options, 'plugins.kava');
  if (!kavaPlugin) {
    Utils.Object.mergeDeep(options, {
      plugins: {
        kava: {
          disable: true
        }
      }
    });
  }
  const ottAnalyticsPlugin = Utils.Object.getPropertyPath(options, 'plugins.ottAnalytics');
  if (!ottAnalyticsPlugin) {
    Utils.Object.mergeDeep(options, {
      plugins: {
        ottAnalytics: {}
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
  return Utils.Object.mergeDeep({}, getRedirectExternalStreamsHandler(playerOptions, mediaOptions));
}
