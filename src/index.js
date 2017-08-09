// @flow
import 'babel-polyfill' // Important! must be first import to support older browsers compatibility
import PolyfillManager from './polyfills/polyfill-manager'
import './polyfills/all'
import * as packageData from '../package.json'
import LoggerFactory from './utils/logger'

// Player version
const VERSION = packageData.version;

// Player name
const PLAYER_NAME = packageData.name;

LoggerFactory.getLogger().log(`%c ${PLAYER_NAME} ${VERSION}`, "color: #98ff98;  font-size: large");
LoggerFactory.getLogger().log(`%c For more details see ${packageData.repository.url}`, "color: #98ff98;");

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
import 'playkit-js-ima'

// Import setup method
import {setup} from './setup'

export {Playkit, OvpProvider, PlaykitUI, setup, VERSION, PLAYER_NAME};

