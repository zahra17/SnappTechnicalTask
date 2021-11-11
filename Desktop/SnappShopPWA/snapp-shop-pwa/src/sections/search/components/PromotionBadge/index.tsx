import React from 'react'
import styled from 'styled-components'
import {rem} from 'polished'
import {Text} from '@sf/design-system'

interface PromotionBadgeProps {
  discountValue: number
  couponCount: number
}
const StyledPromotionBadge = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  padding: ${rem(4)} ${rem(12)};
  background-color: ${({theme}) => theme.surface.light};
  border-top-left-radius: ${rem(16)};

  > *:last-child {
    margin-right: ${rem(11)};

    > *:last-child {
      margin-right: ${rem(2)};
    }
  }
`

export const PromotionBadge: React.FC<PromotionBadgeProps> = ({
  discountValue,
  couponCount,
}) => {
  return discountValue || couponCount ? (
    <StyledPromotionBadge>
      {Boolean(discountValue) && (
        <Text
          scale='body'
          weight='bold'
          as='span'
          colorName='accent'
          colorWeight='dark'
        >
          %{discountValue}
        </Text>
      )}
      {Boolean(couponCount) && (
        <Text
          scale='body'
          weight='bold'
          as='span'
          colorName='accent2'
          colorWeight='dark'
        >
          {couponCount}
          <Text
            scale='caption'
            as='span'
            colorName='accent2'
            colorWeight='dark'
          >
            کوپن
          </Text>
        </Text>
      )}
    </StyledPromotionBadge>
  ) : null
}
