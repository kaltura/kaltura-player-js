import { BaseMiddleware, getLogger } from '@playkit-js/playkit-js';
import { BasePlugin } from './base-plugin';
class PluginReadinessMiddleware extends BaseMiddleware {
  private readonly _plugins: Array<BasePlugin<any>>;
  public id: string = 'PluginReadinessMiddleware';
  private static _logger = getLogger('PluginReadinessMiddleware');

  constructor(plugins: Array<BasePlugin<any>>) {
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
  public load(next: () => any): void {
    this._checkNextSettle(0, next);
  }
  private _checkNextSettle(index: number, next: () => any): void {
    if (index < this._plugins.length) {
      this._checkSettle(index, next);
    } else {
      // eslint-disable-next-line  @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.callNext(next);
    }
  }

  private _checkSettle(index: number, next: () => any): void {
    // eslint-disable-next-line  @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const readyPromise = this._plugins[index].ready
      ? // eslint-disable-next-line  @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this._plugins[index].ready
      : Promise.resolve();
    readyPromise
      .then(() => {
        PluginReadinessMiddleware._logger.debug(
          `plugin ${this._plugins[index].name} ready promise resolved`
        );
        this._checkNextSettle(index + 1, next);
      })
      .catch(() => {
        PluginReadinessMiddleware._logger.debug(
          `plugin ${this._plugins[index].name} ready promise rejected`
        );
        this._checkNextSettle(index + 1, next);
      });
  }
  /**
   * Play middleware handler.
   * @param {Function} next - The play handler in the middleware chain.
   * @returns {void}
   * @memberof PluginReadinessMiddleware
   */
  public play(next: () => any): void {
    this._checkNextSettle(0, next);
  }
}
export { PluginReadinessMiddleware };
