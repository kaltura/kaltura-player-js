// @flow
import getLogger from '../utils/logger'

if (!window._babelPolyfill){
  require("babel-polyfill");
}

export default class PolyfillManager {
  static _polyfills: Array<Function> = [];
  static _logger: any = getLogger('PolyfillManager');

  static register(polyfill: Function): void {
    PolyfillManager._logger.debug('Register <' + polyfill.id + '> polyfill');
    PolyfillManager._polyfills.push(polyfill);
  }

  static installAll(): void {
    PolyfillManager._logger.debug('Installing all polyfills');
    for (let i = 0; i < PolyfillManager._polyfills.length; i++) {
      PolyfillManager._polyfills[i].install();
    }
  }
}
