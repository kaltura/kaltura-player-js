import StorageManager from '../../../../src/common/storage/storage-manager';
import StorageWrapper from '../../../../src/common/storage/storage-wrapper';
import * as TestUtils from '../../utils/test-utils';
import {setup} from '../../../../src';
import {FakeEvent} from '@playkit-js/playkit-js';
import {setStorageTextStyle} from '../../../../src/common/utils/setup-helpers';

const targetId = 'player-placeholder_storage-manager.spec';

describe('StorageManager', function () {
  let config, player, sandbox;
  const partnerId = 1091;
  const entryId = '0_wifqaipd';
  const env = {
    cdnUrl: 'https://qa-apache-php7.dev.kaltura.com/',
    serviceUrl: 'https://qa-apache-php7.dev.kaltura.com/api_v3'
  };

  beforeEach(function () {
    TestUtils.createElement('DIV', targetId);
    sandbox = sinon.createSandbox();
    config = {
      targetId: targetId,
      provider: {
        partnerId: partnerId,
        env
      }
    };
  });

  afterEach(function () {
    sandbox.restore();
    TestUtils.removeVideoElementsFromTestPage();
    TestUtils.removeElement(targetId);
    window.localStorage.clear();
  });

  it('should return it has no storage', function () {
    StorageWrapper._testForLocalStorage = () => (StorageWrapper._isLocalStorageAvailable = true);
    sandbox.stub(StorageWrapper, 'size').get(() => 0);
    StorageManager.hasStorage().should.be.false;
  });

  it('should return it has storage', function () {
    StorageWrapper._testForLocalStorage = () => (StorageWrapper._isLocalStorageAvailable = true);
    sandbox.stub(StorageWrapper, 'size').get(() => 1);
    StorageManager.hasStorage().should.be.true;
  });

  it('should return config for volume', function () {
    StorageWrapper._testForLocalStorage = () => (StorageWrapper._isLocalStorageAvailable = true);
    sandbox.stub(StorageWrapper, 'size').get(() => 1);
    sandbox.stub(StorageWrapper, 'getItem').withArgs('volume').returns(1);
    StorageManager.getStorageConfig().should.deep.equal({
      playback: {
        volume: 1
      }
    });
  });

  it('should return config for all properties', function () {
    StorageWrapper._testForLocalStorage = () => (StorageWrapper._isLocalStorageAvailable = true);
    let getItemStub = sandbox.stub(StorageWrapper, 'getItem');
    getItemStub.withArgs('volume').returns(0.5);
    getItemStub.withArgs('muted').returns(false);
    getItemStub.withArgs('textLanguage').returns('heb');
    getItemStub.withArgs('audioLanguage').returns('eng');
    StorageManager.getStorageConfig().should.deep.equal({
      playback: {
        volume: 0.5,
        muted: false,
        textLanguage: 'heb',
        audioLanguage: 'eng'
      }
    });
  });

  it('should set muted to true/false depends on changed volume', function (done) {
    StorageWrapper._testForLocalStorage = () => (StorageWrapper._isLocalStorageAvailable = true);
    player = setup(config);
    player
      .loadMedia({entryId: entryId})
      .then(() => {
        try {
          player.muted = true;
          player.dispatchEvent(new FakeEvent(player.Event.UI.USER_CLICKED_MUTE));
          StorageManager.getStorageConfig().playback.muted.should.be.true;
          player.volume = 0.5;
          player.dispatchEvent(new FakeEvent(player.Event.UI.USER_CHANGED_VOLUME));
          StorageManager.getStorageConfig().playback.muted.should.be.false;
          StorageManager.getStorageConfig().playback.volume.should.equals(0.5);
          player.volume = 0;
          player.dispatchEvent(new FakeEvent(player.Event.UI.USER_CHANGED_VOLUME));
          StorageManager.getStorageConfig().playback.muted.should.be.true;
          StorageManager.getStorageConfig().playback.volume.should.equals(0);
          done();
        } catch (err) {
          done(err);
        }
      })
      .catch(err => {
        done(err);
      });
  });

  it('should set textStyle of player with textStyle from local storage', function () {
    let player = {
      config: {
        disableUserCache: false
      },
      textStyle: {
        fontFamily: 'Verdana'
      }
    };
    sandbox.stub(StorageManager, 'getPlayerTextStyle').returns({fontFamily: 'Arial'});
    sandbox.stub(StorageManager, 'isLocalStorageAvailable').returns(true);
    setStorageTextStyle(player);
    player.textStyle.fontFamily.should.equal('Arial');
  });

  it('should not change textStyle of player', function () {
    let player = {
      config: {
        disableUserCache: true
      },
      textStyle: {
        fontFamily: 'Verdana'
      }
    };
    sandbox.stub(StorageManager, 'getPlayerTextStyle').returns({fontFamily: 'Arial'});
    sandbox.stub(StorageManager, 'isLocalStorageAvailable').returns(true);
    setStorageTextStyle(player);
    player.textStyle.fontFamily.should.equal('Verdana');
  });

  it('should set textLanguage depends on CC toggle', function (done) {
    StorageWrapper._testForLocalStorage = () => (StorageWrapper._isLocalStorageAvailable = true);
    player = setup(config);
    player.loadMedia({entryId: entryId}).then(() => {
      player.load();
      player.ready().then(() => {
        try {
          player.dispatchEvent(new FakeEvent(player.Event.UI.USER_SHOWED_CAPTIONS, {element: 'ClosedCaptions'}));
          player.addEventListener(player.Event.TEXT_TRACK_CHANGED, event => {
            const {selectedTextTrack} = event.payload;
            setTimeout(() => {
              try {
                StorageManager.getStorageConfig().playback.textLanguage.should.be.equal(selectedTextTrack.language);
                if (selectedTextTrack.language === 'off') {
                  done();
                  return;
                }
                player.dispatchEvent(new FakeEvent(player.Event.UI.USER_HID_CAPTIONS, {element: 'ClosedCaptions'}));
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
