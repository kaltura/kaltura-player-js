import * as TestUtils from 'playkit-js/test/src/utils/test-utils'
import {ValidationErrorType} from '../../../src/utils/validation-error'
import {
  extractPlayerConfig,
  extractProvidersConfig,
  createKalturaPlayerContainer,
  validateTargetId,
  validateProvidersConfig,
  addKalturaPoster
} from '../../../src/utils/setup-helpers'

const targetId = 'player-placeholder_setup-helpers.spec';

describe('error handling', function () {
  it('should throw error because no config provided', function (done) {
    try {
      validateProvidersConfig();
    } catch (e) {
      e.message.should.equal(ValidationErrorType.INITIAL_CONFIG_REQUIRED);
      done();
    }
  });

  it('should throw error because no target id provided', function (done) {
    try {
      validateTargetId();
    } catch (e) {
      e.message.should.equal(ValidationErrorType.TARGET_ID_REQUIRED);
      done();
    }
  });

  it('should throw error because no DOM element found', function (done) {
    try {
      validateTargetId('my-player-div');
    } catch (e) {
      e.message.should.equal(ValidationErrorType.DOM_ELEMENT_WITH_TARGET_ID_REQUIRED + 'my-player-div');
      done();
    }
  });

  it('should throw error because no partner id provided', function (done) {
    try {
      validateProvidersConfig({});
    } catch (e) {
      e.message.should.equal(ValidationErrorType.PARTNER_ID_REQUIRED);
      done();
    }
  });
});

describe('extractProvidersConfig', function () {
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
    extractProvidersConfig(config).should.deep.equals({
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
    extractProvidersConfig(config).should.deep.equals({
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
    extractProvidersConfig(config).should.deep.equals({
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
    extractProvidersConfig(config).should.deep.equals({
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
    extractProvidersConfig(config).should.deep.equals({
      partnerId: 1914121,
      entryId: '1_umer46fd',
      uiConfId: '12345',
      ks: 'sdsf87s8f7s8fjsf',
      env: undefined
    });
  });

  it('should extract empty provider config', function () {
    config = null;
    extractProvidersConfig(config).should.deep.equals({});
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

describe('addKalturaPoster', function () {
  it('should append width and height to kaltura poster', function () {
    let metadata = {poster: 'https//my/kaltura/poster'};
    addKalturaPoster(metadata, 640, 360);
    metadata.poster.should.equal('https//my/kaltura/poster/height/360/width/640');
  });
});
