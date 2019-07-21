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
import * as ui from '@playkit-js/playkit-js-ui';
// Import setup method
import {setup} from './setup';
import {getPlayers, getPlayer} from './proxy';
// Import cast framework
import {cast} from './common/cast';
// Import playlist
import {playlist} from './common/playlist';
//Import provider-manager
import * as providers from './common/provider-manager';
//Import UI manager helper
import {registerUIManager} from './common/ui-wrapper';

PolyfillManager.installAll();

export {getPlayers, getPlayer, core, ui, registerUIManager, providers, setup, cast, playlist, VERSION, NAME, PLAYER_NAME};
