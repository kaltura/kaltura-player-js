// @flow
import {Utils} from 'playkit-js'

/**
 * Sets the default analytics plugin for the ott player.
 * @param {KalturaPlayerOptionsObject} options - The player config.
 * @returns {void}
 */
export function setDefaultAnalyticsPlugin(options: KalturaPlayerOptionsObject): void {
  const ottAnalyticsPlugin = Utils.Object.getPropertyPath(options, 'plugins.ottAnalytics');
  if (!ottAnalyticsPlugin) {
    Utils.Object.mergeDeep(options, {
      plugins: {
        ottAnalytics: {}
      }
    });
  }
}
