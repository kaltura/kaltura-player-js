// @flow
import {BaseMiddleware} from '@playkit-js/playkit-js';
import {PrebidManager} from './prebid';

/**
 * Middleware implementation for ima plugin.
 * @class PrebidMiddleware
 * @param {Ima} context - The ima plugin context.
 * @private
 */
class PrebidMiddleware extends BaseMiddleware {
  /**
   * The id of the ima middleware.
   * @type {string}
   * @public
   * @memberof PrebidMiddleware
   */
  id: string = 'PrebidMiddleware';
  /**
   * The plugin context.
   * @member
   * @private
   * @memberof PrebidMiddleware
   */
  _context: PrebidManager;

  constructor(context: PrebidManager) {
    super();
    this._context = context;
  }

  /**
   * Load middleware handler.
   * @param {Function} next - The load play handler in the middleware chain.
   * @returns {void}
   * @memberof PrebidMiddleware
   */
  load(next: Function): void {
    this._context.bidPromise.finally(() => this.callNext(next));
  }

  /**
   * Play middleware handler.
   * @param {Function} next - The next play handler in the middleware chain.
   * @returns {void}
   * @memberof PrebidMiddleware
   */
  play(next: Function): void {
    this._context.bidPromise.finally(() => this.callNext(next));
  }
}

export {PrebidMiddleware};
