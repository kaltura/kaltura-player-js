// @flow
import {Utils} from 'playkit-js'

/**
 * Sets the default analytics plugin for the ott player.
 * @param {PKPlayerOptionsObject} playerConfig - The player config.
 * @returns {void}
 */
export function setDefaultAnalyticsPlugin(playerConfig: PKPlayerOptionsObject): void {
  const ottAnalyticsPlugin = Utils.Object.getPropertyPath(playerConfig, 'plugins.ottAnalytics');
  if (!ottAnalyticsPlugin) {
    Utils.Object.mergeDeep(playerConfig, {
      plugins: {
        ottAnalytics: {}
      }
    });
  }
}
