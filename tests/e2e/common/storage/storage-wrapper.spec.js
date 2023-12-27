import StorageWrapper from '../../../../src/common/storage/storage-wrapper';

const STORAGE_PREFIX = __NAME__ + '_';

describe('StorageWrapper', () => {
  describe('LocalStorage', () => {
    afterEach(() => {
      window.localStorage.clear();
    });

    it('should have size of 0', () => {
      StorageWrapper.getStorageSize(window.localStorage).should.equal(0);
    });

    it('should set an item in the local storage', () => {
      if (StorageWrapper.isStorageAvailable(window.localStorage)) {
        const key = 'test';
        StorageWrapper.setItem(key, 1, window.localStorage);
        StorageWrapper.getStorageSize(window.localStorage).should.equal(1);
        window.localStorage[STORAGE_PREFIX + key].should.exist;
        window.localStorage[STORAGE_PREFIX + key].should.equal('1');
      }
    });

    it('should get an item from the local storage', () => {
      if (StorageWrapper.isStorageAvailable(window.localStorage)) {
        const key = 'test';
        StorageWrapper.setItem(key, 2, window.localStorage);
        StorageWrapper.getStorageSize(window.localStorage).should.equal(1);
        const value = StorageWrapper.getItem(key, window.localStorage);
        value.should.equal(2);
      }
    });

    it('should validate a wrong key', (done) => {
      try {
        StorageWrapper.setItem(2, 2, window.localStorage);
      } catch (e) {
        done();
      }
    });
  });

  describe('SessionStorage', () => {
    afterEach(() => {
      window.sessionStorage.clear();
    });

    it('should have size of 0', () => {
      StorageWrapper.getStorageSize(window.sessionStorage).should.equal(0);
    });

    it('should set an item in the session storage', () => {
      if (StorageWrapper.isStorageAvailable(window.sessionStorage)) {
        const key = 'test';
        StorageWrapper.setItem(key, 1, window.sessionStorage);
        StorageWrapper.getStorageSize(window.sessionStorage).should.equal(1);
        window.sessionStorage[STORAGE_PREFIX + key].should.exist;
        window.sessionStorage[STORAGE_PREFIX + key].should.equal('1');
      }
    });

    it('should get an item from the session storage', () => {
      if (StorageWrapper.isStorageAvailable(window.sessionStorage)) {
        const key = 'test';
        StorageWrapper.setItem(key, 2, window.sessionStorage);
        StorageWrapper.getStorageSize(window.sessionStorage).should.equal(1);
        const value = StorageWrapper.getItem(key, window.sessionStorage);
        value.should.equal(2);
      }
    });
  });
});
