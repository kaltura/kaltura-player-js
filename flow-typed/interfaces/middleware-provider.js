// @flow
import BaseMiddleware from '@playkit-js/playkit-js';

declare interface IMiddlewareProvider {
  getMiddlewareImpl(): BaseMiddleware;
}
