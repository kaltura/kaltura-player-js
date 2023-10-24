import {BasePlugin} from '../../../../../src';
import {Utils} from '@playkit-js/playkit-js';
import {KalturaPlayer} from '../../../../../src/kaltura-player';
import {DeferredPromise} from '../../../../../src/types/utils/deferred-promise';

export default class AsyncRejectPlugin extends BasePlugin {
  public static DELAY_ASYNC = 300;
  public static isValid(): boolean {
    return true;
  }

  private promise: DeferredPromise;

  constructor(name: string, player: KalturaPlayer, config: any) {
    super(name, player, config);
    this.promise = Utils.Object.defer();
    setTimeout(() => {
      this.promise.reject();
    }, AsyncRejectPlugin.DELAY_ASYNC);
  }

  // eslint-disable-next-line  @typescript-eslint/ban-ts-comment
  // @ts-ignore
  public get ready(): Promise<any> {
    // eslint-disable-next-line  @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.promise;
  }
}
