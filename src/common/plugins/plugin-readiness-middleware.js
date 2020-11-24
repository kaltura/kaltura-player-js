//@flow

import {BaseMiddleware, getLogger} from '@playkit-js/playkit-js';
import {BasePlugin} from './base-plugin';
class PluginReadinessMiddleware extends BaseMiddleware {
  _plugins: Array<BasePlugin>;
  id: string = 'PluginReadinessMiddleware';
  static _logger = getLogger('PluginReadinessMiddleware');

  constructor(plugins: Array<BasePlugin>) {
    super();
    this._plugins = plugins;
    PluginReadinessMiddleware._logger.debug('plugins readiness', this._plugins);
  }

  /**
   * Load middleware handler.
   * @param {Function} next - The load handler in the middleware chain.
   * @returns {void}
   * @memberof PluginReadinessMiddleware
   */
  load(next: Function): void {
    this._checkNextSettle(0, next);
  }
  _checkNextSettle(index, next: Function) {
    if (index < this._plugins.length) {
      this.checkSettle(index, next);
    } else {
      this.callNext(next);
    }
  }
  checkSettle(index: number, next: Function) {
    const readyPromise = this._plugins[index].ready ? this._plugins[index].ready : Promise.resolve();
    readyPromise
      .then(() => {
        PluginReadinessMiddleware._logger.debug(`plugin ${this._plugins[index].name} ready promise resolved`);
        this._checkNextSettle(index + 1, next);
      })
      .catch(() => {
        PluginReadinessMiddleware._logger.debug(`plugin ${this._plugins[index].name} ready promise rejected`);
        this._checkNextSettle(index + 1, next);
      });
  }
  /**
   * Play middleware handler.
   * @param {Function} next - The play handler in the middleware chain.
   * @returns {void}
   * @memberof PluginReadinessMiddleware
   */
  play(next: Function): void {
    this.checkSettle(0, next);
  }
}
export {PluginReadinessMiddleware};
