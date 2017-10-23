import {setup} from '../../../src/setup'
import * as TestUtils from 'playkit-js/test/src/utils/test-utils'

const targetId = 'player-placeholder_setup.spec';

describe('setup', function () {

  let providerConfig, kalturaPlayer;

  before(function () {
    TestUtils.createElement('DIV', targetId);
  });

  beforeEach(function () {
    providerConfig = {
      partnerId: 4171,
      entryId: '0_2jiaa9tb',
      env: {
        baseUrl: "http://qa-apache-php7.dev.kaltura.com/",
        beUrl: "http://qa-apache-php7.dev.kaltura.com/api_v3"
      }
    };
  });

  afterEach(function () {
    kalturaPlayer = null;
    TestUtils.removeVideoElementsFromTestPage();
  });

  after(function () {
    TestUtils.removeElement(targetId);
  });

  it('should create a full player', function (done) {
    kalturaPlayer = setup(targetId, providerConfig);
    kalturaPlayer.loadMedia.should.exist;
    kalturaPlayer.loadMedia(providerConfig.entryId)
      .then(() => {
        kalturaPlayer.config.id.should.equal(providerConfig.entryId);
        kalturaPlayer.config.session.partnerID.should.equal(providerConfig.partnerId);
        done();
      });
  });

  it('should create an empty player', function () {
    kalturaPlayer = setup(targetId, providerConfig);
    (!kalturaPlayer.config.id).should.be.true;
  });

  it('should decorate the selected source by session id', function (done) {
    kalturaPlayer = setup(targetId, providerConfig);
    kalturaPlayer.loadMedia.should.exist;
    kalturaPlayer.loadMedia(providerConfig.entryId)
      .then(() => {
        kalturaPlayer.load();
        let sessionIdRegex = /playSessionId=((?:[a-z0-9]|-|:)*)/i;
        sessionIdRegex.exec(kalturaPlayer.src)[1].should.equal(kalturaPlayer.config.session.id);
        done();
      });
  });
});
