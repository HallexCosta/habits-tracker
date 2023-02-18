interface LocalStorageAdapterMethods {
  size(): number
  removeItem(key: string): void
  setItem<T extends {}>(key: string, value: T): void
  getItem<T extends {}>(key: string): T
  has(key: string): boolean
  size(): number
}

type HabitsTrackerLocalStorageKeysAdapter = 'user-logged'

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

  private mountWithPrefix(key: HabitsTrackerLocalStorageKeysAdapter) {
    return `${this.prefix}:${key}`
  }

  public removeItem(key: HabitsTrackerLocalStorageKeysAdapter): void {
    return this.storage.removeItem(this.mountWithPrefix(key))
  }

  public setItem<T>(key: HabitsTrackerLocalStorageKeysAdapter, value: T) {
    const payload = JSON.stringify(value)
    console.log('payload', this.mountWithPrefix(key), payload)
    this.storage.setItem(this.mountWithPrefix(key), payload)
  }

  public getItem<T>(key: HabitsTrackerLocalStorageKeysAdapter): T {
    return JSON.parse(
      this.storage.getItem(this.mountWithPrefix(key)) || '{}'
    ) as T
  }

  public has(key: HabitsTrackerLocalStorageKeysAdapter) {
    console.log(localStorage.getItem(this.mountWithPrefix(key)))
    console.log(this.mountWithPrefix(key))
    console.log('has', this.storage.getItem(this.mountWithPrefix(key)))
    return !!this.storage.getItem(this.mountWithPrefix(key))
  }
}
