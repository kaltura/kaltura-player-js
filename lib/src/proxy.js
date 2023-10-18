'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.getPlayers = exports.getPlayer = exports.getPlayerProxy = void 0;
var kaltura_player_1 = require('./kaltura-player');
var playkit_js_1 = require('@playkit-js/playkit-js');
var Players = {};
/**
 * get all instantiated players
 * @returns {KalturaPlayers} - map of player ids and their respective instantiated player
 */
function getPlayers() {
  return Players;
}
exports.getPlayers = getPlayers;
/**
 * get a player instance by id
 * @param {string} id - the player ID
 * @returns {KalturaPlayer | null} - the player if found by the supplied ID or null if key doesn't exist
 */
function getPlayer(id) {
  if (Players[id]) {
    return Players[id];
  }
  return null;
}
exports.getPlayer = getPlayer;
var proxyIgnoredProps = ['_remotePlayer', '_listeners', '_uiWrapper'];
var proxyHandler = {
  get: function (kp, prop) {
    if (prop === 'destroy') {
      // @ts-ignore
      var playerId = kp.config.targetId;
      delete Players[playerId];
    }
    if (prop in playkit_js_1.FakeEventTarget.prototype || proxyIgnoredProps.includes(prop)) {
      // $FlowFixMe
      return kp[prop];
    }
    // @ts-ignore
    if (kp._remotePlayer && prop in kp._remotePlayer) {
      // @ts-ignore
      return kp._remotePlayer[prop];
    }
    // $FlowFixMe
    return kp[prop];
  },
  set: function (kp, prop, value) {
    // @ts-ignore
    if (kp._remotePlayer && !proxyIgnoredProps.includes(prop)) {
      // @ts-ignore
      if (prop in kp._remotePlayer) {
        // @ts-ignore
        kp._remotePlayer[prop] = value;
      }
    } else {
      // $FlowFixMe
      kp[prop] = value;
    }
    return true;
  }
};
var getPlayerProxy = function (options) {
  var player = new kaltura_player_1.KalturaPlayer(options);
  var proxy = new Proxy(player, proxyHandler);
  Players[options.targetId] = proxy;
  return proxy;
};
exports.getPlayerProxy = getPlayerProxy;
//# sourceMappingURL=proxy.js.map
