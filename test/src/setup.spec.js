import setup from '../../src/setup'
import {extractProviderConfig, extractPlayerConfig, createKalturaPlayerContainer} from '../../src/setup'
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

describe('extractProviderConfig', function () {
  let config;

  beforeEach(function () {
    config = {
      partnerId: 1914121,
      entryId: '1_umer46fd',
      playback: {
        autoplay: true,
        muted: true,
        streamPriority: [
          {
            engine: 'html5',
            format: 'hls'
          },
          {
            engine: 'flash',
            format: 'hls'
          },
          {
            engine: 'html5',
            format: 'dash'
          },
          {
            engine: 'html5',
            format: 'progressive'
          }
        ]
      }
    };
  });

  it('should extract provider config - both partner and entry ids', function () {
    extractProviderConfig(config).should.deep.equals({
      partnerId: 1914121,
      entryId: '1_umer46fd'
    });
  });

  it('should extract provider config - only partner id', function () {
    delete config.entryId;
    extractProviderConfig(config).should.deep.equals({
      partnerId: 1914121
    });
  });

  it('should extract provider config - only entry id', function () {
    delete config.partnerId;
    extractProviderConfig(config).should.deep.equals({
      entryId: '1_umer46fd'
    });
  });

  it('should extract empty provider config', function () {
    config = null;
    extractProviderConfig(config).should.deep.equals({});
  });
});

describe('extractPlayerConfig', function () {
  let playerConfig, config;

  beforeEach(function () {
    playerConfig = {
      playback: {
        autoplay: true,
        muted: true,
        streamPriority: [
          {
            engine: 'html5',
            format: 'hls'
          },
          {
            engine: 'flash',
            format: 'hls'
          },
          {
            engine: 'html5',
            format: 'dash'
          },
          {
            engine: 'html5',
            format: 'progressive'
          }
        ]
      }
    };

    config = {
      partnerId: 1914121,
      entryId: '1_umer46fd',
      playback: {
        autoplay: true,
        muted: true,
        streamPriority: [
          {
            engine: 'html5',
            format: 'hls'
          },
          {
            engine: 'flash',
            format: 'hls'
          },
          {
            engine: 'html5',
            format: 'dash'
          },
          {
            engine: 'html5',
            format: 'progressive'
          }
        ]
      }
    };
  });

  it('should extract player config - remove both partner and entry ids', function () {
    extractPlayerConfig(config).should.deep.equals(playerConfig);
  });

  it('should extract provider config - remove only partner id', function () {
    delete config.entryId;
    extractPlayerConfig(config).should.deep.equals(playerConfig);
  });

  it('should extract provider config - remove only entry id', function () {
    delete config.partnerId;
    extractPlayerConfig(config).should.deep.equals(playerConfig);
  });

  it('should extract empty player config', function () {
    config = null;
    extractPlayerConfig(config).should.deep.equals({});
  });

});

describe('createKalturaPlayerContainer', function () {

  beforeEach(function () {
    TestUtils.createElement('DIV', targetId);
  });

  afterEach(function () {
    TestUtils.removeElement(targetId);
  });

  it('should create kaltura player container', function () {
    let containerId = createKalturaPlayerContainer(targetId);
    let el = document.getElementById(containerId);
    el.should.exist;
    el.className.should.equal("kaltura-player-container");
  });
});
