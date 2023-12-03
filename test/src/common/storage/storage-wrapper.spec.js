import StorageWrapper from '../../../../src/common/storage/storage-wrapper';

const STORAGE_PREFIX = __NAME__ + '_';

describe('StorageWrapper', function () {
  describe('LocalStorage', () => {
    afterEach(function () {
      window.localStorage.clear();
    });

    it('should have size of 0', function () {
      StorageWrapper.getStorageSize().should.equal(0);
    });

    it('should set an item in the local storage', function () {
      if (StorageWrapper.isStorageAvailable()) {
        let key = 'test';
        StorageWrapper.setItem(key, 1);
        StorageWrapper.getStorageSize().should.equal(1);
        window.localStorage[STORAGE_PREFIX + key].should.exist;
        window.localStorage[STORAGE_PREFIX + key].should.equal('1');
      }
    });

    it('should get an item from the local storage', function () {
      if (StorageWrapper.isStorageAvailable()) {
        let key = 'test';
        StorageWrapper.setItem(key, 2);
        StorageWrapper.getStorageSize().should.equal(1);
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

  describe('SessionStorage', () => {
    afterEach(function () {
      window.sessionStorage.clear();
    });

    it('should have size of 0', function () {
      StorageWrapper.getStorageSize(window.sessionStorage).should.equal(0);
    });

    it('should set an item in the session storage', function () {
      if (StorageWrapper.isStorageAvailable(window.sessionStorage)) {
        let key = 'test';
        StorageWrapper.setItem(key, 1, window.sessionStorage);
        StorageWrapper.getStorageSize(window.sessionStorage).should.equal(1);
        window.sessionStorage[STORAGE_PREFIX + key].should.exist;
        window.sessionStorage[STORAGE_PREFIX + key].should.equal('1');
      }
    });

    it('should get an item from the session storage', function () {
      if (StorageWrapper.isStorageAvailable(window.sessionStorage)) {
        let key = 'test';
        StorageWrapper.setItem(key, 2, window.sessionStorage);
        StorageWrapper.getStorageSize(window.sessionStorage).should.equal(1);
        let value = StorageWrapper.getItem(key, window.sessionStorage);
        value.should.equal(2);
      }
    });
  });
});
