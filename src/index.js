// @flow
import PolyfillManager from './common/polyfills/polyfill-manager';
import './common/polyfills/all';
import getLogger, {getLogLevel, LogLevel, setLogLevel} from './common/utils/logger';

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

const currentLogLevel = getLogLevel();
setLogLevel(LogLevel.INFO);
getLogger().log(`%c ${__NAME__} ${__VERSION__}`, 'color: #ff98f9;  font-size: large');
getLogger().log(`%c For more details see ${__PACKAGE_URL__}`, 'color: #ff98f9;');
setLogLevel(currentLogLevel);

PolyfillManager.installAll();

export {getPlayers, getPlayer, core, ui, providers, setup, cast, playlist, VERSION, NAME, PLAYER_NAME};
