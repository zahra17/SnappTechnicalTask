import React from 'react'
import Link from 'next/link'
import {useTranslation} from 'react-i18next'
import styled from 'styled-components'
import {
  Text,
  FlexBox,
  Price,
  Button,
  PinOutlineIcon,
  CalendarIcon,
  TimeIcon,
  ExclamationIcon,
  RetryIcon,
} from '@sf/design-system'
import {rem} from 'polished'

import {previousOrder, Price as OrderPrice, Reorders} from '~order/types'

import {Img} from '@components/Img'
import {truncate} from '@utils'

type PrevOrderProps = {
  order: previousOrder
  submitReorder: (reorder: Reorders | previousOrder) => void
  onClickBill: Function
  // TODO: fix order types
  // onClickBill: (
  //   products: Product[],
  //   prices: OrderPrice,
  //   vendorTitle: string
  // ) => void
}

const Container = styled(FlexBox)`
  padding: ${rem(20)} ${rem(16)} ${rem(16)};
  border-bottom: 1px solid ${({theme}) => theme.carbon.alphaLight};
`

const VendorInfo = styled(FlexBox)`
  > img {
    width: ${rem(48)};
    height: ${rem(48)};
    margin-left: ${rem(16)};
    border-radius: ${rem(4)};
    box-shadow: ${({theme}) => theme.shadows.small};
    cursor: pointer;
  }
`

const InfoRow = styled(FlexBox)`
  > p {
    margin-bottom: 10px;
    cursor: pointer;
  }
`

const ItemsRow = styled(FlexBox)``

const InfoItem = styled(FlexBox).attrs({
  alignItems: 'center',
})`
  margin-left: 18px;

  > svg {
    margin-left: 6px;
  }
`

const ProductList = styled(FlexBox)`
  margin-top: 16px;
  margin-right: 64px;
`
const ProductLogo = styled(Img)`
  width: 40px;
  height: 40px;
  margin-left: 8px;
  border: ${rem(1)} solid ${({theme}) => theme.carbon.alphaLight};
  border-radius: 4px;

  + p {
    position: absolute;
    right: -5px;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background-color: ${({theme}) => theme.surface.light};
    border: ${rem(1)} solid ${({theme}) => theme.carbon.alphaLight};
    border-radius: 50%;
    box-shadow: ${({theme}) => theme.shadows.small};
  }
`

const ActionWrapper = styled(FlexBox).attrs({
  direction: 'column',
  alignItems: 'flex-end',
})``

const ButtonWrapper = styled(FlexBox)`
  margin-top: 20px;

  > button {
    width: 126px;
    margin-right: 8px;
  }
`

const PrevOrder: React.FC<PrevOrderProps> = ({
  order,
  submitReorder,
  onClickBill,
}) => {
  const {
    vendorTitle,
    vendorLogo,
    totalPrice,
    products,
    orderAddress,
    time,
    date,
    containerPrice,
    deliveryFee,
    vatAmount,
    sumAllDiscount,
    vatAmountDiscount,
    superTypeAlias,
    vendorCode,
  } = order

  const {t} = useTranslation()

  const Prices: OrderPrice = {
    containerPrice,
    deliveryFee,
    vatAmount,
    sumAllDiscount,
    totalPrice,
    vatAmountDiscount,
  }

  return (
    <Container alignItems='center' justify='space-between'>
      <div>
        <VendorInfo>
          <Link href={`/${superTypeAlias.toLowerCase()}/menu/${vendorCode}`}>
            <Img src={vendorLogo} />
          </Link>
          <InfoRow direction='column'>
            <Link href={`/${superTypeAlias.toLowerCase()}/menu/${vendorCode}`}>
              <Text scale='body' weight='bold'>
                {vendorTitle}
              </Text>
            </Link>

            <ItemsRow>
              <InfoItem>
                <PinOutlineIcon />
                <Text scale='caption'>
                  {truncate(orderAddress.label ?? orderAddress.address, 25)}
                </Text>
              </InfoItem>
              <InfoItem>
                <CalendarIcon />
                <Text scale='caption'>{date}</Text>
              </InfoItem>
              <InfoItem>
                <TimeIcon fill='var(--sf-inactive-main)' width={14} />
                <Text scale='caption'>{time}</Text>
              </InfoItem>
            </ItemsRow>
          </InfoRow>
        </VendorInfo>
        <ProductList direction='row' justify='flex-start' alignItems='center'>
          {React.Children.toArray(
            products?.slice(0, 3).map(product => (
              <div style={{position: 'relative'}} key={product.id}>
                <ProductLogo
                  src={product.images && product.images[0]?.imageThumbnailSrc}
                />
                {Number(product.count) > 1 ? (
                  <Text scale='tiny' weight='bold'>
                    {product.count}
                  </Text>
                ) : null}
              </div>
            ))
          )}
          {products?.length > 3 ? (
            <Text scale='body' colorName='carbon' colorWeight='light'>
              {t('order:orders.other-products', {number: products.length - 3})}
            </Text>
          ) : null}
        </ProductList>
      </div>
      <ActionWrapper>
        <Price value={totalPrice} />
        <ButtonWrapper>
          <Button
            appearance='ghost'
            colorName='carbon'
            onClick={() => onClickBill(order.products, Prices, vendorTitle)}
          >
            <ExclamationIcon
              fill={`var(--sf-carbon-main)`}
              style={{transform: `rotate(180deg)`}}
            />
            <Text scale='body' weight='bold'>
              {t('order:orders.checkFactor')}
            </Text>
          </Button>
          <Button appearance='ghost' onClick={() => submitReorder(order)}>
            <RetryIcon fill='var(--sf-accent-main)' />
            <Text scale='body' weight='bold' colorName='accent'>
              {t('order:orders.re-order')}
            </Text>
          </Button>
        </ButtonWrapper>
      </ActionWrapper>
    </Container>
  )
}

export default React.memo(PrevOrder)
