import { KalturaPlayer } from './kaltura-player';
import { FakeEventTarget } from '@playkit-js/playkit-js';

const Players = {};
/**
 * get all instantiated players
 * @returns {KalturaPlayers} - map of player ids and their respective instantiated player
 */
function getPlayers(): Record<string, KalturaPlayer> {
  return Players;
}

/**
 * get a player instance by id
 * @param {string} id - the player ID
 * @returns {KalturaPlayer | null} - the player if found by the supplied ID or null if key doesn't exist
 */
function getPlayer(id: string): KalturaPlayer | null {
  if (Players[id]) {
    return Players[id];
  }
  return null;
}

const proxyIgnoredProps: string[] = ['_remotePlayer', '_listeners', '_uiWrapper'];
const proxyHandler: any = {
  get(kp: KalturaPlayer, prop: string) {
    if (prop === 'destroy') {
      const playerId = kp.config.targetId;
      delete Players[playerId];
    }

    if (prop in FakeEventTarget.prototype || proxyIgnoredProps.includes(prop)) {
      return kp[prop];
    }
    if (kp._remotePlayer && prop in kp._remotePlayer) {
      return kp._remotePlayer[prop];
    }
    return kp[prop];
  },
  set(kp: KalturaPlayer, prop: string, value: any) {
    if (kp._remotePlayer && !proxyIgnoredProps.includes(prop)) {
      if (prop in kp._remotePlayer) {
        kp._remotePlayer[prop] = value;
      }
    } else {
      kp[prop] = value;
    }
    return true;
  }
};

const getPlayerProxy = (options: any): KalturaPlayer => {
  const player = new KalturaPlayer(options);
  const proxy = new Proxy(player, proxyHandler);
  Players[options.targetId] = proxy;
  return proxy;
};

export { getPlayerProxy, getPlayer, getPlayers };
