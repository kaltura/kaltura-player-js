// @flow
import {Utils} from 'playkit-js'

/**
 * Sets the default analytics plugin for the ovp player.
 * @param {KalturaPlayerOptionsObject} options - The player config.
 * @returns {void}
 */
export function setDefaultAnalyticsPlugin(options: KalturaPlayerOptionsObject): void {
  const kanalyticsPlugin = Utils.Object.getPropertyPath(options, 'plugins.kanalytics');
  if (!kanalyticsPlugin) {
    Utils.Object.mergeDeep(options, {
      plugins: {
        kanalytics: {}
      }
    });
  }
}
