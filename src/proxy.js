// @flow
import {KalturaPlayer} from './kaltura-player';
import {FakeEventTarget} from '@playkit-js/playkit-js';

const proxyIgnoredProps: Array<string> = ['_remotePlayer', '_listeners', '_uiWrapper'];
const proxyHandler: Object = {
  get(kp: KalturaPlayer, prop: string) {
    if (prop in FakeEventTarget.prototype || proxyIgnoredProps.includes(prop)) {
      // $FlowFixMe
      return kp[prop];
    }
    if (kp._remotePlayer && prop in kp._remotePlayer) {
      return kp._remotePlayer[prop];
    }
    // $FlowFixMe
    return kp[prop];
  },
  set(kp: KalturaPlayer, prop: string, value: any) {
    if (kp._remotePlayer && !proxyIgnoredProps.includes(prop)) {
      if (prop in kp._remotePlayer) {
        kp._remotePlayer[prop] = value;
      }
    } else {
      // $FlowFixMe
      kp[prop] = value;
    }
    return true;
  }
};

const getPlayerProxy: KalturaPlayer = (options: KPOptionsObject) => {
  const player = new KalturaPlayer(options);
  return new Proxy(player, proxyHandler);
};

export {getPlayerProxy};
