import React, {useEffect} from 'react'
import {Tag} from '~search/types'

export const useSetIndicatorAnimation = (
  tag: Tag,
  nodeRef: React.RefObject<HTMLDivElement>
) => {
  useEffect(() => {
    // indicator is the white background box
    const indicator = document.querySelector('.indicator') as HTMLDivElement
    if (!indicator || !tag.selected) return
    const elem = nodeRef.current as HTMLDivElement
    const prevIndex = document.body.getAttribute('data-prev-index') || -1
    const prevIsSubTag = document.body.getAttribute('data-is-subtag')
    const isBase = document.body.getAttribute('data-base')
    const prevElem =
      (Number(prevIndex) === 0 && !prevIsSubTag) || Number(prevIndex) === -2
        ? (document.querySelector('.filterTag') as HTMLDivElement)
        : (document.querySelector(
            `.filterTag[data-index = "${prevIndex}"][data-subtag="true"]`
          ) as HTMLDivElement) ||
          (document.querySelector('.filterTag') as HTMLDivElement)
    if (isBase || (Number(prevIndex) === -1 && prevIsSubTag === 'false')) {
      indicator.style.left = `${elem.offsetLeft}px`
      indicator.style.width = `${elem.offsetWidth}px`
    } else {
      indicator.animate(
        [
          {
            left: `${prevElem.offsetLeft}px`,
            width: `${prevElem.offsetWidth}px`,
          },
          {
            left: `${elem.offsetLeft}px`,
            width: `${elem.offsetWidth}px`,
          },
        ],
        {
          duration: 150,
          fill: 'forwards',
          easing: 'ease-out',
        }
      )
    }
  }, [])
}

export const useFilterTagAnimation = (activeIndex: number) => {
  useEffect(() => {
    const activeElements = document.querySelectorAll('[aria-checked="true"]')
    if (activeElements.length === 1) {
      const activeElem = document.querySelector('.headText') as HTMLDivElement
      const indicator = document.querySelector('.indicator') as HTMLDivElement
      indicator.style.left = `${activeElem.offsetLeft}px`
      indicator.style.width = `${activeElem.offsetWidth}px`
    }
    if (activeIndex === -1) {
      document.body.setAttribute('data-prev-index', String(-1))
      document.body.setAttribute('data-is-subtag', 'false')
      document.body.setAttribute('data-base', 'true')
    }
  }, [])

  const setPreventActiveIndexOnClick = (isSubtag: boolean) => {
    const activeElements = document.querySelectorAll('[aria-checked="true"]')
    if (activeElements.length === 1) {
      document.body.setAttribute('data-base', 'true')
      return
    }
    if (activeElements.length > 2) {
      document.body.setAttribute(
        'data-prev-index',
        String(activeElements[2].getAttribute('data-index'))
      )
      document.body.setAttribute('data-is-subtag', String(isSubtag))
    } else {
      document.body.setAttribute('data-prev-index', String(-2))
      document.body.setAttribute('data-is-subtag', String(isSubtag))
    }
    document.body.removeAttribute('data-base')
  }
  return setPreventActiveIndexOnClick
}
