interface LocalStorageAdapterMethods {
  size(): number
  removeItem(key: string): void
  setItem<T extends {}>(key: string, value: T): void
  getItem<T extends {}>(key: string): T
  has(key: string): boolean
  size(): number
}

interface HabitsTrackerLocalStorageAdapterMethods
  extends LocalStorageAdapterMethods {}

export class HabitsTrackerLocalStorageAdapter
  implements HabitsTrackerLocalStorageAdapterMethods
{
  constructor(private storage: Storage, private prefix: string) {}

  public size(): number {
    let size = 0
    for (const key in localStorage) {
      if (key.startsWith(this.prefix)) {
        size++
      }
    }
    return size
  }
  /**
   * Removes all key/value pairs by prefix, if there are any.
   */
  public clear(): void {
    for (const key in localStorage) {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key)
      }
    }
  }

  private mountWithPrefix(key: string) {
    return `${this.prefix}:${key}`
  }

  public removeItem(key: string): void {
    return this.storage.removeItem(this.mountWithPrefix(key))
  }

  public setItem<T>(key: string, value: T) {
    const payload = JSON.stringify(value)
    this.storage.setItem(this.mountWithPrefix(key), payload)
  }

  public getItem<T>(key: string): T {
    return JSON.parse(
      this.storage.getItem(this.mountWithPrefix(key)) || '{}'
    ) as T
  }

  public has(key: string) {
    return !!this.storage.getItem(this.mountWithPrefix(key))
  }
}
