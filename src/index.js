// @flow
import PolyfillManager from './common/polyfills/polyfill-manager';
import './common/polyfills/all';
// Import core
import * as core from '@playkit-js/playkit-js';
// Import ui
import * as ui from '@playkit-js/playkit-js-ui';
// Import provider
import * as providers from 'playkit-js-providers';
// Import media source adapters
import '@playkit-js/playkit-js-hls';
import '@playkit-js/playkit-js-dash';
// Import analytics plugin
import 'playkit-js-analytics';
// Import shaka-player
import * as shaka from 'shaka-player';
// Import setup method
import {setup} from './setup';
import {getPlayers, getPlayer} from './proxy';
// Import cast framework
import {cast} from './common/cast';
// Import playlist
import {playlist} from './common/playlist';

declare var __VERSION__: string;
declare var __NAME__: string;
declare var __PACKAGE_URL__: string;
declare var __PLAYER_TYPE__: string;

const PLAYER_NAME = __NAME__;
const PLAYER_TYPE = __PLAYER_TYPE__;
const VERSION = __VERSION__;
PolyfillManager.installAll();

export {
  getPlayers,
  getPlayer,
  core,
  ui,
  providers,
  setup,
  shaka,
  cast,
  playlist,
  PLAYER_TYPE,
  VERSION,
  PLAYER_NAME
};
