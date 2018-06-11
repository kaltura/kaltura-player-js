// @flow
import {Utils} from 'playkit-js'

/**
 * Sets the default analytics plugin for the ovp player.
 * @param {KalturaPlayerOptionsObject} options - The player config.
 * @returns {void}
 */
export function setDefaultAnalyticsPlugin(options: KalturaPlayerOptionsObject): void {
  const kavaPlugin = Utils.Object.getPropertyPath(options, 'plugins.kava');
  if (!kavaPlugin) {
    Utils.Object.mergeDeep(options, {
      plugins: {
        kava: {}
      }
    });
  }
  const kanalyticsPlugin = Utils.Object.getPropertyPath(options, 'plugins.kanalytics');
  if (!kanalyticsPlugin) {
    Utils.Object.mergeDeep(options, {
      plugins: {
        kanalytics: {}
      }
    });
  }
  if (!kavaPlugin.disable && !kanalyticsPlugin.disable) {
    Object.assign(options.plugins.kanalytics, {hasKanalony: true});
  }
}
