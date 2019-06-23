import * as TestUtils from '../../utils/test-utils';
import {ValidationErrorType} from '../../../../src/common/utils/validation-error';
import StorageManager from '../../../../src/common/storage/storage-manager';
import {
  checkNativeHlsSupport,
  createKalturaPlayerContainer,
  isIos,
  isSafari,
  setStorageConfig,
  supportLegacyOptions,
  validateConfig
} from '../../../../src/common/utils/setup-helpers';

const targetId = 'player-placeholder_setup-helpers.spec';

describe('error handling', function() {
  it('should throw error because no config provided', function(done) {
    try {
      validateConfig();
    } catch (e) {
      e.message.should.equal(ValidationErrorType.INITIAL_CONFIG_REQUIRED);
      done();
    }
  });

  it('should throw error because no target id provided', function(done) {
    try {
      validateConfig({});
    } catch (e) {
      e.message.should.equal(ValidationErrorType.TARGET_ID_REQUIRED);
      done();
    }
  });

  it('should throw error because no DOM element found', function(done) {
    try {
      validateConfig({targetId: 'my-player-div'});
    } catch (e) {
      e.message.should.equal(ValidationErrorType.DOM_ELEMENT_WITH_TARGET_ID_REQUIRED + 'my-player-div');
      done();
    }
  });

  it('should emit a beacon when no partner id provided', function(done) {
    const div = document.createElement('DIV');
    div.id = 'test-id';
    document.body.appendChild(div);
    sinon.spy(navigator, 'sendBeacon');
    (navigator.sendBeacon.getCall(0) === null).should.be.true;
    validateConfig({targetId: div.id, provider: {}});
    document.body.removeChild(div);
    navigator.sendBeacon
      .getCall(0)
      .args[0].should.include(
        'https://analytics.kaltura.com/api_v3/index.php?service=analytics&action=trackEvent&apiVersion=3.3.0&format=1&eventType=1&partnerId=2504201&entryId=1_3bwzbc9o&&eventIndex=1&position=0&referrer'
      );
    done();
  });
});

describe('createKalturaPlayerContainer', function() {
  beforeEach(function() {
    TestUtils.createElement('DIV', targetId);
  });

  afterEach(function() {
    TestUtils.removeElement(targetId);
  });

  it('should create kaltura player container', function() {
    let containerId = createKalturaPlayerContainer(targetId);
    let el = document.getElementById(containerId);
    el.should.exist;
    el.className.should.equal('kaltura-player-container');
  });
});

describe('checkNativeHlsSupport', function() {
  it('set preferNative to true if user preference was set to true', function() {
    const playerConfig = {
      playback: {
        preferNative: {
          hls: true
        }
      }
    };
    checkNativeHlsSupport(playerConfig);
    playerConfig.playback.preferNative.hls.should.be.true;
  });

  it('set preferNative to false if user preference was set to false', function() {
    const playerConfig = {
      playback: {
        preferNative: {
          hls: false
        }
      }
    };
    checkNativeHlsSupport(playerConfig);
    playerConfig.playback.preferNative.hls.should.be.false;
  });

  it('set preferNative to default value if user preference was not set 1', function() {
    const playerConfig = {};
    checkNativeHlsSupport(playerConfig);
    if (isSafari() || isIos()) {
      playerConfig.playback.preferNative.hls.should.be.true;
    } else {
      playerConfig.should.deep.equal({});
    }
  });

  it('set preferNative to default value if user preference was not set 2', function() {
    const playerConfig = {
      playback: {}
    };
    checkNativeHlsSupport(playerConfig);
    if (isSafari() || isIos()) {
      playerConfig.playback.preferNative.hls.should.be.true;
    } else {
      playerConfig.should.deep.equal({
        playback: {}
      });
    }
  });

  it('set preferNative to default value if user preference was not set 3', function() {
    const playerConfig = {
      playback: {
        preferNative: {}
      }
    };
    checkNativeHlsSupport(playerConfig);
    if (isSafari() || isIos()) {
      playerConfig.playback.preferNative.hls.should.be.true;
    } else {
      playerConfig.should.deep.equal({
        playback: {
          preferNative: {}
        }
      });
    }
  });
});

