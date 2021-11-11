import {useState, useEffect} from 'react'
import {useWindowScroll} from './useWindowScroll'

type SSRRect = {
  bottom: number
  height: number
  left: number
  right: number
  top: number
  width: number
  x: number
  y: number
}
const EmptySSRRect: SSRRect = {
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  x: 0,
  y: 0,
}

const useScroll = () => {
  const [lastScrollTop, setLastScrollTop] = useState<number>(0)
  const [bodyOffset, setBodyOffset] = useState<DOMRect | SSRRect>(
    typeof window === 'undefined' || !window.document
      ? EmptySSRRect
      : document.body.getBoundingClientRect()
  )
  const [scrollY, setScrollY] = useState<number>(bodyOffset.top)
  const [scrollX, setScrollX] = useState<number>(bodyOffset.left)
  const [scrollDirection, setScrollDirection] = useState<
    'down' | 'up' | undefined
  >()

  const listener = () => {
    setBodyOffset(
      typeof window === 'undefined' || !window.document
        ? EmptySSRRect
        : document.body.getBoundingClientRect()
    )
    setScrollY(-bodyOffset.top)
    setScrollX(bodyOffset.left)
    setScrollDirection(lastScrollTop > -bodyOffset.top ? 'up' : 'down')
    setLastScrollTop(-bodyOffset.top)
  }

  useWindowScroll({
    callback: listener,
    wait: 10,
    deps: [lastScrollTop, bodyOffset],
  })

  return {
    scrollY,
    scrollX,
    scrollDirection,
  }
}

export {useScroll}

// src: https://gist.github.com/joshuacerbito/ea318a6a7ca4336e9fadb9ae5bbb87f4
