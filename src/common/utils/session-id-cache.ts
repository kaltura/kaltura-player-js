class SessionIdCache {
  private cache = new Map();

  public set(key: string, value: string) {
    // debugger;

    console.log('>>> SessionIdCache.set', key, value);

    this.cache.set(key, value);
  }

  public get(key: string) {
    console.log('>>> SessionIdCache.get', key, this.cache.get(key));

    return this.cache.get(key);
  }

  public clear() {
    this.cache.clear();
  }
}

export { SessionIdCache };
