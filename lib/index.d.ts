import 'regenerator-runtime';
import '../assets/style.css';
import * as core from '@playkit-js/playkit-js';
import * as ui from '@playkit-js/playkit-js-ui';
import * as providers from '@playkit-js/playkit-js-providers';
import '@playkit-js/playkit-js-hls';
import '@playkit-js/playkit-js-dash';
import { getPlayers, getPlayer } from './proxy';
import { setup } from './setup';
import { cast } from './common/cast';
import { playlist } from './common/playlist';
import { KALTURA_PLAYER_START_TIME_QS } from './common/utils/setup-helpers';
import { Ad, AdBreak } from './common/ads';
import { BasePlugin, registerPlugin } from './common/plugins';
declare const PLAYER_NAME: string;
declare const PLAYER_TYPE: string;
declare const VERSION: string;
export { getPlayers, getPlayer, core, ui, providers, setup, cast, playlist, Ad, AdBreak, BasePlugin, registerPlugin, PLAYER_TYPE, VERSION, PLAYER_NAME, KALTURA_PLAYER_START_TIME_QS };
//# sourceMappingURL=index.d.ts.map
