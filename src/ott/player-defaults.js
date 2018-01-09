// @flow
import {Utils} from 'playkit-js'

/**
 * Sets the default analytics plugin for the ott player.
 * @param {Object} playerConfig - The player config.
 * @returns {void}
 */
export function setDefaultAnalyticsPlugin(playerConfig: Object): void {
  const ottAnalyticsPlugin = Utils.Object.getPropertyPath(playerConfig, 'plugins.ottAnalytics');
  if (!ottAnalyticsPlugin) {
    Utils.Object.mergeDeep(playerConfig, {
      plugins: {
        ottAnalytics: {}
      }
    });
  }
}
