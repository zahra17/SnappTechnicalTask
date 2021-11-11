import React, {useEffect} from 'react'
import styled from 'styled-components'
import {rem} from 'polished'
import {FlexBox, Text} from '@sf/design-system'
import {Coupon} from '@schema/coupon'

interface Props {
  coupon: Coupon
  selected: boolean
  setCoupon: (coupon: Coupon) => void
}

interface WrapperProps {
  isEarned: boolean
  isActive: boolean
}

const Wrapper = styled(FlexBox).attrs({as: 'section'})<WrapperProps>`
  box-sizing: border-box;
  height: ${rem(52)};
  padding: ${rem(8)} ${rem(12)};
  background-color: ${({theme, isEarned}) =>
    isEarned ? theme.surface.light : theme.surface.main};

  border: ${rem(1)} solid
    ${({theme, isEarned, isActive}) =>
      isActive
        ? theme.accent2.main
        : isEarned
        ? theme.carbon.alphaLight
        : theme.surface.dark};

  border-radius: ${rem(6)};
  cursor: ${({isEarned}) => (isEarned ? 'pointer' : 'default')};
`

export const CouponItem: React.FC<Props> = ({coupon, selected, setCoupon}) => {
  const handleClickCoupon = () => {
    if (coupon.is_earned) setCoupon(coupon)
  }

  return (
    <Wrapper
      direction='column'
      isEarned={coupon.is_earned}
      isActive={selected}
      onClick={handleClickCoupon}
    >
      <Text
        colorName={coupon.is_earned ? 'carbon' : 'inactive'}
        colorWeight={coupon.is_earned ? 'main' : 'dark'}
        scale='body'
      >
        {coupon.title}
      </Text>
      <Text
        colorName={coupon.is_earned ? 'carbon' : 'inactive'}
        colorWeight={coupon.is_earned ? 'light' : 'dark'}
        scale='caption'
      >
        {coupon.descriptions}
      </Text>
    </Wrapper>
  )
}
