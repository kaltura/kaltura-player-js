// @flow
import 'babel-polyfill'
import PolyfillManager from './polyfill/polyfill-manager'
import './polyfill/all'

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

// Import setup method
import setup from './setup'

export {Playkit, OvpProvider, PlaykitUI, setup};

