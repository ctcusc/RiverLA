class CachedItem<T> {
  private cache: T | null;
  private ttl: number;
  private startTime?: Date;

  constructor(ttl: number) {
    this.cache = null;
    this.ttl = ttl;
  }

  get(): T | null {
    if (this.startTime !== undefined) {
      if (new Date().getTime() - this.startTime.getTime() >= this.ttl) {
        this.cache = null;
      }
    }
    return this.cache;
  }

  set(value: T): void {
    this.cache = value;
    this.startTime = new Date();
  }
}

export default CachedItem;
