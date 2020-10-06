// @flow
if (!window._babelPolyfill) {
  require('@babel/polyfill');
}

export default class PolyfillManager {
  static _polyfills: Array<Function> = [];

  static register(polyfill: Function): void {
    PolyfillManager._polyfills.push(polyfill);
  }

  static installAll(): void {
    for (let i = 0; i < PolyfillManager._polyfills.length; i++) {
      PolyfillManager._polyfills[i].install();
    }
  }
}
