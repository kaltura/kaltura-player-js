import '../../src/index';
import {setup} from '../../src/setup';
import * as TestUtils from './utils/test-utils';
import StorageWrapper from '../../src/common/storage/storage-wrapper';

const targetId = 'player-placeholder_setup.spec';

describe('setup', function() {
  let config, kalturaPlayer, sandbox;
  const entryId = '0_wifqaipd';
  const partnerId = 1091;
  const env = {
    cdnUrl: 'http://qa-apache-php7.dev.kaltura.com/',
    serviceUrl: 'http://qa-apache-php7.dev.kaltura.com/api_v3'
  };

  before(function() {
    TestUtils.createElement('DIV', targetId);
  });

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    config = {
      targetId: targetId,
      provider: {
        partnerId: partnerId,
        env: env
      }
    };
  });

  afterEach(function() {
    sandbox.restore();
    kalturaPlayer.destroy();
    kalturaPlayer = null;
    TestUtils.removeVideoElementsFromTestPage();
  });

  after(function() {
    TestUtils.removeElement(targetId);
  });

  it('should create a full player', function(done) {
    kalturaPlayer = setup(config);
    kalturaPlayer.loadMedia.should.exist;
    kalturaPlayer.loadMedia({entryId: entryId}).then(() => {
      kalturaPlayer.config.sources.id.should.equal(entryId);
      kalturaPlayer.config.session.partnerId.should.equal(partnerId);
      done();
    });
  });

  it('should create an empty player', function() {
    kalturaPlayer = setup(config);
    (!kalturaPlayer.config.id).should.be.true;
  });

  it('should decorate the selected source by session id', function(done) {
    kalturaPlayer = setup(config);
    kalturaPlayer.loadMedia.should.exist;
    kalturaPlayer.loadMedia({entryId: entryId}).then(() => {
      kalturaPlayer.ready().then(() => {
        let sessionIdRegex = /playSessionId=((?:[a-z0-9]|-|:)*)/i;
        sessionIdRegex.exec(kalturaPlayer.src)[1].should.equal(kalturaPlayer.config.session.id);
        done();
      });
      kalturaPlayer.load();
    });
  });

  it('should set text style from storage', function() {
    let textStyle = {
      fontSize: '20%',
      fontFamily: 'sans-serif',
      fontColor: [14, 15, 0],
      fontOpacity: 0,
      backgroundColor: [1, 2, 3],
      backgroundOpacity: 1,
      fontEdge: [],
      fontScale: 1
    };
    sandbox
      .stub(StorageWrapper, 'getItem')
      .withArgs('textStyle')
      .returns(textStyle);
    kalturaPlayer = setup(config);
    kalturaPlayer.textStyle.should.deep.equal(textStyle);
  });

  it('should configure sources', function(done) {
    const url = 'http://cfvod.kaltura.com/pd/p/2196781/sp/219678100/serveFlavor/entryId/1_afvj3z0u/v/1/flavorId/1_vpmhfzgl/name/a.mp4';
    config.sources = {
      progressive: [
        {
          id: 'id',
          mimetype: 'video/mp4',
          url
        }
      ]
    };
    kalturaPlayer = setup(config);
    kalturaPlayer.load();
    kalturaPlayer.ready().then(() => {
      kalturaPlayer.src.should.equal(url);
      done();
    });
  });
});
