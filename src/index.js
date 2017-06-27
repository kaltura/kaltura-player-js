// @flow

// Import core
import * as Playkit from 'playkit-js';

// Import OVP and OTT providers
import OvpProvider from 'playkit-js-providers/dist/ovpProvider';

// Import UI
import PlaykitUI from 'playkit-js-ui';
import '../node_modules/playkit-js-ui/src/styles/style.css';

// Import media source adapters
import HlsAdapter from 'playkit-js-hls';
import DashAdapter from 'playkit-js-dash';

// TODO: Import plugins


// Register DashAdapter to the media source adapter manager
if (DashAdapter.isSupported()) {
  Playkit.registerMediaSourceAdapter(DashAdapter);
}

// Register hls adapter to the media source adapter provider.
if (HlsAdapter.isSupported()) {
  Playkit.registerMediaSourceAdapter(HlsAdapter);
}

export {Playkit, OvpProvider, PlaykitUI};
