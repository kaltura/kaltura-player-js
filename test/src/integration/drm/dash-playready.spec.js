import '../../../../src/index'
import {setup} from '../../../../src/setup'
import {addDemoStylesheet} from '../demo-styles'
import {DrmSupport, DrmScheme} from 'playkit-js'
import * as TestUtils from 'playkit-js/test/src/utils/test-utils'

const containerId = 'player-placeholder-container';
const targetId = 'player-placeholder';

describe('Dash PlayReady Integration', function () {
  this.timeout(50000);

  let kalturaPlayer;
  let entryId = '0_2jiaa9tb';
  let config = {
    partnerId: 4171,
    env: {
      baseUrl: "http://qa-apache-php7.dev.kaltura.com/",
      beUrl: "http://qa-apache-php7.dev.kaltura.com/api_v3"
    },
    playback: {
      streamPriority: [
        {
          engine: "html5",
          format: "dash"
        }
      ]
    }
  };

  before(function () {
    addDemoStylesheet();
    TestUtils.createElement('DIV', containerId);
    TestUtils.createElement('DIV', targetId, containerId);
  });

  after(function () {
    kalturaPlayer.destroy();
    kalturaPlayer = null;
    TestUtils.removeVideoElementsFromTestPage();
    TestUtils.removeElement(targetId);
    TestUtils.removeElement(containerId);
  });

  it('should play dash playready drm on edge/ie', function (done) {
    kalturaPlayer = setup(targetId, config);
    kalturaPlayer.addEventListener(kalturaPlayer.Event.PLAYING, () => {
      done();
    });
    kalturaPlayer.addEventListener(kalturaPlayer.Event.ERROR, () => {
      should.fail();
    });
    kalturaPlayer.loadMedia(entryId).then(() => {
      if (DrmSupport.isProtocolSupported(DrmScheme.PLAYREADY, kalturaPlayer.config.sources.dash[0].drmData)) {
        kalturaPlayer.play();
      } else {
        done();
      }
    });
  });
});
