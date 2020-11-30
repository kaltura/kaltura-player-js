import {BasePlugin} from '../../../../../src/common/plugins';
import {Utils} from '@playkit-js/playkit-js';

export default class AsyncResolvePlugin extends BasePlugin {
  static DELAY_ASYNC = 500;
  static isValid(): boolean {
    return true;
  }
  promise: DeferredPromise;

  constructor(name: string, player: Object, config: Object) {
    super(name, player, config);
    this.promise = Utils.Object.defer();
    setTimeout(() => {
      this.promise.resolve();
    }, AsyncResolvePlugin.DELAY_ASYNC);
  }
  get ready(): Promise<*> {
    return this.promise;
  }
}
