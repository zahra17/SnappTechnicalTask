import React, {FC} from 'react'
import {rem} from 'polished'
import {FlexBox, FlexProps} from '@sf/design-system'
import styled from 'styled-components'

interface BasketActionProps extends FlexProps {
  children: React.ReactNode
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

const Container = styled(FlexBox)`
  width: 100%;
  min-height: ${rem(57)};
  transition: all 0.3s;

  &:hover {
    background-color: ${({theme}) => theme.surface.main};
    transition: all 0.3s;
  }
`

const BasketAction: FC<BasketActionProps> = ({children, ...props}) => {
  return (
    <Container onClick={e => e.stopPropagation()} {...props}>
      {children}
    </Container>
  )
}

export default BasketAction

BasketAction.defaultProps = {
  justify: 'space-between',
  alignContent: 'initial',
  alignItems: 'center',
  direction: 'row',
  wrap: 'nowrap',
}
