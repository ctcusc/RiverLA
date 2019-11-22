class CachedItem<T> {
  private cache: T | null;

  private ttl: number;

  constructor(ttl: number) {
    this.cache = null;
    this.ttl = ttl;
  }

  get(): T | null {
    // retrieves an item from the cache or returns null if no item is found
    return this.cache;
  }

  set(value: T): void {
    // adds an item to the cache
    this.cache = value;
    setTimeout(() => {
      this.cache = null;
    }, this.ttl);
    //clearTimeout()?
  }
}

export default CachedItem;
