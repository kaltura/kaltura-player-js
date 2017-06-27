import * as Playkit from 'playkit-js';
import {UIManager} from '../node_modules/playkit-js-ui/src/playkit-js-ui';
import '../node_modules/playkit-js-ui/src/styles/style.css';
import DashAdapter from 'playkit-js-dash';
import HlsAdapter from 'playkit-js-hls';

// Register DashAdapter to the media source adapter manager
if (DashAdapter.isSupported()) {
  Playkit.registerMediaSourceAdapter(DashAdapter);
}

// Register hls adapter to the media source adapter provider.
if (HlsAdapter.isSupported()) {
  Playkit.registerMediaSourceAdapter(HlsAdapter);
}

let configs = [];
var players = [];
var uis = [];

configs[0] = {
  "target": "player1",
  "sources": [
    {
      "mimetype": "application/x-mpegurl",
      "url": "https://wowzaec2demo.streamlock.net/vod-multitrack/_definst_/smil:ElephantsDream/ElephantsDream.smil/playlist.m3u8"
    }
  ]
};

configs[1] = {
  "target": "player2",
  "sources": [
    {
      "mimetype": "application/dash+xml",
      "url": "https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd"
    }
  ]
};


configs.forEach((c, i) => {
  players[i] = Playkit.playkit(c);
  uis[i] = new UIManager(players[i], c);
  uis[i].buildDefaultUI();
});

export {Playkit};

