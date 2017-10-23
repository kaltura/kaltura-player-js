import '../../../../src/index'
import {setup} from '../../../../src/setup'
import {addDemoStylesheet} from '../demo-styles'
import {BaseDrmProtocol} from 'playkit-js'
import * as TestUtils from 'playkit-js/test/src/utils/test-utils'

const DrmSupport = BaseDrmProtocol.DrmSupport;
const DrmScheme = BaseDrmProtocol.DrmScheme;
const containerId = 'player-placeholder-container';
const targetId = 'player-placeholder';

describe.skip('Hls FairPlay Integration (Skipped until we have a FairPlay entry on the QA env)', function () {
  this.timeout(50000);

  let kalturaPlayer;
  let entryId = '1_etkmak5i';
  let config = {
    partnerId: 1804331,
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

  it('should play native hls fairplay drm on safari', function (done) {
    kalturaPlayer = setup(targetId, config);
    kalturaPlayer.addEventListener(kalturaPlayer.Event.PLAYING, () => {
      done();
    });
    kalturaPlayer.addEventListener(kalturaPlayer.Event.ERROR, () => {
      should.fail();
    });
    kalturaPlayer.loadMedia(entryId).then(() => {
      if (DrmSupport.isProtocolSupported(DrmScheme.FAIRPLAY, kalturaPlayer.config.sources.hls[0].drmData)) {
        kalturaPlayer.play();
      } else {
        done();
      }
    });
  });
});
