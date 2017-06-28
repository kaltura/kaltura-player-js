import setup from '../../src/setup'
import * as TestUtils from 'playkit-js/test/src/utils/test-utils'

const targetId = 'player-placeholder_setup.spec';

describe('setup', function () {

  let providerConfig, player, provider;

  before(function () {
    TestUtils.createElement('DIV', targetId);
  });

  beforeEach(function () {
    providerConfig = {
      partnerId: 2196781,
      entryId: '1_h14v9eug'
    };
  });

  afterEach(function () {
    player.destroy();
    provider = null;
    TestUtils.removeVideoElementsFromTestPage();
  });

  after(function () {
    TestUtils.removeElemenet(targetId);
  });

  it('should create a full player', function (done) {
    setup(targetId, providerConfig).then(response => {
      player = response.player;
      provider = response.provider;
      provider.should.exist;
      provider.partnerID.should.equal(providerConfig.partnerId);
      player.config.id.should.equal(providerConfig.entryId);
      player.config.session.partnerID.should.equal(providerConfig.partnerId);
      done();
    });
  });

  it('should create an empty player', function (done) {
    setup(targetId).then(response => {
      player = response.player;
      (!player.config.id).should.be.true;
      done();
    });
  });

  it('should decorate the selected source by session id', function (done) {
    setup(targetId, providerConfig).then(response => {
      player = response.player;
      player.load();
      provider = response.provider;
      provider.should.exist;
      provider.partnerID.should.equal(providerConfig.partnerId);
      let sessionIdRegex = /playSessionId=((?:[a-z0-9]|-|:)*)/i;
      player.config.session.id.should.exist;
      sessionIdRegex.exec(player.src)[1].should.equal(player.config.session.id);
      done();
    });
  });
});
