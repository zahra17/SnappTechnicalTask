import {useRef, useCallback, useEffect, useState} from 'react'
import {ResizeObserver as ResizeObserverPolyfill} from '@juggle/resize-observer'

export default function useResizeObserver() {
  const [size, setSize] = useState({width: 0, height: 0})
  const [windowSize, setWindowSize] = useState({width: 0, height: 0})
  const resizeObserver = useRef<ResizeObserverPolyfill | ResizeObserver | null>(
    null
  )

  const onResize = useCallback(entries => {
    const {width, height} = entries[0].contentRect
    setSize({width, height})
  }, [])

  const ref = useCallback(
    node => {
      if (node !== null) {
        if (resizeObserver.current) {
          resizeObserver.current.disconnect()
        }
        resizeObserver.current = window.ResizeObserver
          ? new ResizeObserver(onResize)
          : new ResizeObserverPolyfill(onResize)
        resizeObserver.current.observe(node)
      }
    },
    [onResize]
  )

  useEffect(() => {
    setWindowSize({height: window.innerHeight, width: window.innerWidth})
  }, [])

  useEffect(
    () => () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect()
      }
    },
    []
  )

  return {
    ref,
    width: size.width,
    height: size.height,
    windowWidth: windowSize.width,
    windowHeight: windowSize.height,
  }
}

// src: https://gist.github.com/DominicTobias/c8579667e8a8bd7817c1b4d5b274eb4c
