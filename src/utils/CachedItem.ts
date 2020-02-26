/**
 * A generic cache class to cache AirTable organizations
 *
 * This class acts as an in-memory caching layer for requests to AirTable server,
 * which stores recently retrieved AirTable organizations to help the users adhere
 * to the rate limit of AirTable API.
 */
class CachedItem<T> {
  private cache: T | null;
  private ttl: number;
  private startTime?: Date;

  constructor(ttl: number) {
    this.cache = null;
    this.ttl = ttl;
  }

  /**
   * Retrieves an item from the cache or returns null if no item is found.
   * Uses the Date object to identify if the item has reached its expiration time.
   * If the item has been stored for `ttl` milliseconds, invalidates the item.
   *
   * @returns the item of type T or null if the item is invalidated
   */
  get(): T | null {
    if (this.startTime !== undefined) {
      if (new Date().getTime() - this.startTime.getTime() >= this.ttl) {
        this.cache = null;
      }
    }
    return this.cache;
  }

  /**
   * Adds an item to the cache.
   * Uses the Date object to record the time the item is added, which helps identify
   * if the item needs to be expired after `ttl` milliseconds in get() function.
   *
   * @param value - an item of type T to be added to the cache
   */
  set(value: T): void {
    this.cache = value;
    this.startTime = new Date();
  }
}

export default CachedItem;
