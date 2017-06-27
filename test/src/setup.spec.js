import setup from '../../src/setup'
import * as TestUtils from 'playkit-js/test/src/utils/test-utils'

describe('setup', function () {

  let config, player;

  beforeEach(function () {
    config = {
      partnerId: 2196781, entryID: '1_h14v9eug'
    };
  });

  afterEach(function () {
    player.destroy();
    TestUtils.removeVideoElementsFromTestPage();
  });

  it('should create a full player', function (done) {
    setup(config).then(p => {
      player = p;
      player.config.id.should.equal(config.entryID);
      player.config.session.partnerID.should.equal(config.partnerId);
      done();
    });
  });

  it('should create an empty player', function (done) {
    setup().then(p => {
      player = p;
      (!player.config.id).should.be.true;
      done();
    });
  });

  it('should decorate the selected source by session id', function (done) {
    setup(config).then(p => {
      player = p;
      player.load();
      let sessionIdRegex = /playSessionId=((?:[a-z0-9]|-|:)*)/i;
      player.config.session.id.should.exist;
      sessionIdRegex.exec(player.src)[1].should.equal(player.config.session.id);
      done();
    });
  });
});
