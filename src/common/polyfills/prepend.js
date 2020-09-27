// @flow
import PolyfillManager from './polyfill-manager';
import {getLogger} from '@playkit-js/playkit-js';

export default class PrependPolyfill {
  static id: string = 'prepend';
  static _logger: any = getLogger('PrependPolyfill');

  static install(): void {
    [Element.prototype, Document.prototype, DocumentFragment.prototype].forEach(function (item) {
      if (Object.prototype.hasOwnProperty.call(item, 'prepend')) {
        PrependPolyfill._logger.debug('No need to install polyfill on item', item);
        return;
      }
      PrependPolyfill._logger.debug('Installing polyfill on item', item);
      // $FlowFixMe
      Object.defineProperty(item, 'prepend', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function prepend() {
          var argArr = Array.prototype.slice.call(arguments),
            docFrag = document.createDocumentFragment();

          argArr.forEach(function (argItem) {
            var isNode = argItem instanceof Node;
            docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
          });

          this.insertBefore(docFrag, this.firstChild);
        }
      });
    });
  }
}

PolyfillManager.register(PrependPolyfill);
