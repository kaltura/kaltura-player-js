import { BaseMiddleware } from '@playkit-js/playkit-js';
import { BasePlugin } from './base-plugin';
declare class PluginReadinessMiddleware extends BaseMiddleware {
  _plugins: Array<BasePlugin>;
  id: string;
  static _logger: any;
  constructor(plugins: Array<BasePlugin>);
  /**
   * Load middleware handler.
   * @param {Function} next - The load handler in the middleware chain.
   * @returns {void}
   * @memberof PluginReadinessMiddleware
   */
  load(next: Function): void;
  _checkNextSettle(index: number, next: Function): void;
  _checkSettle(index: number, next: Function): void;
  /**
   * Play middleware handler.
   * @param {Function} next - The play handler in the middleware chain.
   * @returns {void}
   * @memberof PluginReadinessMiddleware
   */
  play(next: Function): void;
}
export { PluginReadinessMiddleware };
//# sourceMappingURL=plugin-readiness-middleware.d.ts.map
