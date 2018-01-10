// @flow
import PolyfillManager from './common/polyfills/polyfill-manager'
import './common/polyfills/all'
import getLogger, {getLogLevel, setLogLevel, LogLevel} from './common/utils/logger'

declare var __VERSION__: string;
declare var __NAME__: string;
declare var __PACKAGE_URL__: string;
declare var __PLAYER_TYPE__: string;

const currentLogLevel = getLogLevel();
setLogLevel(LogLevel.INFO);
getLogger().log(`%c ${__NAME__} ${__VERSION__}`, "color: #ff98f9;  font-size: large");
getLogger().log(`%c For more details see ${__PACKAGE_URL__}`, "color: #ff98f9;");
setLogLevel(currentLogLevel);

PolyfillManager.installAll();

// Import core
import * as core from 'playkit-js'

// Import ui
import * as ui from 'playkit-js-ui'

// Import provider
import * as providers from 'playkit-js-providers'

// Import media source adapters
import 'playkit-js-hls'
import 'playkit-js-dash'

// Import common plugins
import 'playkit-js-youbora'
import 'playkit-js-ima'

// Import analytics plugin
import 'playkit-js-analytics'

// Import setup method
import {setup} from './setup'

export {
  core,
  ui,
  providers,
  setup,
  __PLAYER_TYPE__ as PLAYER_TYPE,
  __VERSION__ as VERSION,
  __NAME__ as PLAYER_NAME
};
