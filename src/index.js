// @flow
import PolyfillManager from './polyfills/polyfill-manager';
import './polyfills/all';

declare var __VERSION__: string;
declare var __NAME__: string;
declare var __PACKAGE_URL__: string;
const VERSION = __VERSION__;
const NAME = __NAME__;

// Import core
import * as core from '@playkit-js/playkit-js';
// Import ui
import {UI, registerUI} from './ui-wrapper';
export {UI as ui};
// Import setup method
import {setup} from './setup';
import {getPlayers, getPlayer} from './proxy';
// Import cast framework
import {cast} from './cast';
// Import playlist
import {playlist} from './playlist';
//Import provider-manager
import * as providers from './provider-manager';

PolyfillManager.installAll();

export {getPlayers, getPlayer, core, registerUI, providers, setup, cast, playlist, VERSION, NAME};
