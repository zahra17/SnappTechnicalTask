import styled from 'styled-components'
import {rem} from 'polished'
import React from 'react'
import Link from 'next/link'
import {useTranslation} from 'react-i18next'

import {Card, Text, FlexBox, Price, Button} from '@sf/design-system'
import {RateCommentBadge} from '@components/RateCommentBadge'
import {Img} from '@components/Img'
import {Product, ProductModel} from '@schema/product'
import {multilineEllipsis} from '@utils'
import {VendorModel} from '@schema/vendor'

interface ProductCardProps {
  product: Product
  isLoading?: boolean
}

const ProductBox = styled(Card)`
  padding: ${rem(24)} ${rem(24)} ${rem(20)};
  border: 1px solid ${({theme}) => theme.carbon.alphaLight};

  > div {
    margin-bottom: ${rem(16)};
  }
`
const InfoWrapper = styled(FlexBox)`
  > div {
    margin-bottom: ${rem(8)};
  }

  > h2 {
    max-height: ${rem(48)};
  }
`

const ImgWrapper = styled(FlexBox)`
  min-width: ${rem(96)};
  height: ${rem(96)};

  > img {
    width: 100%;
    height: 100%;
  }
`

const VendorInfoWrapper = styled(FlexBox)`
  > img {
    width: ${rem(32)};
    height: ${rem(32)};
    margin-left: ${({theme}) => theme.spacing[1]};
    border-radius: ${rem(4)};
  }
`

const VendorPriceWrapper = styled(FlexBox)`
  > div {
    > p {
      margin-bottom: ${rem(4)};
    }
  }
`

export const ProductCard: React.FC<ProductCardProps> = ({product}) => {
  const {t} = useTranslation()
  const productModel = new ProductModel(product)
  const vendorModel = new VendorModel(product.vendor)

  return (
    <Link href={vendorModel.getLink(productModel.product)} passHref>
      <ProductBox shadow='small' spacing={0} direction='column'>
        <FlexBox direction='row' justify='space-between'>
          <InfoWrapper direction='column'>
            <RateCommentBadge
              rating={productModel.product?.rating / 2}
              commentsCount={productModel.product?.comment_count}
              label={t('score')}
            />

            <Text as='h2' scale='default' weight='bold' align='right'>
              {multilineEllipsis(productModel.product.title, 30)}
            </Text>
          </InfoWrapper>
          <ImgWrapper justify='center' alignItems='flex-end'>
            <Img
              src={
                productModel.product?.images
                  ? productModel.product?.images[0]?.thumb
                  : ''
              }
              alt={productModel.product?.productTitle || undefined}
            />
          </ImgWrapper>
        </FlexBox>
        <VendorInfoWrapper
          direction='row'
          justify='flex-start'
          alignItems='center'
        >
          <Img
            src={productModel.product?.vendor?.featured}
            alt={productModel.product?.vendor?.title}
          />
          <Text scale='caption' weight='normal'>
            {productModel.product?.vendor?.title}
          </Text>
        </VendorInfoWrapper>
        <VendorPriceWrapper justify='space-between'>
          <Price
            value={productModel.product?.price}
            discount={productModel.product?.discountRatio}
            oldPrice={
              productModel.product?.price + productModel.product?.discount
            }
          />
          <Button appearance='outline' float>
            {t('core:show')}
          </Button>
        </VendorPriceWrapper>
      </ProductBox>
    </Link>
  )
}
