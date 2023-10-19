import {BasePlugin} from '../../../../../src';
import {Utils} from '@playkit-js/playkit-js';
import {DeferredPromise} from '../../../../../src/types/utils/deferred-promise';
import {KalturaPlayer} from '../../../../../src/kaltura-player';

export default class AsyncResolvePlugin extends BasePlugin {
  static DELAY_ASYNC = 500;
  static isValid(): boolean {
    return true;
  }
  promise: DeferredPromise;

  constructor(name: string, player: KalturaPlayer, config: Object) {
    super(name, player, config);
    this.promise = Utils.Object.defer();
    setTimeout(() => {
      this.promise.resolve();
    }, AsyncResolvePlugin.DELAY_ASYNC);
  }
  // @ts-ignore
  get ready(): Promise<any> {
    // @ts-ignore
    return this.promise;
  }
}
