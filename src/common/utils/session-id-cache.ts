class SessionIdCache {
  private cache = new Map();

  public set(key: string, value: string) {
    this.cache.set(key, value);
  }

  public get(key: string): string {
    return this.cache.get(key);
  }

  public clear() {
    this.cache.clear();
  }
}

export { SessionIdCache };
