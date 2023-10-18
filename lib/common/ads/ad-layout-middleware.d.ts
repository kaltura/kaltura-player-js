import { BaseMiddleware } from '@playkit-js/playkit-js';
import { AdsController } from '../controllers';
/**
 * Middleware implementation for ima plugin.
 * @class AdLayoutMiddleware
 * @param {Ima} context - The ima plugin context.
 * @private
 */
declare class AdLayoutMiddleware extends BaseMiddleware {
  /**
   * The id of the ima middleware.
   * @type {string}
   * @public
   * @memberof AdLayoutMiddleware
   */
  id: string;
  /**
   * The plugin context.
   * @member
   * @private
   * @memberof AdLayoutMiddleware
   */
  _context: AdsController;
  constructor(context: AdsController);
  /**
   * Load middleware handler.
   * @param {Function} next - The load play handler in the middleware chain.
   * @returns {void}
   * @memberof AdLayoutMiddleware
   */
  load(next: Function): void;
  /**
   * Play middleware handler.
   * @param {Function} next - The next play handler in the middleware chain.
   * @returns {void}
   * @memberof AdLayoutMiddleware
   */
  play(next: Function): void;
}
export { AdLayoutMiddleware };
//# sourceMappingURL=ad-layout-middleware.d.ts.map
