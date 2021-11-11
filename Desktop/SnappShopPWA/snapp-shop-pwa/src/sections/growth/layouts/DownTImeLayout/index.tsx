import React from 'react'
import {DefaultLayout} from '@root/Layout'
import styled from 'styled-components'
import {FlexBox} from '@sf/design-system'

const StyledLayout = styled(FlexBox).attrs({
  justify: 'center',
})`
  max-width: 100vw;
  padding: 0 !important;
  background-color: ${({theme}) => theme.surface.dark};
`

const Flex = styled(FlexBox).attrs({
  justify: 'center',
})`
  padding: 0 !important;
`

export const DownTimeLayout: React.FC = ({children, ...props}) => {
  return (
    <StyledLayout {...props}>
      <Flex>{children}</Flex>
    </StyledLayout>
  )
}
