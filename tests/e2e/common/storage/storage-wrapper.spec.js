import StorageWrapper from '../../../../src/common/storage/storage-wrapper';

const STORAGE_PREFIX = __NAME__ + '_';

describe('StorageWrapper', () => {
  afterEach(() => {
    window.localStorage.clear();
  });

  it('should have size of 0', () => {
    StorageWrapper.size.should.equal(0);
  });

  it('should set an item in the local storage', () => {
    if (StorageWrapper._isLocalStorageAvailable) {
      const key = 'test';
      StorageWrapper.setItem(key, 1);
      StorageWrapper.size.should.equal(1);
      window.localStorage[STORAGE_PREFIX + key].should.exist;
      window.localStorage[STORAGE_PREFIX + key].should.equal('1');
    }
  });

  it('should get an item from the local storage', () => {
    if (StorageWrapper._isLocalStorageAvailable) {
      const key = 'test';
      StorageWrapper.setItem(key, 2);
      StorageWrapper.size.should.equal(1);
      const value = StorageWrapper.getItem(key);
      value.should.equal(2);
    }
  });

  it('should validate a wrong key', (done) => {
    try {
      StorageWrapper.setItem(2, 2);
    } catch (e) {
      done();
    }
  });
});
