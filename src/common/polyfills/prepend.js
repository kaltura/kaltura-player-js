// @flow
import PolyfillManager from './polyfill-manager';
import getLogger from '../utils/logger';

export default class PrependPolyfill {
  static id: string = 'prepend';
  static _logger: any = getLogger('PrependPolyfill');

  static install(): void {
    const parent = document.createElement('div');
    if (parent.prepend) {
      PrependPolyfill._logger.debug('No need to install polyfill');
      return;
    }
    PrependPolyfill._logger.debug('Installing polyfill');
    (function(arr) {
      arr.forEach(function(item) {
        if (item.hasOwnProperty('prepend')) {
          return;
        }
        Object.defineProperty(item, 'prepend', {
          configurable: true,
          enumerable: true,
          writable: true,
          value: function prepend() {
            var argArr = Array.prototype.slice.call(arguments),
              docFrag = document.createDocumentFragment();

            argArr.forEach(function(argItem) {
              var isNode = argItem instanceof Node;
              docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
            });

            this.insertBefore(docFrag, this.firstChild);
          }
        });
      });
    })([Element.prototype, Document.prototype, DocumentFragment.prototype]);
  }
}

PolyfillManager.register(PrependPolyfill);
