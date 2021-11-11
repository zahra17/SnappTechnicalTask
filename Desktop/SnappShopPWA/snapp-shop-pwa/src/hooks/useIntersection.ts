import {useRef, useEffect} from 'react'

export function useIntersection<E extends HTMLElement>(
  options: IntersectionObserverInit,
  handler: IntersectionObserverCallback
) {
  const elRef = useRef<E>(null)

  useEffect(() => {
    if (elRef.current) {
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(handler, options)
        observer.observe(elRef.current)
        return () => observer.disconnect()
      }
    }
  }, [elRef, options, handler])
  return elRef
}
