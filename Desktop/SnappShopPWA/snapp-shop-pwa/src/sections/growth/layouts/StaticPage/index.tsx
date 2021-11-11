import React from 'react'
import {DefaultLayout} from '@root/Layout'
import styled from 'styled-components'
import {FlexBox} from '@sf/design-system'
import {useBodyColor} from '@hooks/useBodyColor'

const StyledLayout = styled(DefaultLayout)`
  max-width: 100vw;
  padding: ${({theme}) => theme.spacing[4]} 0;
`

const Flex = styled(FlexBox).attrs({
  justify: 'center',
})``

export const StaticLayout: React.FC = ({children, ...props}) => {
  useBodyColor('dark')

  return (
    <StyledLayout {...props}>
      <Flex>{children}</Flex>
    </StyledLayout>
  )
}
