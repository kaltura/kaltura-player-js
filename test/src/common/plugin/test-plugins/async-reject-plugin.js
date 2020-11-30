import {BasePlugin} from '../../../../../src/common/plugins';
import {Utils} from '@playkit-js/playkit-js';

export default class AsyncRejectPlugin extends BasePlugin {
  static DELAY_ASYNC = 300;
  static isValid(): boolean {
    return true;
  }

  promise: DeferredPromise;

  constructor(name: string, player: Object, config: Object) {
    super(name, player, config);
    this.promise = Utils.Object.defer();
    setTimeout(() => {
      this.promise.reject();
    }, AsyncRejectPlugin.DELAY_ASYNC);
  }
  get ready(): Promise<*> {
    return this.promise;
  }
}
