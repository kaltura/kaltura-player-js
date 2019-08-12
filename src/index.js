// @flow
import PolyfillManager from './common/polyfills/polyfill-manager';
import './common/polyfills/all';

declare var __VERSION__: string;
declare var __NAME__: string;
declare var __PACKAGE_URL__: string;
const PLAYER_NAME = __NAME__;
const VERSION = __VERSION__;
const NAME = __NAME__;

// Import core
import * as core from '@playkit-js/playkit-js';
// Import ui
import {UI, registerUI} from './common/ui-wrapper';
export {UI as ui};
// Import setup method
import {setup} from './setup';
import {getPlayers, getPlayer} from './proxy';
// Import cast framework
import {cast} from './common/cast';
// Import playlist
import {playlist} from './common/playlist';
//Import provider-manager
import * as providers from './common/provider-manager';

PolyfillManager.installAll();

export {getPlayers, getPlayer, core, registerUI, providers, setup, cast, playlist, VERSION, NAME, PLAYER_NAME};
