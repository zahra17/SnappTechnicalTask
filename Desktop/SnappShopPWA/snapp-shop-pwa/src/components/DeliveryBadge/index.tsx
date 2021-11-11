import styled from 'styled-components'
import {rem} from 'polished'
import React from 'react'
import {
  Text,
  Price,
  ExclamationIcon,
  ExpressIcon,
  BikerIcon,
  PreorderIcon,
  PackIcon,
} from '@sf/design-system'
import {VendorModel} from '@schema/vendor'
import {useTranslation} from 'react-i18next/'

interface DeliveryBadgeProps {
  vendorModel: VendorModel
  style?: {}
}

const DeliveryBox = styled.div<{isInRange?: boolean; isPreorder?: boolean}>`
  padding: ${rem(11)} ${rem(14)};
  background-color: ${({theme, isInRange, isPreorder}) =>
    !isInRange
      ? 'transparent'
      : isPreorder
      ? theme.surface.dark
      : theme.surface.light};
  border-radius: ${rem(72)};
  box-shadow: ${({theme, isPreorder, isInRange}) =>
    !isPreorder && isInRange && theme.shadows.small};

  > *:first-child {
    > * {
      margin-left: ${({theme}) => theme.spacing[1]};
    }

    > svg {
      vertical-align: middle;
    }
  }
`
export const DeliveryBadge: React.FC<DeliveryBadgeProps> = ({
  vendorModel,
  children,
  ...props
}) => {
  const {t} = useTranslation()
  const isInRange = vendorModel.isInRange()
  const isPreorder = vendorModel.isPreorderEnabled()

  return (
    <DeliveryBox {...props} isPreorder={isPreorder} isInRange={isInRange}>
      <div>
        {!isInRange ? (
          <ExclamationIcon fill='var(--sf-alert-main)' />
        ) : isPreorder ? (
          <PreorderIcon />
        ) : vendorModel.vendor.is_pickup ? (
          <PackIcon />
        ) : vendorModel.isExpress() ? (
          <ExpressIcon />
        ) : (
          <BikerIcon />
        )}
        <Text
          scale='caption'
          colorName={!isInRange ? 'alert' : 'carbon'}
          colorWeight={!isInRange ? 'dark' : 'light'}
        >
          {!isInRange
            ? t('deliveryBadge.rangeText')
            : isPreorder
            ? t('deliveryBadge.preorderText')
            : vendorModel.vendor.is_pickup
            ? t('deliveryBadge.pickupText')
            : vendorModel.isExpress()
            ? t('deliveryBadge.expressText')
            : t('deliveryBadge.bikerText')}
        </Text>
        {isInRange && !isPreorder && (
          <Price
            value={
              vendorModel.vendor.is_pickup
                ? 0
                : vendorModel.getVendorDeliveryFee()
            }
          />
        )}
      </div>
      {children}
    </DeliveryBox>
  )
}
