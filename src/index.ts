import '../assets/style.css';
import * as core from '@playkit-js/playkit-js';
import * as ui from '@playkit-js/playkit-js-ui';
import * as providers from '@playkit-js/playkit-js-providers';
// Import media source adapters
import '@playkit-js/playkit-js-hls';
import '@playkit-js/playkit-js-dash';

import { getPlayers, getPlayer } from './proxy';
import { KalturaPlayer } from './kaltura-player';
import { setup } from './setup';
import { cast } from './common/cast';
import { playlist } from './common/playlist';
import { KALTURA_PLAYER_START_TIME_QS } from './common/utils/setup-helpers';
import { Ad, AdBreak } from './common/ads';
import { BasePlugin, registerPlugin } from './common/plugins';

core['Ad'] = Ad;
core['AdBreak'] = AdBreak;
core['BasePlugin'] = BasePlugin;
core['registerPlugin'] = registerPlugin;

const PLAYER_NAME = __NAME__;
const PLAYER_TYPE = __PLAYER_TYPE__;
const VERSION = __VERSION__;

export * from './types';

export { KalturaPlayer, getPlayers, getPlayer, core, ui, providers, setup, cast, playlist, Ad, AdBreak, BasePlugin, registerPlugin, PLAYER_TYPE, VERSION, PLAYER_NAME, KALTURA_PLAYER_START_TIME_QS };
