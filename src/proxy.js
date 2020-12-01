// @flow
import {KalturaPlayer} from './kaltura-player';
import {FakeEventTarget} from '@playkit-js/playkit-js';
import {PluginsConfigure} from './common/plugins';

const Players: KalturaPlayers = {};
/**
 * get all instantiated players
 * @returns {KalturaPlayers} - map of player ids and their respective instantiated player
 */
function getPlayers(): KalturaPlayers {
  return Players;
}

/**
 * get a player instance by id
 * @param {string} id - the player ID
 * @returns {KalturaPlayer | null} - the player if found by the supplied ID or null if key doesn't exist
 */
function getPlayer(id: string): ?KalturaPlayer {
  if (Players[id]) {
    return Players[id];
  }
  return null;
}

const proxyIgnoredProps: Array<string> = ['_remotePlayer', '_listeners', '_uiWrapper'];
const proxyHandler: Object = {
  get(kp: KalturaPlayer, prop: string) {
    if (prop === 'destroy') {
      const playerId = kp.config.targetId;
      delete Players[playerId];
    }

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

const getPlayerProxy = (options: KPOptionsObject, pluginsConfigure: PluginsConfigure) => {
  const player = new KalturaPlayer(options, pluginsConfigure);
  const proxy = new Proxy(player, proxyHandler);
  Players[options.targetId] = proxy;
  return proxy;
};

export {getPlayerProxy, getPlayer, getPlayers};
