// @flow
import {Utils} from 'playkit-js'

/**
 * Sets the default analytics plugin for the ovp player.
 * @param {PKPlayerOptionsObject} playerConfig - The player config.
 * @returns {void}
 */
export function setDefaultAnalyticsPlugin(playerConfig: PKPlayerOptionsObject): void {
  const kavaPlugin = Utils.Object.getPropertyPath(playerConfig, 'plugins.kava');
  if (!kavaPlugin) {
    Utils.Object.mergeDeep(playerConfig, {
      plugins: {
        kava: {}
      }
    });
  }
  const kanalyticsPlugin = Utils.Object.getPropertyPath(playerConfig, 'plugins.kanalytics');
  if (!kanalyticsPlugin) {
    Utils.Object.mergeDeep(playerConfig, {
      plugins: {
        kanalytics: {}
      }
    });
  }
  Object.assign(playerConfig.plugins.kanalytics, {hasKanalony: true});
}
