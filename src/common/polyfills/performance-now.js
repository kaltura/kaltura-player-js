// @flow
import PolyfillManager from './polyfill-manager';

export default class PerformanceNowPolyfill {
  static id: string = 'performance.now';

  static install(): void {
    if (global.performance && global.performance.now) {
      return;
    }
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
