class CachedItem<T> {
  private cache: T | null;
  private ttl: number;
  private startTime?: Date;
  private endTime?: Date;

  constructor(ttl: number) {
    this.cache = null;
    this.ttl = ttl;
  }

  get(): T | null {
    // retrieves an item from the cache or returns null if no item is found
    this.endTime = new Date();
    if (this.startTime !== undefined) {
      if (this.endTime.getTime() - this.startTime.getTime() >= this.ttl) {
        this.cache = null;
      }
    }
    return this.cache;
  }

  set(value: T): void {
    // adds an item to the cache
    // this item should become invalidated after `ttl` milliseconds
    this.cache = value;
    this.startTime = new Date();
  }
}

export default CachedItem;
