import styled from 'styled-components'
import {rem} from 'polished'
import React from 'react'
import {StarIcon, Text} from '@sf/design-system'

interface VendorRateBadgeProps {
  rate: number
  hasBorder?: boolean
  background?: string
}

const RateBox = styled.span<Partial<VendorRateBadgeProps>>`
  padding: ${({hasBorder}) => (hasBorder ? `${rem(2)} ${rem(6)}` : '')};
  background-color: ${({background}) => (background ? background : '')};
  border: ${({hasBorder, theme}) =>
    hasBorder ? `${rem(1)} solid ${theme.surface.dark}` : ''};
  border-radius: ${({hasBorder}) => (hasBorder ? rem(4) : '')};

  > svg {
    margin-left: ${rem(4)};
    vertical-align: middle;
  }
`

export const VendorRateBadge: React.FC<VendorRateBadgeProps> = ({
  rate,
  hasBorder,
}) => {
  let background = 'var(--light-verdun-color)'
  let starColor = 'var(--starcolor-default)'
  if (rate >= 5.0) background = 'var(--light-verdun-color)'
  else if (rate >= 4.5) {
    background = 'var(--dark-bilbao-color)'
    starColor = 'var(--starcolor-default)'
  } else if (rate >= 4.0) {
    background = 'var(--light-limeade-color)'
    starColor = 'var(--starcolor-40)'
  } else if (rate >= 3.5) {
    background = 'var(--light-yellow-green-color)'
    starColor = 'var(--starcolor-35)'
  } else if (rate >= 3.0) {
    background = 'var(--light-Barbery-color)'
    starColor = 'var(--starcolor-30)'
  } else if (rate >= 2.5) {
    background = 'var(--light-selective-yellow-color)'
    starColor = 'var(--starcolor-25)'
  } else if (rate >= 2.0) {
    background = 'var(--light-safety-orange-color)'
    starColor = 'var(--starcolor-20)'
  } else if (rate >= 1.5) {
    background = 'var(--light-scarlet-color)'
    starColor = 'var(--starcolor-15)'
  } else if (rate >= 1.0) {
    background = 'var(--light-venetian-color)'
    starColor = 'var(--starcolor-10)'
  } else {
    background = 'var(--light-verdun-color)'
    starColor = 'var(--starcolor-default)'
  }

  return (
    <RateBox hasBorder={hasBorder} background={background}>
      <StarIcon fill={starColor} />
      <Text scale='caption' weight='bold' as='span'>
        {rate && rate > 0 ? rate.toFixed(1) : 'جدید'}
      </Text>
    </RateBox>
  )
}
