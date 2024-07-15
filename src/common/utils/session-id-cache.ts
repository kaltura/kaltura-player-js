class SessionIdCache {
  private cache = new Map();

  public set(key: string, value: string): void {
    this.cache.set(key, value);
  }

  public get(key: string): string {
    return this.cache.get(key);
  }

  public clear(): void {
    this.cache.clear();
  }
}

export { SessionIdCache };
