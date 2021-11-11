import React from 'react'
import styled from 'styled-components'
import {rem} from 'polished'
import {Text} from '@sf/design-system'
import {FlexBox, ColorNames} from '@sf/design-system'
import {VendorModel} from '@schema/vendor'

interface Props {
  vendorModel: VendorModel
}
const VendorBox = styled(FlexBox)<{
  backGroundColor: ColorNames
}>`
  width: 100%;
  height: ${rem(24)};
  margin-bottom: ${rem(16)};
  background-color: ${({backGroundColor, theme}) =>
    theme[backGroundColor].alphaLight};
  border-radius: ${rem(4)};
`
export const VendorStateBadge: React.FC<Props> = ({vendorModel}) => {
  const {
    badgeColor,
    badgeWeight,
    badgeBackground,
  } = vendorModel.getVendorBadgeStyle()
  const badgeMessage = vendorModel.getVendorBadgeMessage()
  return (
    <VendorBox
      justify='center'
      alignItems='center'
      backGroundColor={badgeBackground}
    >
      <Text scale='caption' colorName={badgeColor} colorWeight={badgeWeight}>
        {badgeMessage}
      </Text>
    </VendorBox>
  )
}
