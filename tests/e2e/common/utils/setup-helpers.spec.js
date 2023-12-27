import * as TestUtils from '../../../utils/test-utils';
import { ValidationErrorType } from '../../../../src/common/utils/validation-error';
import LocalStorageManager from '../../../../src/common/storage/local-storage-manager';
import * as SetupHelpers from '../../../../src/common/utils/setup-helpers';
import { Env } from '@playkit-js/playkit-js';
import { Images } from '../../mock-data/images';

const targetId = 'player-placeholder_setup-helpers.spec';

describe('error handling', () => {
  it('should throw error because no config provided', (done) => {
    try {
      SetupHelpers.validateConfig();
    } catch (e) {
      e.message.should.equal(ValidationErrorType.INITIAL_CONFIG_REQUIRED);
      done();
    }
  });

  it('should throw error because no target id provided', (done) => {
    try {
      SetupHelpers.validateConfig({});
    } catch (e) {
      e.message.should.equal(ValidationErrorType.TARGET_ID_REQUIRED);
      done();
    }
  });

  it('should throw error because no DOM element found', (done) => {
    try {
      SetupHelpers.validateConfig({ targetId: 'my-player-div' });
    } catch (e) {
      e.message.should.equal(ValidationErrorType.DOM_ELEMENT_WITH_TARGET_ID_REQUIRED + 'my-player-div');
      done();
    }
  });

  describe('send beacon', () => {
    beforeEach(() => {
      sinon.spy(navigator, 'sendBeacon');
    });

    afterEach(() => {
      navigator.sendBeacon.restore();
    });

    it('should emit a beacon when no partner id provided', (done) => {
      const div = document.createElement('DIV');
      div.id = 'test-id';
      document.body.appendChild(div);
      (navigator.sendBeacon.getCall(0) === null).should.be.true;
      SetupHelpers.validateProviderConfig({ targetId: div.id, provider: {} });
      document.body.removeChild(div);
      navigator.sendBeacon
        .getCall(0)
        .args[0].should.include(
          'https://analytics.kaltura.com/api_v3/index.php?service=analytics&action=trackEvent&apiVersion=3.3.0&format=1&eventType=1&partnerId=2504201&entryId=1_3bwzbc9o&&eventIndex=1&position=0&referrer'
        );
      done();
    });

    it('should emit a beacon when the default partner id provided', (done) => {
      const div = document.createElement('DIV');
      div.id = 'test-id';
      document.body.appendChild(div);
      (navigator.sendBeacon.getCall(0) === null).should.be.true;
      SetupHelpers.validateProviderConfig({ targetId: div.id, provider: { partnerId: 2504201 } });
      document.body.removeChild(div);
      navigator.sendBeacon
        .getCall(0)
        .args[0].should.include(
          'https://analytics.kaltura.com/api_v3/index.php?service=analytics&action=trackEvent&apiVersion=3.3.0&format=1&eventType=1&partnerId=2504201&entryId=1_3bwzbc9o&&eventIndex=1&position=0&referrer'
        );
      done();
    });

    it('should the beacon include clientVer', (done) => {
      const div = document.createElement('DIV');
      window.__kalturaplayerdata = { productVersion: '7.37' };
      div.id = 'test-id';
      document.body.appendChild(div);
      (navigator.sendBeacon.getCall(0) === null).should.be.true;
      SetupHelpers.validateProviderConfig({ targetId: div.id, provider: { partnerId: 2504201 } });
      document.body.removeChild(div);
      navigator.sendBeacon
        .getCall(0)
        .args[0].should.include(
          'https://analytics.kaltura.com/api_v3/index.php?service=analytics&action=trackEvent&apiVersion=3.3.0&format=1&eventType=1&partnerId=2504201&entryId=1_3bwzbc9o&&eventIndex=1&position=0&clientVer=7.37&referrer'
        );
      done();
    });
  });
});

describe('createKalturaPlayerContainer', () => {
  beforeEach(() => {
    TestUtils.createElement('DIV', targetId);
  });

  afterEach(() => {
    TestUtils.removeElement(targetId);
  });

  it('should create kaltura player container', () => {
    const containerId = SetupHelpers.createKalturaPlayerContainer(targetId);
    const el = document.getElementById(containerId);
    el.should.exist;
    el.className.should.equal('kaltura-player-container');
  });
});

