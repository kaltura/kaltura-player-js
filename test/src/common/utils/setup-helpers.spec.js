import * as TestUtils from 'playkit-js/test/src/utils/test-utils'
import {ValidationErrorType} from '../../../../src/common/utils/validation-error'
import StorageManager from '../../../../src/common/storage/storage-manager'
import {
  createKalturaPlayerContainer,
  validateConfig,
  checkNativeHlsSupport,
  isSafari,
  isIos,
  setStorageConfig
} from '../../../../src/common/utils/setup-helpers'

const targetId = 'player-placeholder_setup-helpers.spec';

describe('error handling', function () {
  it('should throw error because no config provided', function (done) {
    try {
      validateConfig();
    } catch (e) {
      e.message.should.equal(ValidationErrorType.INITIAL_CONFIG_REQUIRED);
      done();
    }
  });

  it('should throw error because no target id provided', function (done) {
    try {
      validateConfig({});
    } catch (e) {
      e.message.should.equal(ValidationErrorType.TARGET_ID_REQUIRED);
      done();
    }
  });

  it('should throw error because no DOM element found', function (done) {
    try {
      validateConfig({targetId: 'my-player-div'});
    } catch (e) {
      e.message.should.equal(ValidationErrorType.DOM_ELEMENT_WITH_TARGET_ID_REQUIRED + 'my-player-div');
      done();
    }
  });

  it('should throw error because no partner id provided', function (done) {
    const div = document.createElement('DIV');
    div.id = 'test-id';
    document.body.appendChild(div);
    try {
      validateConfig({targetId: div.id, provider: {}});
    } catch (e) {
      document.body.removeChild(div);
      e.message.should.equal(ValidationErrorType.PARTNER_ID_REQUIRED);
      done();
    }
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

describe('checkNativeHlsSupport', function () {
  it('set preferNative to true if user preference was set to true', function () {
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

  it('set preferNative to false if user preference was set to false', function () {
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

  it('set preferNative to default value if user preference was not set 1', function () {
    const playerConfig = {};
    checkNativeHlsSupport(playerConfig);
    if (isSafari() || isIos()) {
      playerConfig.playback.preferNative.hls.should.be.true;
    } else {
      playerConfig.should.deep.equal({});
    }
  });

  it('set preferNative to default value if user preference was not set 2', function () {
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

  it('set preferNative to default value if user preference was not set 3', function () {
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

describe('setStorageConfig', function () {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should merge the player and storage config with priority to the storage config', function () {
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
    config.player.playback.textLanguage.should.equal('eng');
    config.player.playback.audioLanguage.should.equal('fra');
  });

  it('should take the storage config in case no player config', function () {
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
    config.player.playback.textLanguage.should.equal('eng');
    config.player.playback.audioLanguage.should.equal('fra');
  });
});
