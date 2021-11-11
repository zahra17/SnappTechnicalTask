import {useLayoutEffect} from 'react'

export function useSmoothScroll() {
  useLayoutEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = 'initial'
    }
  }, [])
}
