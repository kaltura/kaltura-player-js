'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.KALTURA_PLAYER_START_TIME_QS = exports.PLAYER_NAME = exports.VERSION = exports.PLAYER_TYPE = exports.setup = exports.ui = exports.core = exports.getPlayer = exports.getPlayers = void 0;
// TEMP - remove this and from package.json: (and from webpack from plugins section)
//  "@babel/runtime": "^7.23.1",
//  "@babel/plugin-transform-runtime": "^7.22.15",
require('regenerator-runtime');
var core = require('@playkit-js/playkit-js');
exports.core = core;
var ui = require('@playkit-js/playkit-js-ui');
exports.ui = ui;
var proxy_1 = require('./proxy');
Object.defineProperty(exports, 'getPlayers', {
  enumerable: true,
  get: function () {
    return proxy_1.getPlayers;
  }
});
Object.defineProperty(exports, 'getPlayer', {
  enumerable: true,
  get: function () {
    return proxy_1.getPlayer;
  }
});
var setup_1 = require('./setup');
Object.defineProperty(exports, 'setup', {
  enumerable: true,
  get: function () {
    return setup_1.setup;
  }
});
var setup_helpers_1 = require('./common/utils/setup-helpers');
Object.defineProperty(exports, 'KALTURA_PLAYER_START_TIME_QS', {
  enumerable: true,
  get: function () {
    return setup_helpers_1.KALTURA_PLAYER_START_TIME_QS;
  }
});
var PLAYER_NAME = __NAME__;
exports.PLAYER_NAME = PLAYER_NAME;
var PLAYER_TYPE = __PLAYER_TYPE__;
exports.PLAYER_TYPE = PLAYER_TYPE;
var VERSION = __VERSION__;
exports.VERSION = VERSION;
// export class bulbul {
//     private ffff!: string;
// }
//# sourceMappingURL=index.js.map
