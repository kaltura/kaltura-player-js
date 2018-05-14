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
// import * as providers from 'playkit-js-providers'

// Import setup method
import {setup} from './setup'

// const PLAYER_TYPE = __PLAYER_TYPE__;
const PLAYER_NAME = __NAME__;
const VERSION = __VERSION__;
const NAME = __NAME__;
const PLAYER_TYPE = 'ovp';
import * as providers from './common/provider-manager'

// Auto-register providers
if (playkit && playkit.providers){
  Object.entries(playkit.providers).forEach(([name, provider]) => {
    providers.register(name, provider.Provider);
  });
}

// if (playkit && playkit.adapters){
//   Object.entries(playkit.adapters).forEach(([name, adapter]) => {
//     adapters.register(name, adapter.Adapter);
//   });
// }

// if (playkit && playkit.adapters){
//   Object.entries(playkit.adapters).forEach(([name, adapter]) => {
//     adapters.register(name, adapter.Adapter);
//   });
// }

export {
  core,
  ui,
  providers,
  // adapters,
  setup,
  PLAYER_TYPE,
  VERSION,
  NAME,
  PLAYER_NAME
};
