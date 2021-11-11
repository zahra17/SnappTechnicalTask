import React, {FC, useState} from 'react'
import {FlexBox, Price, Text} from '@sf/design-system'

import AddRemove from '@components/AddRemove'
import BasketAction from '@components/BasketAction'
import {VendorStates} from '@schema/vendor'
import {Product, ProductModel, ToppingBase} from '@schema/product'
import {useBasketProduct} from '@hooks/useBasket'
import {getZooketProductDetails} from '~menu/redux/zooket'
import {useAppDispatch} from '@redux'
import {ProductChildren, ZooketProductDetailsData} from '~menu/types'
import {OrderModal} from '../OrderModal'

interface Props {
  product: Product
  vendorCode?: string
  vendorStates: VendorStates
  addProduct: (product: Product) => void
  removeProduct: (product: Product, toppings: ToppingBase[]) => void
}

export const ProductVariation: FC<Props> = ({
  product,
  vendorStates,
  vendorCode,
  addProduct,
  removeProduct,
}) => {
  const [hovered, setHovered] = useState(false)
  const {count, toppings} = useBasketProduct(product.id)
  const [orderModalOpened, setOrderModalOpened] = useState(false)
  const [productChildren, setProductChildren] = useState<
    ProductChildren[] | null
  >(null)
  const [productChildrenCategory, setProductChildrenCategory] = useState<
    string | null
  >(null)

  const [isPending, setIsPending] = useState(false)
  const dispatch = useAppDispatch()

  const productModel = new ProductModel(product)

  const isDisabledAddButton = productModel.isDisableProduct(count, vendorStates)
  const isDisabledUntil = productModel.isDisabledUntil()
  const isStuckOver = productModel.isStuckOver(count)

  const onAddClick = async (product: Product) => {
    if (vendorCode) {
      setIsPending(true)
      const {payload} = (await dispatch(
        getZooketProductDetails({
          productVariationId: String(product.id),
          vendorCode,
        })
      )) as {payload: ZooketProductDetailsData}

      if (payload) {
        setIsPending(false)
      }

      if (payload.children?.childProducts?.length || 0 > 0) {
        setOrderModalOpened(true)
        setProductChildren(payload.children.childProducts)
        setProductChildrenCategory(payload.children.propertyCategory.title)
      } else {
        addProduct(product)
      }
    } else {
      addProduct(product)
    }
  }

  const onOrderModalClose = () => {
    setOrderModalOpened(false)
  }

  return (
    <>
      <OrderModal
        isOpenModal={orderModalOpened}
        handleCloseModal={onOrderModalClose}
        productChildren={productChildren}
        propertyCategory={productChildrenCategory}
        product={product}
        addProduct={addProduct}
      />
      <BasketAction
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <FlexBox direction='column'>
          {product.productId && (
            <Text scale='caption' weight='normal'>
              {product.productVariationTitle}
            </Text>
          )}
          <Price
            unavailable={
              (isStuckOver || isDisabledUntil) && count !== product.stock
            }
            value={product.price - product.discount}
            oldPrice={product.discount && product.price}
            discount={product.discountRatio}
          />
        </FlexBox>
        <AddRemove
          stock={(product.stock ?? 0) - (count ?? 0)}
          round
          isPending={isPending}
          count={count ?? 0}
          onClickAdd={() => onAddClick(product)}
          onClickRemove={() => removeProduct(product, toppings)}
          disableAdd={isDisabledAddButton}
          hovered={hovered}
        />
      </BasketAction>
    </>
  )
}
