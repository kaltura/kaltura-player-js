// @flow
import 'babel-polyfill' // Important! must be first import to support older browsers compatibility
import PolyfillManager from './polyfills/polyfill-manager'
import './polyfills/all'
import LoggerFactory from './utils/logger'

declare var __VERSION__:string;
declare var __NAME__:string;
declare var __PACKAGE_URL__:string;

LoggerFactory.getLogger().log(`%c ${__NAME__} ${__VERSION__}`, "color: #98ff98;  font-size: large");
LoggerFactory.getLogger().log(`%c For more details see ${__PACKAGE_URL__}`, "color: #98ff98;");

PolyfillManager.installAll();

// Import core
import * as Playkit from 'playkit-js'

// Import OVP and OTT providers
import OvpProvider from 'playkit-js-providers/dist/ovpProvider'

// Import UI
import PlaykitUI from 'playkit-js-ui'

// Import media source adapters
import 'playkit-js-hls'
import 'playkit-js-dash'

// Import plugins
import 'playkit-js-kanalytics'
import 'playkit-js-youbora'
import 'playkit-js-ima'

// Import setup method
import {setup} from './setup'

export {Playkit, OvpProvider, PlaykitUI, setup, __VERSION__ as VERSION, __NAME__ as PLAYER_NAME};

