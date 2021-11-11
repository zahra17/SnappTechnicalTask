import React, {useRef} from 'react'

interface Props {
  isOpen: boolean
  height: string
}
export const Collapse: React.FC<Props> = ({
  isOpen = false,
  height = 'auto',
  children,
  ...props
}) => {
  const nodeRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={nodeRef}
      style={{
        height: isOpen ? height : '0',
        transition: 'height 250ms',
        overflow: 'hidden',
      }}
      {...props}
    >
      {children}
    </div>
  )
}
