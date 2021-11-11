import React, {useContext} from 'react'
import styled from 'styled-components'
import {rem} from 'polished'
import {Text, FlexBox, Price} from '@sf/design-system'
import {Product, ProductModel} from '@schema/product'
import {Img} from '@components/Img'
import {multilineEllipsis} from '@utils'
import {useBasketProduct} from '@hooks/useBasket'
import AddRemove from '@components/AddRemove'
import {VendorStates} from '@schema/vendor'
import {useDispatch, useSelector} from 'react-redux'
import {
  selectLocation,
  showModal as showModalAction,
} from '~growth/redux/location'
import {ProductContext} from '@contexts/Product'

interface ProductCardProps {
  product: Product
  vendorStates: VendorStates
}

const Box = styled(FlexBox).attrs({as: 'section'})`
  box-sizing: border-box;
  width: ${rem(176)};
  height: ${rem(272)};
  padding: ${rem(12)};
  border: 1px solid ${({theme}) => theme.surface.dark};
  border-radius: ${rem(6)};
  box-shadow: ${({theme}) => theme.shadows.small};
`

const ImgWrapper = styled(FlexBox)`
  margin: 0 ${({theme}) => theme.spacing[5]} ${({theme}) => theme.spacing[3]};

  img {
    border-radius: ${rem(8)};
  }
`

const ProductTitle = styled(FlexBox)`
  height: ${rem(40)};
  margin-bottom: ${rem(8)};
`

const Footer = styled(FlexBox).attrs({as: 'footer'})`
  height: ${rem(84)};
`

export const ProductCardVertical: React.FC<ProductCardProps> = ({
  product,
  vendorStates,
}) => {
  const {count, toppings, handleProductAction} = useBasketProduct(product.id)
  const location = useSelector(selectLocation)
  const productModel = new ProductModel(product!)

  const {setContextState} = useContext(ProductContext)

  const dispatch = useDispatch()

  const addProduct = () => {
    if (location.activeLocation?.lat && location.activeLocation?.long) {
      if (product?.productToppings?.length) {
        setContextState!({activeProduct: product, isToppingModalOpen: true})
      } else {
        handleProductAction({...product, toppings: []}, 'add')
      }
    } else {
      dispatch(showModalAction(true))
    }
  }

  const removeProduct = () => {
    handleProductAction({...product, toppings}, 'remove')
  }

  const isDisabledAddButton = productModel.isDisableProduct(count, vendorStates)
  const isDisabledUntil = productModel.isDisabledUntil()
  const isStuckOver = productModel.isStuckOver(count)

  return (
    <Box direction='column'>
      <ImgWrapper justify='center' alignItems='center'>
        <Img
          src={product.images[0]?.imageSrc}
          alt={product.title}
          width='96'
          height='96'
        />
      </ImgWrapper>
      <ProductTitle>
        <Text as='h2' scale='body' colorName='carbon' align='center'>
          {multilineEllipsis(String(product.title), 30)}
        </Text>
      </ProductTitle>
      <Footer direction='column' alignItems='center' justify='space-around'>
        <Price
          unavailable={
            (isStuckOver || isDisabledUntil) && count !== product.stock
          }
          value={product.price - product.discount}
          oldPrice={product.discount && product.price}
          discount={product.discountRatio}
        />

        <AddRemove
          stock={(product.stock ?? 0) - (count ?? 0)}
          round
          count={count ?? 0}
          onClickAdd={addProduct}
          onClickRemove={removeProduct}
          disableAdd={isDisabledAddButton}
        />
      </Footer>
    </Box>
  )
}
