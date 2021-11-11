import {useEffect} from 'react'

import {Lock} from '@utils'
import {isAPIResponse, APIPromise} from '@api'
import {useLocalStorage} from '@hooks/useLocalStorage'

const lock = new Lock()

type UseJSON<J> = {key: string; initialValue: J; version: number}
type Fetcher<J> = () => APIPromise<J>

function useJSON<J>(props: UseJSON<J>, fetchJSON: Fetcher<J>) {
  const [json, storeJSON, refreshJSON] = useLocalStorage<J>(props)

  const fetchCities = async () => {
    if (json) return

    if (lock.status) {
      await lock.promise
      return refreshJSON()
    }

    lock.createLock()
    const result = await fetchJSON()
    lock.resolveLock()

    if (isAPIResponse(result)) storeJSON(result.data)
  }

  useEffect(() => {
    fetchCities()
  }, [])

  return json
}

export default useJSON
