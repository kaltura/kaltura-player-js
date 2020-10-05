// @flow
import PolyfillManager from './polyfill-manager';
import {getLogger} from '@playkit-js/playkit-js';

export default class PerformanceNowPolyfill {
  static id: string = 'performance.now';
  static _logger: any = getLogger('PerformanceNowPolyfill');

  static install(): void {
    if (global.performance && global.performance.now) {
      PerformanceNowPolyfill._logger.debug('No need to install polyfill');
      return;
    }
    PerformanceNowPolyfill._logger.debug('Installing polyfill');
    var startTime = Date.now();
    if (!global.performance) {
      global.performance = {};
    }
    global.performance.now = function () {
      return Date.now() - startTime;
    };
  }
}

PolyfillManager.register(PerformanceNowPolyfill);
