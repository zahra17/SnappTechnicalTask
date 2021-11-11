import {useState} from 'react'

const TIMEOUT = +process.env.CASH_TIMEOUT!
type Storage<V> = {value: V; created: number; version: number}
type LocalStorageArgs<V> = {key: string; initialValue: V; version: number}
const isServer = typeof window === 'undefined'

const restore = (key: string) => {
  try {
    return isServer ? '' : window.localStorage.getItem(key)
  } catch (error) {
    return null
  }
}

const store = (key: string, value: string) => {
  try {
    if (!isServer) {
      window.localStorage.setItem(key, value)
    }
  } catch (error) {
    return
  }
}

export function useLocalStorage<V = any>({
  key,
  initialValue,
  version,
}: LocalStorageArgs<V>): [V, (value: V) => void, () => void] {
  const [storedValue, setStoredValue] = useState<V>(() => {
    const now = new Date().getTime()
    const item = restore(key)
    if (item) {
      const {value, created, version: oldV}: Storage<V> = JSON.parse(item)
      if (now - created > TIMEOUT || oldV !== version) return initialValue
      return value
    } else return initialValue
  })

  const setValue = (value: V) => {
    const created = new Date().getTime()
    setStoredValue(value)
    const storage: Storage<V> = {value, created, version}
    store(key, JSON.stringify(storage))
  }

  const refreshValue = () => {
    const item = restore(key)
    setStoredValue(item ? JSON.parse(item).value : initialValue)
  }

  return [storedValue, setValue, refreshValue]
}
