import React from 'react'
import styled from 'styled-components'
import {rem} from 'polished'
import {Text, FlexBox} from '@sf/design-system'
import {Product, ToppingBase} from '@schema/product'
import {Img} from '@components/Img'
import {getProductVarationData, multilineEllipsis} from '@utils'

import {VendorStates} from '@schema/vendor'
import {ProductVariation} from '~menu/components/ProductVariation'

type Cursor = 'auto' | 'default' | 'pointer' | 'unset'
interface ProductCardProps {
  products: Product[]
  vendorStates: VendorStates
  cursor?: Cursor
  vendorCode: string
  addProduct: (product: Product) => void
  removeProduct: (product: Product, toppings: ToppingBase[]) => void
  handleSelectProduct?: () => void
}

const Box = styled(FlexBox).attrs({as: 'section'})`
  box-sizing: border-box;
  height: 100%;
  padding: ${({theme}) => theme.spacing[2]} 0;
`
const Footer = styled(FlexBox).attrs({as: 'footer'})`
  margin-top: ${rem(8)};

  /* padding is set for basket action */
  > {
    &:first-child {
      padding: 0 ${rem(12)};
    }
  }
`
const Body = styled(FlexBox)<{cursor: Cursor}>`
  flex-grow: 1;
  padding: 0 ${({theme}) => theme.spacing[2]};
  cursor: ${({cursor}) => cursor};

  > *:first-child {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding-top: ${({theme}) => theme.spacing[2]};
    padding-left: ${({theme}) => theme.spacing[2]};

    > *:last-child {
      margin-top: ${({theme}) => theme.spacing[1]};
      word-break: break-word;
    }
  }
`
const ImgWrapper = styled.div`
  position: relative;
  flex-shrink: 0;

  img {
    border-radius: ${rem(8)};
  }
`

export const ProductCard: React.FC<ProductCardProps> = ({
  products,
  vendorStates,
  cursor = 'default',
  addProduct,
  removeProduct,
  handleSelectProduct = () => {},
  vendorCode,
}) => {
  const mainProduct = getProductVarationData(products[0])

  return (
    <Box direction='column'>
      <Body cursor={cursor} onClick={() => handleSelectProduct()}>
        <div>
          <Text as='h2' scale='default' weight='bold'>
            {mainProduct.title}
          </Text>
          <Text
            as='strong'
            scale='caption'
            colorName='inactive'
            colorWeight='dark'
          >
            {mainProduct.description &&
              multilineEllipsis(String(mainProduct.description))}
          </Text>
        </div>
        <ImgWrapper>
          <Img
            loading='lazy'
            src={mainProduct.images[0]?.imageSrc}
            alt={mainProduct.title}
            width='112'
            height='112'
          />
        </ImgWrapper>
      </Body>
      {products.map(product => (
        <Footer
          key={product.id.toString()}
          justify='space-between'
          alignItems='center'
        >
          <ProductVariation
            product={product}
            vendorCode={vendorCode}
            vendorStates={vendorStates}
            addProduct={product => addProduct(product)}
            removeProduct={(product, toppings) =>
              removeProduct(product, toppings)
            }
          />
        </Footer>
      ))}
    </Box>
  )
}
