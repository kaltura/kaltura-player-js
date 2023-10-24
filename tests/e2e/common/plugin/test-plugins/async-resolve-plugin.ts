import {BasePlugin} from '../../../../../src';
import {Utils} from '@playkit-js/playkit-js';
import {DeferredPromise} from '../../../../../src/types/utils/deferred-promise';
import {KalturaPlayer} from '../../../../../src/kaltura-player';

export default class AsyncResolvePlugin extends BasePlugin {
  public static DELAY_ASYNC = 500;
  public static isValid(): boolean {
    return true;
  }
  private promise: DeferredPromise;

  constructor(name: string, player: KalturaPlayer, config: any) {
    super(name, player, config);
    this.promise = Utils.Object.defer();
    setTimeout(() => {
      this.promise.resolve();
    }, AsyncResolvePlugin.DELAY_ASYNC);
  }
  // eslint-disable-next-line  @typescript-eslint/ban-ts-comment
  // @ts-ignore
  public get ready(): Promise<any> {
    // eslint-disable-next-line  @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.promise;
  }
}