describe('checkNativeHlsSupport', () => {
  it('set preferNative to true if user preference was set to true', () => {
    const playerConfig = {
      playback: {
        preferNative: {
          hls: true
        }
      }
    };
    SetupHelpers.checkNativeHlsSupport(playerConfig);
    playerConfig.playback.preferNative.hls.should.be.true;
  });

  it('set preferNative to false if user preference was set to false', () => {
    const playerConfig = {
      playback: {
        preferNative: {
          hls: false
        }
      }
    };
    SetupHelpers.checkNativeHlsSupport(playerConfig);
    playerConfig.playback.preferNative.hls.should.be.false;
  });

  it('set preferNative to default value if user preference was not set 1', () => {
    const playerConfig = {};
    SetupHelpers.checkNativeHlsSupport(playerConfig);
    if (Env.isSafari || Env.isIOS) {
      playerConfig.playback.preferNative.hls.should.be.true;
    } else {
      playerConfig.should.deep.equal({});
    }
  });

  it('set preferNative to default value if user preference was not set 2', () => {
    const playerConfig = {
      playback: {}
    };
    SetupHelpers.checkNativeHlsSupport(playerConfig);
    if (Env.isSafari || Env.isIOS) {
      playerConfig.playback.preferNative.hls.should.be.true;
    } else {
      playerConfig.should.deep.equal({
        playback: {}
      });
    }
  });

  it('set preferNative to default value if user preference was not set 3', () => {
    const playerConfig = {
      playback: {
        preferNative: {}
      }
    };
    SetupHelpers.checkNativeHlsSupport(playerConfig);
    if (Env.isSafari || Env.isIOS) {
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

describe('setStorageConfig', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should merge the player and storage config with priority to the storage config', () => {
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
    sandbox.stub(LocalStorageManager, 'isStorageAvailable').callsFake(() => true);
    sandbox.stub(LocalStorageManager, 'hasStorage').callsFake(() => true);
    sandbox.stub(LocalStorageManager, 'getStorageConfig').callsFake(() => storageConfig);
    SetupHelpers.setStorageConfig(config);
    config.playback.textLanguage.should.equal('eng');
    config.playback.audioLanguage.should.equal('fra');
  });

  it('should take the storage config in case no player config', () => {
    const config = { player: {} };
    const storageConfig = {
      playback: {
        textLanguage: 'eng',
        audioLanguage: 'fra'
      }
    };
    sandbox.stub(LocalStorageManager, 'isStorageAvailable').callsFake(() => true);
    sandbox.stub(LocalStorageManager, 'hasStorage').callsFake(() => true);
    sandbox.stub(LocalStorageManager, 'getStorageConfig').callsFake(() => storageConfig);
    SetupHelpers.setStorageConfig(config);
    config.playback.textLanguage.should.equal('eng');
    config.playback.audioLanguage.should.equal('fra');
  });
});

describe('supportLegacyOptions', () => {
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
        poster: Images.POSTER
      }
    },
    provider: {
      partnerId: 1091
    },
    ui: {
      components: {
        seekbar: {
          thumbsSprite: Images.THUMBNAILS_SPRITE
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
        poster: Images.POSTER
      }
    },
    provider: {
      partnerId: 1091
    },
    ui: {
      components: {
        seekbar: {
          thumbsSprite: Images.THUMBNAILS_SPRITE
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
      poster: Images.POSTER,
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
          thumbsSprite: Images.THUMBNAILS_SPRITE
        }
      }
    }
  };

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should transform options with the old structure', () => {
    SetupHelpers.supportLegacyOptions(legacyOptions);
    legacyOptions.should.deep.equal(options);
  });

  it('should not transform config with the new structure', () => {
    SetupHelpers.supportLegacyOptions(options);
    legacyOptions.should.deep.equal(options);
  });

  it('check method support duplicate configuration take the new configuration', () => {
    SetupHelpers.supportLegacyOptions(duplicateOptions);
    duplicateOptions.should.deep.equal(options);
  });
});

describe('plugins config', () => {
  let sandbox, isIOS;

  beforeEach(() => {
    isIOS = Env.isIOS;
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    Env.isIOS = isIOS;
    sandbox.restore();
  });

  it('should config bumper plugin according to the env and configuration', () => {
    Env.isIOS = true;
    const options = {
      provider: {
        partnerId: 1091
      },
      playback: {
        playsinline: false
      },
      plugins: {
        bumper: {},
        imadai: {}
      }
    };
    const defaultOptions = SetupHelpers.getDefaultOptions(options);
    defaultOptions.plugins.bumper.position.should.deep.equal([0]);
    defaultOptions.plugins.bumper.disableMediaPreload.should.be.true;
    defaultOptions.plugins.bumper.playOnMainVideoTag.should.be.true;
  });

  it('should not change the bumper plugin', () => {
    Env.isIOS = true;
    const options = {
      provider: {
        partnerId: 1091
      },
      playback: {
        playsinline: false
      },
      plugins: {
        bumper: {
          playOnMainVideoTag: false,
          position: [0, -1],
          disableMediaPreload: false
        },
        imadai: {}
      }
    };
    const defaultOptions = SetupHelpers.getDefaultOptions(options);
    defaultOptions.plugins.bumper.position.should.deep.equal([0, -1]);
    defaultOptions.plugins.bumper.disableMediaPreload.should.be.false;
    defaultOptions.plugins.bumper.playOnMainVideoTag.should.be.false;
  });
});

describe('ignoreServerConfig', () => {
  it('should use server config if ignoreServerConfig flag is not true', () => {
    const serverConfig = {
      playback: {
        mute: true
      }
    };
    TestUtils.setServerConfig(serverConfig);

    const options = {
      provider: {
        partnerId: 1091
      },
      playback: {
        autoplay: true
      }
    };

    const defaultOptions = SetupHelpers.getDefaultOptions(options);
    defaultOptions.playback.mute.should.be.true;
  });

  it('should not use server config if ignoreServerConfig flag is true', () => {
    const serverConfig = {
      playback: {
        mute: true
      }
    };
    TestUtils.setServerConfig(serverConfig);

    const options = {
      provider: {
        partnerId: 1091,
        ignoreServerConfig: true
      },
      playback: {
        autoplay: true
      }
    };

    const defaultOptions = SetupHelpers.getDefaultOptions(options);
    defaultOptions.playback.should.not.have.property('mute');
  });
});
