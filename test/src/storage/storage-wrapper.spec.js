import StorageWrapper from '../../../src/common/storage/storage-wrapper'

const STORAGE_PREFIX = __NAME__ + '_';

describe('StorageWrapper', function () {

  afterEach(function () {
    window.localStorage.clear();
  });

  it('should have size of 0', function () {
    StorageWrapper.size.should.equal(0);
  });

  it('should set an item in the local storage', function () {
    if (StorageWrapper._isLocalStorageAvailable) {
      let key = 'test';
      StorageWrapper.setItem(key, 1);
      StorageWrapper.size.should.equal(1);
      window.localStorage[STORAGE_PREFIX + key].should.exist;
      window.localStorage[STORAGE_PREFIX + key].should.equal('1');
    }
  });

  it('should get an item from the local storage', function () {
    if (StorageWrapper._isLocalStorageAvailable) {
      let key = 'test';
      StorageWrapper.setItem(key, 2);
      StorageWrapper.size.should.equal(1);
      let value = StorageWrapper.getItem(key);
      value.should.equal(2);
    }
  });

  it('should validate a wrong key', function (done) {
    try {
      StorageWrapper.setItem(2, 2);
    } catch (e) {
      done();
    }
  });
});
