import React, {useEffect} from 'react'
import styled from 'styled-components'
import {useIntersection} from '@hooks/useIntersection'
import {useRudderStack} from '@contexts/RudderStack'

interface Props {
  preservedHeight: string
  onVisible?: (...args: unknown[]) => void
  visible: boolean
  rudderStackTrigger?: Function
}

const StyledSection = styled.section<{height: string}>`
  height: ${({height}) => height};
`
export const LazySection: React.FC<Props> = ({
  preservedHeight,
  onVisible = () => {},
  rudderStackTrigger = () => {},
  visible = false,
  children,
  ...props
}) => {
  const nodeRef = useIntersection(
    {
      threshold: 0,
    },
    entries => {
      const [entry] = entries
      if (entry.isIntersecting && !visible) {
        onVisible()
      }
    }
  )
  const rudderStack = useRudderStack()
  useEffect(() => {
    if (visible) rudderStackTrigger()
  }, [rudderStack])
  return (
    <StyledSection
      height={visible ? 'auto' : preservedHeight}
      ref={nodeRef}
      {...props}
    >
      {children}
    </StyledSection>
  )
}
