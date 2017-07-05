import setup from '../../src/setup'
import {extractProviderConfig, extractPlayerConfig, createKalturaPlayerContainer} from '../../src/setup'
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
    TestUtils.removeElement(targetId);
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

describe('extractProviderConfig', function () {
  let config;

  beforeEach(function () {
    config = {
      partnerId: 1914121,
      entryId: '1_umer46fd',
      uiConfId: '12345',
      ks: 'sdsf87s8f7s8fjsf',
      env: {
        beUrl: 'http://some/be/url',
        baseUrl: 'http://some/base/url'
      },
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

  it('should extract all provider config', function () {
    extractProviderConfig(config).should.deep.equals({
      partnerId: 1914121,
      entryId: '1_umer46fd',
      uiConfId: '12345',
      ks: 'sdsf87s8f7s8fjsf',
      env: {
        beUrl: 'http://some/be/url',
        baseUrl: 'http://some/base/url'
      }
    });
  });

  it('should extract all provider config except entry id', function () {
    delete config.entryId;
    extractProviderConfig(config).should.deep.equals({
      partnerId: 1914121,
      entryId: undefined,
      uiConfId: '12345',
      ks: 'sdsf87s8f7s8fjsf',
      env: {
        beUrl: 'http://some/be/url',
        baseUrl: 'http://some/base/url'
      }
    });
  });

  it('should extract all provider config except partner id', function () {
    delete config.partnerId;
    extractProviderConfig(config).should.deep.equals({
      partnerId: undefined,
      entryId: '1_umer46fd',
      uiConfId: '12345',
      ks: 'sdsf87s8f7s8fjsf',
      env: {
        beUrl: 'http://some/be/url',
        baseUrl: 'http://some/base/url'
      }
    });
  });

  it('should extract all provider config except ks', function () {
    delete config.ks;
    extractProviderConfig(config).should.deep.equals({
      partnerId: 1914121,
      entryId: '1_umer46fd',
      uiConfId: '12345',
      ks: undefined,
      env: {
        beUrl: 'http://some/be/url',
        baseUrl: 'http://some/base/url'
      }
    });
  });

  it('should extract all provider config except env', function () {
    delete config.env;
    extractProviderConfig(config).should.deep.equals({
      partnerId: 1914121,
      entryId: '1_umer46fd',
      uiConfId: '12345',
      ks: 'sdsf87s8f7s8fjsf',
      env: undefined
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
