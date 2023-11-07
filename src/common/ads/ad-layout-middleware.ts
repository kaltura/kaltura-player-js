import { BaseMiddleware } from '@playkit-js/playkit-js';
import { AdsController } from '../controllers';

/**
 * Middleware implementation for ima plugin.
 * @class AdLayoutMiddleware
 * @param {Ima} context - The ima plugin context.
 * @private
 */
class AdLayoutMiddleware extends BaseMiddleware {
  /**
   * The id of the ima middleware.
   * @type {string}
   * @public
   * @memberof AdLayoutMiddleware
   */
  public id: string = 'AdLayoutMiddleware';
  /**
   * The plugin context.
   * @member
   * @private
   * @memberof AdLayoutMiddleware
   */
  public _context: AdsController;

  constructor(context: AdsController) {
    super();
    this._context = context;
  }

  /**
   * Load middleware handler.
   * @param {Function} next - The load play handler in the middleware chain.
   * @returns {void}
   * @memberof AdLayoutMiddleware
   */
  public load(next: () => void): void {
    // eslint-disable-next-line  @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._context.prerollReady.then(() => this.callNext(next));
  }

  /**
   * Play middleware handler.
   * @param {Function} next - The next play handler in the middleware chain.
   * @returns {void}
   * @memberof AdLayoutMiddleware
   */
  public play(next: () => void): void {
    // eslint-disable-next-line  @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._context.prerollReady.then(() => this.callNext(next));
  }
}

export { AdLayoutMiddleware };
