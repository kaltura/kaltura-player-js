// @flow

// Import core
import * as Playkit from 'playkit-js';

// Import OVP and OTT providers
import OvpProvider from 'playkit-js-providers/dist/ovpProvider';

// Import UI
import PlaykitUI from 'playkit-js-ui';
import '../node_modules/playkit-js-ui/src/styles/style.css';

// Import media source adapters
import 'playkit-js-hls';
import 'playkit-js-dash';

// TODO: Import plugins

export {Playkit, OvpProvider, PlaykitUI};

