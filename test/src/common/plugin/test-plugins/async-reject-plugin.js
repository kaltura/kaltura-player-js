import {BasePlugin} from '../../../../../src/common/plugins';

export default class AsyncRejectPlugin extends BasePlugin {
  static DELAY_ASYNC = 300;
  static isValid(): boolean {
    return true;
  }

  get ready(): Promise<*> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject();
      }, AsyncRejectPlugin.DELAY_ASYNC);
    });
  }
}
