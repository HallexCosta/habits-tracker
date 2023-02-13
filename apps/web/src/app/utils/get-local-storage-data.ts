type LocalStorageKeys = 'user-logged'

export function getLocalStorageData<T>(key: LocalStorageKeys): T {
  const prefix = '@habits-tracker'
  const keyWithPrefix = `${prefix}:${key}`
  const data = localStorage.getItem(keyWithPrefix) || '{}'
  return JSON.parse(data) as T
}

export function setLocalStorageData<T extends {}>(
  key: LocalStorageKeys,
  data: T
) {
  const prefix = '@habits-tracker'
  const keyWithPrefix = `${prefix}:${key}`
  localStorage.setItem(keyWithPrefix, JSON.stringify(data))
}
