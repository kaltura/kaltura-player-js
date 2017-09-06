// @flow
export default class LocalStorageWrapper {
  _isLocalStorageAvailable: boolean;
  _prefix: ?string;

  constructor(prefix: ?string) {
    this._testForLocalStorage();
    this._prefix = prefix;
  }

  /**
   * @return {number} - The number of keys in the local storage.
   */
  get length(): number {
    if (this._isLocalStorageAvailable) {
      return Object.keys(localStorage).filter((key) => key.startsWith(this._prefix)).length;
    }
    return 0;
  }

  /**
   * Sets an item in the local storage.
   * @param {string} key - The key of the item.
   * @param {any} data - The value of the item.
   * @returns {void}
   */
  setItem(key: string, data: any): void {
    this._validateKey(key);
    if (this._isLocalStorageAvailable) {
      try {
        localStorage.setItem(this._prefix + key, data);
      } catch (e) {

      }
    }
  }

  getItem(key: string): any {
    this._validateKey(key);
    if (this._isLocalStorageAvailable) {
      try {
        return JSON.parse(localStorage.getItem(this._prefix + key));
      } catch (e) {
        return localStorage.getItem(this._prefix + key);
      }
    }
  }

  _isQuotaExceeded(e: any): void {
    let quotaExceeded = false;
    if (e) {
      if (e.code) {
        switch (e.code) {
          case 22:
            quotaExceeded = true;
            break;
          case 1014:
            // Firefox
            if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
              quotaExceeded = true;
            }
            break;
        }
      } else if (e.number === -2147024882) {
        // Internet Explorer 8
        quotaExceeded = true;
      }
      return quotaExceeded;
    }
  }

  _testForLocalStorage(): void {
    if (typeof Storage !== 'undefined') {
      try {
        localStorage.setItem('test', null);
        localStorage.removeItem('test');
        this._isLocalStorageAvailable = true;
      }
      catch (e) {
        this._isLocalStorageAvailable = false;
      }
    } else {
      this._isLocalStorageAvailable = false;
    }
  }

  _validateKey(key: string): void {
    if (typeof key !== 'string' || key.length === 0) {
      throw new Error('Invalid key');
    }
  }
}
