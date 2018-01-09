// @flow
import {Utils} from 'playkit-js'

/**
 * Sets the default analytics plugin for the ovp player.
 * @param {Object} playerConfig - The player config.
 * @returns {void}
 */
export function setDefaultAnalyticsPlugin(playerConfig: Object): void {
  const kanalyticsPlugin = Utils.Object.getPropertyPath(playerConfig, 'plugins.kanalytics');
  if (!kanalyticsPlugin) {
    Utils.Object.mergeDeep(playerConfig, {
      plugins: {
        kanalytics: {}
      }
    });
  }
}
