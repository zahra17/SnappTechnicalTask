import {FC, useRef} from 'react'
import {createPortal} from 'react-dom'

const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)

export const Portal: FC<{rootId?: string}> = ({
  children,
  rootId = 'portals-root',
}) => {
  const rootRef = useRef<HTMLElement | null>(null)

  if (!canUseDOM) return null

  if (!rootRef.current) {
    const node = document.getElementById(rootId)
    if (node) rootRef.current = node
    else {
      rootRef.current = document.createElement('div')
      rootRef.current.id = rootId
      document.body.appendChild(rootRef.current)
    }
  }

  return createPortal(children, rootRef.current)
}
