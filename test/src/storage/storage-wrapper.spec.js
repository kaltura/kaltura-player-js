import StorageWrapper from '../../../src/storage/storage-wrapper'

describe('StorageWrapper', function () {
  let storage;
  let prefix = 'testPrefix.';

  beforeEach(function () {
    storage = new StorageWrapper(prefix);
  });

  afterEach(function () {
    storage = null;
    window.localStorage.clear();
  });

  it('should have size of 0', function () {
    storage.size.should.equal(0);
  });

  it('should set an item in the local storage', function () {
    if (storage._isLocalStorageAvailable) {
      let key = 'test';
      storage.setItem(key, 1);
      storage.size.should.equal(1);
      window.localStorage[prefix + key].should.exist;
      window.localStorage[prefix + key].should.equal('1');
    }
  });

  it('should get an item from the local storage', function () {
    if (storage._isLocalStorageAvailable) {
      let key = 'test';
      storage.setItem(key, 2);
      storage.size.should.equal(1);
      let value = storage.getItem(key);
      value.should.equal(2);
    }
  });

  it('should validate a wrong key', function (done) {
    try {
      storage.setItem(2, 2);
    } catch (e) {
      done();
    }
  });
});
