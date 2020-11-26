import {BasePlugin} from '../../../../../src/common/plugins';

export default class AsyncResolvePlugin extends BasePlugin {
  static DELAY_ASYNC = 500;
  static isValid(): boolean {
    return true;
  }

  get ready(): Promise<*> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, AsyncResolvePlugin.DELAY_ASYNC);
    });
  }
}
