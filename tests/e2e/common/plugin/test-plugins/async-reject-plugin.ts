import {BasePlugin} from '../../../../../src';
import {Utils} from '@playkit-js/playkit-js';
import {KalturaPlayer} from '../../../../../src/kaltura-player';
import {DeferredPromise} from '../../../../../src/types/utils/deferred-promise';

export default class AsyncRejectPlugin extends BasePlugin {
  static DELAY_ASYNC = 300;
  static isValid(): boolean {
    return true;
  }

  promise: DeferredPromise;

  constructor(name: string, player: KalturaPlayer, config: Object) {
    super(name, player, config);
    this.promise = Utils.Object.defer();
    setTimeout(() => {
      this.promise.reject();
    }, AsyncRejectPlugin.DELAY_ASYNC);
  }


  // @ts-ignore
  get ready(): Promise<any> {
    // @ts-ignore
    return this.promise;
  }
}
