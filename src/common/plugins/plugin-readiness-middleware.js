//@flow

import {BaseMiddleware} from '@playkit-js/playkit-js';
import {BasePlugin} from './base-plugin';
class PluginReadinessMiddleware extends BaseMiddleware {
  _plugins: Array<BasePlugin>;
  id: string = 'PluginReadinessMiddleware';
  constructor(plugins: Array<BasePlugin>) {
    super();
    this._plugins = plugins;
  }

  /**
   * Load middleware handler.
   * @param {Function} next - The load handler in the middleware chain.
   * @returns {void}
   * @memberof PluginReadinessMiddleware
   */
  load(next: Function): void {
    Promise.all(this._plugins.map(plugin => plugin.loadReady))
      .then(() => {
        this.callNext(next);
      })
      .catch(() => {
        this.callNext(next);
      });
  }

  /**
   * Play middleware handler.
   * @param {Function} next - The play handler in the middleware chain.
   * @returns {void}
   * @memberof PluginReadinessMiddleware
   */
  play(next: Function): void {
    Promise.all(this._plugins.map(plugin => plugin.playReady))
      .then(() => {
        this.callNext(next);
      })
      .catch(() => {
        this.callNext(next);
      });
  }
}
export {PluginReadinessMiddleware};
