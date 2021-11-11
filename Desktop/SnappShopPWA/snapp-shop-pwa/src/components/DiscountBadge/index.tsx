import React from 'react'
import {rem} from 'polished'
import styled from 'styled-components'
import {Text} from '@sf/design-system'

interface Props {
  discount?: number
}
const DiscountBox = styled(Text)`
  padding: ${rem(4)} ${rem(12)};
  background-color: ${({theme}) => theme.surface.light};
  border: 1px solid ${({theme}) => theme.carbon.alphaLight};
  border-radius: ${rem(40)};
  box-shadow: ${({theme}) => theme.shadows.medium};

  > *:last-child {
    margin-right: ${rem(1)};
  }
`

export const DiscountBadge: React.FC<Props> = ({discount, ...props}) => {
  if (discount) {
    return (
      <DiscountBox
        scale='body'
        colorName='accent'
        colorWeight='dark'
        as='span'
        {...props}
      >
        {discount}
        <Text scale='caption' colorName='accent' as='span'>
          %
        </Text>
      </DiscountBox>
    )
  }
  return null
}
