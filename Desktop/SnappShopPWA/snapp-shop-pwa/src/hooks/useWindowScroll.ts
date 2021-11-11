import {useEffect} from 'react'
import debounce from 'lodash/debounce'

interface ScrollOptions {
  wait?: number
  callback: () => void
  deps?: unknown[]
}

export function useWindowScroll({
  callback,
  wait = 0,
  deps = [],
}: ScrollOptions) {
  useEffect(() => {
    const debouncedHandler = debounce(callback, wait)
    window.addEventListener('scroll', debouncedHandler)
    return () => {
      window.removeEventListener('scroll', debouncedHandler)
    }
  }, deps)
}
