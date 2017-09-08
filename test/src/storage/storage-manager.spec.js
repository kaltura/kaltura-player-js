import StorageManager from '../../../src/storage/storage-manager'
import StorageWrapper from "../../../src/storage/storage-wrapper";

describe('StorageManager', function () {
  let storageManager;
  let sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    storageManager = null;
    sandbox.restore();
    window.localStorage.clear();
  });

  it('should return it has no storage', function () {
    sandbox.stub(StorageWrapper.prototype, '_testForLocalStorage').callsFake(() => {
      StorageWrapper.prototype._isLocalStorageAvailable = true;
    });
    sandbox.stub(StorageWrapper.prototype, 'size').get(() => {
      return 0;
    });
    storageManager = new StorageManager();
    storageManager.hasStorage().should.be.false;
  });

  it('should return it has storage', function () {
    sandbox.stub(StorageWrapper.prototype, '_testForLocalStorage').callsFake(() => {
      StorageWrapper.prototype._isLocalStorageAvailable = true;
    });
    sandbox.stub(StorageWrapper.prototype, 'size').get(() => {
      return 1;
    });
    storageManager = new StorageManager();
    storageManager.hasStorage().should.be.true;
  });

  it('should return config for volume', function () {
    sandbox.stub(StorageWrapper.prototype, '_testForLocalStorage').callsFake(() => {
      StorageWrapper.prototype._isLocalStorageAvailable = true;
    });
    sandbox.stub(StorageWrapper.prototype, 'size').get(() => {
      return 1;
    });
    sandbox.stub(StorageWrapper.prototype, 'getItem').withArgs('volume').returns(1);
    storageManager = new StorageManager();
    storageManager.getStorage().should.deep.equal({
      playback: {
        volume: 1
      }
    });
  });

  it('should return config for all properties', function () {
    sandbox.stub(StorageWrapper.prototype, '_testForLocalStorage').callsFake(() => {
      StorageWrapper.prototype._isLocalStorageAvailable = true;
    });
    let getItemStub = sandbox.stub(StorageWrapper.prototype, 'getItem');
    getItemStub.withArgs('volume').returns(0.5);
    getItemStub.withArgs('muted').returns(false);
    getItemStub.withArgs('textLanguage').returns('heb');
    getItemStub.withArgs('audioLanguage').returns('eng');
    storageManager = new StorageManager();
    storageManager.getStorage().should.deep.equal({
      playback: {
        volume: 0.5,
        muted: false,
        textLanguage: 'heb',
        audioLanguage: 'eng'
      }
    });
  });

  it('should attaches listeners', function () {
    sandbox.stub(StorageWrapper.prototype, '_testForLocalStorage').callsFake(() => {
      StorageWrapper.prototype._isLocalStorageAvailable = true;
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
    storageManager = new StorageManager();
    storageManager.attach(fakePlayer);
    fakePlayer.listeners.should.have.length.of(3);
    fakePlayer.listeners.should.deep.equal([
      'volumechange',
      'audiotrackchanged',
      'texttrackchanged'
    ]);
  });
});