describe('setStorageConfig', function() {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should merge the player and storage config with priority to the storage config', function() {
    const config = {
      player: {
        playback: {
          textLanguage: 'ita'
        }
      }
    };
    const storageConfig = {
      playback: {
        textLanguage: 'eng',
        audioLanguage: 'fra'
      }
    };
    sandbox.stub(StorageManager, 'isLocalStorageAvailable', () => true);
    sandbox.stub(StorageManager, 'hasStorage', () => true);
    sandbox.stub(StorageManager, 'getStorageConfig', () => storageConfig);
    setStorageConfig(config);
    config.playback.textLanguage.should.equal('eng');
    config.playback.audioLanguage.should.equal('fra');
  });

  it('should take the storage config in case no player config', function() {
    const config = {player: {}};
    const storageConfig = {
      playback: {
        textLanguage: 'eng',
        audioLanguage: 'fra'
      }
    };
    sandbox.stub(StorageManager, 'isLocalStorageAvailable', () => true);
    sandbox.stub(StorageManager, 'hasStorage', () => true);
    sandbox.stub(StorageManager, 'getStorageConfig', () => storageConfig);
    setStorageConfig(config);
    config.playback.textLanguage.should.equal('eng');
    config.playback.audioLanguage.should.equal('fra');
  });
});

describe('supportLegacyOptions', function() {
  let sandbox;
  const legacyOptions = {
    targetId: 'player-placeholder',
    player: {
      dvr: false,
      type: 'Live',
      duration: 10000,
      name: 'name',
      playback: {
        autoplay: false
      },
      metadata: {
        poster: 'https://www.elastic.co/assets/bltada7771f270d08f6/enhanced-buzz-1492-1379411828-15.jpg'
      }
    },
    provider: {
      partnerId: 1091
    },
    ui: {
      components: {
        seekbar: {
          thumbsSprite: 'http://stilearning.com/vision/1.1/assets/globals/img/dummy/img-10.jpg'
        }
      }
    }
  };

  const duplicateOptions = {
    targetId: 'player-placeholder',
    sources: {
      dvr: false
    },
    player: {
      dvr: true,
      type: 'Live',
      duration: 10000,
      name: 'name',
      playback: {
        autoplay: false
      },
      metadata: {
        poster: 'https://www.elastic.co/assets/bltada7771f270d08f6/enhanced-buzz-1492-1379411828-15.jpg'
      }
    },
    provider: {
      partnerId: 1091
    },
    ui: {
      components: {
        seekbar: {
          thumbsSprite: 'http://stilearning.com/vision/1.1/assets/globals/img/dummy/img-10.jpg'
        }
      }
    }
  };

  const options = {
    targetId: 'player-placeholder',
    sources: {
      dvr: false,
      type: 'Live',
      duration: 10000,
      poster: 'https://www.elastic.co/assets/bltada7771f270d08f6/enhanced-buzz-1492-1379411828-15.jpg',
      metadata: {
        name: 'name'
      }
    },
    playback: {
      autoplay: false
    },
    provider: {
      partnerId: 1091
    },
    ui: {
      components: {
        seekbar: {
          thumbsSprite: 'http://stilearning.com/vision/1.1/assets/globals/img/dummy/img-10.jpg'
        }
      }
    }
  };

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should transform options with the old structure', function() {
    supportLegacyOptions(legacyOptions);
    legacyOptions.should.deep.equal(options);
  });

  it('should not transform config with the new structure', function() {
    supportLegacyOptions(options);
    legacyOptions.should.deep.equal(options);
  });

  it('check method support duplicate configuration take the new configuration', function() {
    supportLegacyOptions(duplicateOptions);
    duplicateOptions.should.deep.equal(options);
  });
});
