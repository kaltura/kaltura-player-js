// @flow
import PolyfillManager from './polyfill-manager'
import LoggerFactory from '../utils/logger'

export default class PerformanceNowPolyfill {
  static id: string = 'performance.now';
  static _logger: any = LoggerFactory.getLogger('PerformanceNowPolyfill');

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
