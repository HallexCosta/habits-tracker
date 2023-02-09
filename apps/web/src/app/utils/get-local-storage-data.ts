type LocalStorageKeys = 'userLogged'

export function getLocalStorageData<T>(key: LocalStorageKeys): T {
  const data = localStorage.getItem(key) || '{}'
  return JSON.parse(data) as T
}
