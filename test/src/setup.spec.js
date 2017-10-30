import '../../src/index'
import {setup} from '../../src/setup'
import * as TestUtils from 'playkit-js/test/src/utils/test-utils'
import StorageWrapper from "../../src/storage/storage-wrapper";

const targetId = 'player-placeholder_setup.spec';

describe('setup', function () {
  let providerConfig, kalturaPlayer, sandbox, testSetup;

  before(function () {
    TestUtils.createElement('DIV', targetId);
    testSetup = setup.bind({});
  });

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    providerConfig = {
      partnerId: 2196781,
      entryId: '1_h14v9eug'
    };
  });

  afterEach(function () {
    sandbox.restore();
    kalturaPlayer = null;
    TestUtils.removeVideoElementsFromTestPage();
  });

  after(function () {
    TestUtils.removeElement(targetId);
  });

  it('should create a full player', function (done) {
    kalturaPlayer = testSetup(targetId, providerConfig);
    kalturaPlayer.loadMedia.should.exist;
    kalturaPlayer.loadMedia(providerConfig.entryId)
      .then(() => {
        kalturaPlayer.config.id.should.equal(providerConfig.entryId);
        kalturaPlayer.config.session.partnerID.should.equal(providerConfig.partnerId);
        done();
      });
  });

  it('should create an empty player', function () {
    kalturaPlayer = testSetup(targetId, providerConfig);
    (!kalturaPlayer.config.id).should.be.true;
  });

  it('should decorate the selected source by session id', function (done) {
    kalturaPlayer = testSetup(targetId, providerConfig);
    kalturaPlayer.loadMedia.should.exist;
    kalturaPlayer.loadMedia(providerConfig.entryId)
      .then(() => {
        kalturaPlayer.ready().then(() => {
          let sessionIdRegex = /playSessionId=((?:[a-z0-9]|-|:)*)/i;
          sessionIdRegex.exec(kalturaPlayer.src)[1].should.equal(kalturaPlayer.config.session.id);
          done();
        });
        kalturaPlayer.load();
      });
  });

  it('should set text style from storage', function () {
    let textStyle = {
      "fontSize": "20%",
      "fontFamily": "sans-serif",
      "fontColor": [14, 15, 0],
      "fontOpacity": 0,
      "backgroundColor": [1, 2, 3],
      "backgroundOpacity": 1,
      "fontEdge": []
    };
    sandbox.stub(StorageWrapper, 'getItem').withArgs('textStyle').returns(textStyle);
    kalturaPlayer = testSetup(targetId, providerConfig);
    kalturaPlayer.textStyle.should.deep.equal(textStyle);
  });
});
