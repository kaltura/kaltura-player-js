import '../../src/index';
import {setup} from '../../src';
import * as TestUtils from '../utils/test-utils';
import LocalStorageManager from '../../src/common/storage/local-storage-manager';
import {TextStyle} from '@playkit-js/playkit-js';
import * as sinon from 'sinon';

const targetId = 'player-placeholder_setup.spec';

describe('setup', () => {
  let config, kalturaPlayer, sandbox;
  const entryId = '0_wifqaipd';
  const partnerId = 1091;
  const env = {
    cdnUrl: 'http://qa-apache-php7.dev.kaltura.com/',
    serviceUrl: 'http://qa-apache-php7.dev.kaltura.com/api_v3'
  };

  before(() => {
    TestUtils.createElement('DIV', targetId);
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    config = {
      targetId: targetId,
      provider: {
        partnerId: partnerId,
        env: env
      }
    };
  });

  afterEach(() => {
    sandbox.restore();
    kalturaPlayer.destroy();
    kalturaPlayer = null;
    TestUtils.removeVideoElementsFromTestPage();
  });

  after(() => {
    TestUtils.removeElement(targetId);
  });

  it.skip('should create a full player', (done) => {
    kalturaPlayer = setup(config);
    kalturaPlayer.loadMedia.should.exist;
    kalturaPlayer.loadMedia({entryId: entryId}).then(() => {
      kalturaPlayer.config.sources.id.should.equal(entryId);
      kalturaPlayer.config.session.partnerId.should.equal(partnerId);
      done();
    });
  });

  it('should create an empty player', () => {
    kalturaPlayer = setup(config);
    (!kalturaPlayer.config.id).should.be.true;
  });

  it.skip('should decorate the selected source by session id', (done) => {
    kalturaPlayer = setup(config);
    kalturaPlayer.loadMedia.should.exist;
    kalturaPlayer.loadMedia({entryId: entryId}).then(() => {
      kalturaPlayer.ready().then(() => {
        const sessionIdRegex = /playSessionId=((?:[a-z0-9]|-|:)*)/i;
        sessionIdRegex.exec(kalturaPlayer.src)[1].should.equal(kalturaPlayer.config.session.id);
        done();
      });
      kalturaPlayer.load();
    });
  });

  it('should set text style from storage', () => {
    const textStyle = TextStyle.fromJson({
      fontSize: '75%',
      fontFamily: 'sans-serif',
      fontColor: [14, 15, 0],
      fontOpacity: 0,
      backgroundColor: [1, 2, 3],
      backgroundOpacity: 1,
      fontEdge: []
    });
    sandbox.stub(LocalStorageManager, 'getItem').withArgs('textStyle').returns(textStyle);
    kalturaPlayer = setup(config);
    kalturaPlayer.textStyle.should.deep.equal(textStyle);
  });

  it('should configure sources', (done) => {
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
