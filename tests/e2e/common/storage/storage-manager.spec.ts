import LocalStorageManager from '../../../../src/common/storage/local-storage-manager';
import StorageWrapper from '../../../../src/common/storage/storage-wrapper';
import * as TestUtils from '../../../utils/test-utils';
import { setup } from '../../../../src';
import { FakeEvent } from '@playkit-js/playkit-js';
import { setStorageTextStyle } from '../../../../src/common/utils/setup-helpers';

const targetId = 'player-placeholder_storage-manager.spec';

describe('StorageManager', (): any => {
  let config, player, sandbox;
  const partnerId = 1091;
  const entryId = '0_wifqaipd';
  const env = {
    cdnUrl: 'https://qa-apache-php7.dev.kaltura.com/',
    serviceUrl: 'https://qa-apache-php7.dev.kaltura.com/api_v3'
  };

  beforeEach((): any => {
    TestUtils.createElement('DIV', targetId);
    sandbox = sinon.createSandbox();
    config = {
      targetId: targetId,
      provider: {
        partnerId: partnerId,
        env
      }
    };
    LocalStorageManager.initialize();
  });

  afterEach((): any => {
    sandbox.restore();
    TestUtils.removeVideoElementsFromTestPage();
    TestUtils.removeElement(targetId);
    window.localStorage.clear();
  });

  it('should return it has no storage', () => {
    StorageWrapper._testForLocalStorage = (): any => (StorageWrapper._isLocalStorageAvailable = true);
    sandbox.stub(StorageWrapper, 'getStorageSize').returns(0);
    LocalStorageManager.hasStorage().should.be.false;
  });

  it('should return it has storage', () => {
    StorageWrapper._testForLocalStorage = (): any => (StorageWrapper._isLocalStorageAvailable = true);
    sandbox.stub(StorageWrapper, 'getStorageSize').returns(1);
    LocalStorageManager.hasStorage().should.be.true;
  });

  it('should return config for volume', () => {
    StorageWrapper._testForLocalStorage = (): any => (StorageWrapper._isLocalStorageAvailable = true);
    sandbox.stub(StorageWrapper, 'getStorageSize').returns(1);
    sandbox.stub(StorageWrapper, 'getItem').withArgs('volume').returns(1);
    LocalStorageManager.getStorageConfig().should.deep.equal({
      playback: {
        volume: 1
      }
    });
  });

  it('should return config for all properties', () => {
    StorageWrapper._testForLocalStorage = (): any => (StorageWrapper._isLocalStorageAvailable = true);
    const getItemStub = sandbox.stub(StorageWrapper, 'getItem');
    getItemStub.withArgs('volume').returns(0.5);
    getItemStub.withArgs('muted').returns(false);
    getItemStub.withArgs('textLanguage').returns('heb');
    getItemStub.withArgs('audioLanguage').returns('eng');
    LocalStorageManager.getStorageConfig().should.deep.equal({
      playback: {
        volume: 0.5,
        muted: false,
        textLanguage: 'heb',
        audioLanguage: 'eng'
      }
    });
  });

  it.skip('should set muted to true/false depends on changed volume', (done) => {
    StorageWrapper._testForLocalStorage = (): any => (StorageWrapper._isLocalStorageAvailable = true);
    player = setup(config);
    player.loadMedia({ entryId: entryId }).then(() => {
      try {
        player.muted = true;
        player.dispatchEvent(new FakeEvent(player.Event.UI.USER_CLICKED_MUTE));
        LocalStorageManager.getStorageConfig().playback.muted.should.be.true;
        player.volume = 0.5;
        player.dispatchEvent(new FakeEvent(player.Event.UI.USER_CHANGED_VOLUME));
        LocalStorageManager.getStorageConfig().playback.muted.should.be.false;
        LocalStorageManager.getStorageConfig().playback.volume.should.equals(0.5);
        player.volume = 0;
        player.dispatchEvent(new FakeEvent(player.Event.UI.USER_CHANGED_VOLUME));
        LocalStorageManager.getStorageConfig().playback.muted.should.be.true;
        LocalStorageManager.getStorageConfig().playback.volume.should.equals(0);
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it('should set textStyle of player with textStyle from local storage', () => {
    const player = {
      config: {
        disableUserCache: false
      },
      textStyle: {
        fontFamily: 'Verdana'
      }
    };
    sandbox.stub(LocalStorageManager, 'getPlayerTextStyle').returns({ fontFamily: 'Arial' });
    sandbox.stub(LocalStorageManager, 'isStorageAvailable').returns(true);
    setStorageTextStyle(player);
    player.textStyle.fontFamily.should.equal('Arial');
  });

  it('should not change textStyle of player', () => {
    const player = {
      config: {
        disableUserCache: true
      },
      textStyle: {
        fontFamily: 'Verdana'
      }
    };
    sandbox.stub(LocalStorageManager, 'getPlayerTextStyle').returns({ fontFamily: 'Arial' });
    sandbox.stub(LocalStorageManager, 'isStorageAvailable').returns(true);
    setStorageTextStyle(player);
    player.textStyle.fontFamily.should.equal('Verdana');
  });

  it.skip('should set textLanguage depends on CC toggle', (done) => {
    StorageWrapper._testForLocalStorage = (): any => (StorageWrapper._isLocalStorageAvailable = true);
    player = setup(config);
    player.loadMedia({ entryId: entryId }).then(() => {
      player.load();
      player.ready().then(() => {
        try {
          player.dispatchEvent(
            new FakeEvent(player.Event.UI.USER_SHOWED_CAPTIONS, {
              element: 'ClosedCaptions'
            })
          );
          player.addEventListener(player.Event.TEXT_TRACK_CHANGED, (event) => {
            const { selectedTextTrack } = event.payload;
            setTimeout(() => {
              try {
                LocalStorageManager.getStorageConfig().playback.textLanguage.should.be.equal(selectedTextTrack.language);
                if (selectedTextTrack.language === 'off') {
                  done();
                  return;
                }
                player.dispatchEvent(
                  new FakeEvent(player.Event.UI.USER_HID_CAPTIONS, {
                    element: 'ClosedCaptions'
                  })
                );
                player.hideTextTrack();
              } catch (err) {
                done(err);
              }
            });
          });
          player.showTextTrack();
        } catch (err) {
          done(err);
        }
      });
    });
  });
});
