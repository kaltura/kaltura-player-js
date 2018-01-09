// @flow
import {Utils} from 'playkit-js'

/**
 * Sets the default analytics plugin for the ovp player.
 * @param {PKPlayerOptionsObject} playerConfig - The player config.
 * @returns {void}
 */
export function setDefaultAnalyticsPlugin(playerConfig: PKPlayerOptionsObject): void {
  const kanalyticsPlugin = Utils.Object.getPropertyPath(playerConfig, 'plugins.kanalytics');
  if (!kanalyticsPlugin) {
    Utils.Object.mergeDeep(playerConfig, {
      plugins: {
        kanalytics: {}
      }
    });
  }
}
