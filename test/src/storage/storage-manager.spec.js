import StorageManager from '../../../src/storage/storage-manager'
import StorageWrapper from "../../../src/storage/storage-wrapper";

describe('StorageManager', function () {
  let sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
    window.localStorage.clear();
  });

  it('should return it has no storage', function () {
    sandbox.stub(StorageWrapper, '_testForLocalStorage').callsFake(() => {
      StorageWrapper._isLocalStorageAvailable = true;
    });
    sandbox.stub(StorageWrapper, 'size').get(() => {
      return 0;
    });
    StorageManager.hasStorage().should.be.false;
  });

  it('should return it has storage', function () {
    sandbox.stub(StorageWrapper, '_testForLocalStorage').callsFake(() => {
      StorageWrapper.prototype._isLocalStorageAvailable = true;
    });
    sandbox.stub(StorageWrapper, 'size').get(() => {
      return 1;
    });
    StorageManager.hasStorage().should.be.true;
  });

  it('should return config for volume', function () {
    sandbox.stub(StorageWrapper, '_testForLocalStorage').callsFake(() => {
      StorageWrapper._isLocalStorageAvailable = true;
    });
    sandbox.stub(StorageWrapper, 'size').get(() => {
      return 1;
    });
    sandbox.stub(StorageWrapper, 'getItem').withArgs('volume').returns(1);
    StorageManager.getStorage().should.deep.equal({
      playback: {
        volume: 1
      }
    });
  });

  it('should return config for all properties', function () {
    sandbox.stub(StorageWrapper, '_testForLocalStorage').callsFake(() => {
      StorageWrapper._isLocalStorageAvailable = true;
    });
    let getItemStub = sandbox.stub(StorageWrapper, 'getItem');
    getItemStub.withArgs('volume').returns(0.5);
    getItemStub.withArgs('muted').returns(false);
    getItemStub.withArgs('textLanguage').returns('heb');
    getItemStub.withArgs('audioLanguage').returns('eng');
    StorageManager.getStorage().should.deep.equal({
      playback: {
        volume: 0.5,
        muted: false,
        textLanguage: 'heb',
        audioLanguage: 'eng'
      }
    });
  });

  it('should attaches listeners', function () {
    sandbox.stub(StorageWrapper, '_testForLocalStorage').callsFake(() => {
      StorageWrapper._isLocalStorageAvailable = true;
    });
    let fakePlayer = {
      listeners: [],
      Event: {
        VOLUME_CHANGE: 'volumechange',
        AUDIO_TRACK_CHANGED: 'audiotrackchanged',
        TEXT_TRACK_CHANGED: 'texttrackchanged'
      },
      addEventListener: function (eventName) {
        this.listeners.push(eventName);
      }
    };
    StorageManager.attach(fakePlayer);
    fakePlayer.listeners.should.have.length.of(3);
    fakePlayer.listeners.should.deep.equal([
      'volumechange',
      'audiotrackchanged',
      'texttrackchanged'
    ]);
  });
});
