import React, {FC} from 'react'
import styled from 'styled-components'
import {rem} from 'polished'
import {useTranslation} from 'react-i18next'
import {CloseIcon, Text, FlexBox, Price} from '@sf/design-system'
import {Price as ProductPrice, Product} from '~order/types'

interface BillInfoProps {
  products: Product[]
  prices: ProductPrice
  description?: string
  isOpenedAsModal?: boolean
  vendorName?: string
}
const VendorName = styled(Text)`
  margin: 0 ${rem(18)} ${({theme}) => theme.spacing[2]} ${rem(18)};
`
const BillInfo: FC<BillInfoProps> = ({
  prices,
  products,
  description,
  isOpenedAsModal = false,
  vendorName = '',
}) => {
  const BasketInfo = styled(FlexBox)<{isOpenedAsModal: boolean}>`
    border: ${({isOpenedAsModal}) => (isOpenedAsModal ? 0 : `${rem(1)}`)} solid
      ${({theme}) => theme.carbon.alphaLight};
    border-radius: ${rem(8)};

    > {
      &:first-child {
        ${({isOpenedAsModal, theme}) =>
          isOpenedAsModal
            ? `margin: ${rem(4)} ${theme.spacing[2]}`
            : `margin: ${rem(18)} ${theme.spacing[2]}`}
      }
    }
  `
  const Description = styled(Text)`
    margin: ${rem(4)} ${({theme}) => theme.spacing[2]};
    padding: ${rem(12)};
    background-color: ${({theme}) => theme.surface.main};
    border-radius: ${({theme}) => theme.spacing[1]};
  `
  const Item = styled(FlexBox).attrs({
    justify: 'space-between',
    alignItems: 'center',
  })`
    box-sizing: border-box;
    height: ${({theme}) => theme.spacing[6]};
    padding: 0 ${({theme}) => theme.spacing[2]};
    border-bottom: ${rem(1)} solid ${({theme}) => theme.carbon.alphaLight};

    > {
      &:last-child {
        * {
          margin-right: ${rem(2)};
        }
      }
    }
  `
  const BillItem = styled(FlexBox).attrs({
    justify: 'space-between',
    alignItems: 'center',
  })`
    height: ${({theme}) => theme.spacing[4]};
    padding: 0 ${({theme}) => theme.spacing[2]};
  `
  const Total = styled(FlexBox).attrs({
    justify: 'space-between',
    alignItems: 'center',
  })`
    height: ${({theme}) => theme.spacing[4]};
    padding: ${({theme}) => theme.spacing[1]} ${({theme}) => theme.spacing[2]};
    border-top: ${rem(1)} solid ${({theme}) => theme.carbon.alphaLight};
  `

  const {t} = useTranslation()

  return (
    <BasketInfo direction='column' isOpenedAsModal={isOpenedAsModal}>
      <Text
        as='span'
        scale={isOpenedAsModal ? 'xlarge' : 'body'}
        weight='bold'
        colorWeight={isOpenedAsModal ? 'main' : 'light'}
      >
        {t('order:followOrder.billTitle')}
      </Text>
      {isOpenedAsModal && vendorName && (
        <VendorName scale='body' colorName='carbon' colorWeight='light'>
          {vendorName}
        </VendorName>
      )}

      {/* DESCRIPTION */}
      {description && <Description scale='caption'>{description}</Description>}

      {/* ITEMS */}
      {products.map((product: any) => (
        <Item key={product.title}>
          <Text as='span' scale='body'>
            {product.productTitle ? product.productTitle + ' ' : product.title}
            {!!product.productTitle &&
              !!product.productVariationTitle &&
              product.productVariationTitle}
          </Text>
          <FlexBox direction='row-reverse' alignItems='center'>
            <Price value={product.price} />
            <CloseIcon width={6} height={6} />
            <Text as='span' scale='body' colorWeight='light'>
              {product.quantity ?? product.count}
            </Text>
          </FlexBox>
        </Item>
      ))}

      {/* TOTAL ITEM PRICES */}
      <BillItem>
        <Text as='span' scale='body'>
          {t('order:followOrder.totalPrice')}
        </Text>
        <Price
          scale='body'
          weight='normal'
          value={products.reduce(function (prev: any, cur: any) {
            return prev + cur.price * (cur.quantity ? cur.quantity : cur.count)
          }, 0)}
        />
      </BillItem>

      {/* DELIVERY FEE */}
      <BillItem>
        <Text as='span' scale='body'>
          {t('order:followOrder.deliveryFee')}
        </Text>
        <Price
          scale='body'
          weight='normal'
          value={
            prices.couponDeliveryDiscountAmount
              ? prices.grossDeliveryFee!
              : prices.deliveryFee
          }
        />
      </BillItem>

      {/* TAX */}
      {prices.vatAmount ? (
        <BillItem>
          <Text as='span' scale='body'>
            {t('order:followOrder.tax')}
          </Text>
          <Price
            scale='body'
            weight='normal'
            value={prices.vatAmount + prices.vatAmountDiscount}
            isZeroVisible
          />
        </BillItem>
      ) : (
        ''
      )}

      {/* CONTAINER */}
      {prices.containerPrice ? (
        <BillItem>
          <Text as='span' scale='body'>
            {t('order:followOrder.container')}
          </Text>
          <Price
            scale='body'
            weight='normal'
            value={prices.containerPrice}
            isZeroVisible
          />
        </BillItem>
      ) : (
        ''
      )}

      {/* DISCOUNT */}
      {prices.sumAllDiscount ? (
        <BillItem>
          <Text as='span' scale='body' colorName='accent'>
            {t('order:followOrder.discounts')}
          </Text>
          <Price
            scale='body'
            colorName='accent'
            weight='normal'
            value={prices.sumAllDiscount}
          />
        </BillItem>
      ) : (
        ''
      )}

      {/* TOTAL */}
      <Total>
        <Text as='span' scale='body' weight='bold'>
          {t('order:followOrder.total')}
        </Text>
        <Price scale='body' value={prices.totalPrice} />
      </Total>
    </BasketInfo>
  )
}

export default BillInfo
