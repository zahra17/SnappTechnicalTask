import {useState, useEffect, Dispatch, SetStateAction} from 'react'
import debounce from 'lodash/debounce'
type Args = {threshold?: number; node?: HTMLElement | null}

export function useScrollEnd({threshold = 0.95, node}: Args = {}): [
  boolean,
  Dispatch<SetStateAction<boolean>>
] {
  const [isEnd, setIsEnd] = useState<boolean>(false)
  useEffect(() => {
    const container = node || window
    const scrollable = (node || document.scrollingElement) as HTMLElement
    const isSafari = /Apple/.test(navigator.vendor)
    const handleScroll = () => {
      if (!isEnd) {
        const scrollTop = node
          ? node.scrollTop
          : (container as Window).pageYOffset

        const height =
          scrollTop + (node ? scrollable.offsetHeight : window.innerHeight)
        if (scrollable instanceof HTMLElement) {
          if (
            height >=
            (node ? scrollable.scrollHeight : scrollable.offsetHeight) *
              threshold
          ) {
            setIsEnd(true)
          } else setIsEnd(false)
        }
      }
    }
    const debouncedScrollHandler = debounce(handleScroll, 100)
    const clear = () => {
      container.removeEventListener('scroll', debouncedScrollHandler)
      isSafari &&
        container.removeEventListener('touchend', debouncedScrollHandler)
    }
    container.addEventListener('scroll', debouncedScrollHandler)
    isSafari && container.addEventListener('touchend', debouncedScrollHandler)
    return clear
  }, [node, isEnd])

  return [isEnd, setIsEnd]
}
