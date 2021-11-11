import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {useAppDispatch} from '@redux'
import {rem} from 'polished'
import {getProductComments} from '~menu/redux/vendor'
import {Product, ToppingBase} from '@schema/product'
import {CommentsType, isCommentsType} from '~menu/types'
import {VendorStates} from '@schema/vendor'
import {ModalHeader} from '@components/ModalTools'
import {ImageSlider} from '@components/ImageSlider'
import {VendorDetailComments} from '~menu/components/VendorDetail/Comments'
import {Modal, FlexBox, Text, RateBadge, Spinner} from '@sf/design-system'

import {NumberParam, useQueryParams} from 'use-query-params'
import {ProductVariation} from '~menu/components/ProductVariation'
import {getProductVarationData} from '@utils'

interface Props {
  isOpen: boolean
  vendorStates: VendorStates
  vendorTypeTitle?: string
  products: Product[]
  handleClose: () => void
  addProduct: (product: Product) => void
  removeProduct: (product: Product, toppings: ToppingBase[]) => void
}

const ShiftCard = styled(FlexBox)`
  width: ${rem(720)};
  max-height: calc(90vh - 4rem);
  overflow-y: scroll;
`
const ProductDetailsHeader = styled(FlexBox)`
  padding: ${({theme}) => theme.spacing[2]};
  padding-top: 0;
`

const Details = styled(FlexBox)`
  width: ${rem(384)};
`

const ProductTitle = styled(FlexBox)`
  margin-bottom: ${({theme}) => theme.spacing[2]};
`

const ProductDescription = styled(FlexBox)`
  margin-bottom: ${({theme}) => theme.spacing[5]};
`

const Loading = styled.div`
  padding: ${({theme}) => theme.spacing[4]};
`

const ParamConfig = {
  productId: NumberParam,
}

export const ProductDetails: React.FC<Props> = ({
  isOpen,
  products,
  vendorStates,
  vendorTypeTitle = '',
  handleClose = () => {},
  addProduct,
  removeProduct,
}) => {
  if (!products.length) return null
  const mainProduct = getProductVarationData(products[0])

  const [productComments, setProductComments] = useState<{
    comments: CommentsType | null
    isLoading: boolean
  }>({comments: null, isLoading: true})

  const appDispatch = useAppDispatch()
  const [queryParam, setQuery] = useQueryParams(ParamConfig)

  useEffect(() => {
    getProductComment(mainProduct.id)
  }, [mainProduct.id])

  async function getProductComment(productId: number) {
    setProductComments(() => {
      return {comments: null, isLoading: true}
    })

    const {payload} = await appDispatch(
      getProductComments({variationIds: String(productId)})
    )

    if (isCommentsType(payload)) {
      setProductComments(() => {
        return {isLoading: false, comments: {...payload}}
      })
    }
  }

  const handleCloseModal = () => {
    console.log(1)
    handleClose()
    if (queryParam.productId) {
      setQuery({productId: null}, 'replaceIn')
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      animation='slideUp'
      backdropColor='var(--modal-backdrop)'
    >
      <ModalHeader onClose={handleCloseModal} />
      <ShiftCard direction='column'>
        <ProductDetailsHeader justify='space-between'>
          <ImageSlider
            width={280}
            height={280}
            images={mainProduct.images}
            alt={mainProduct.title}
          />

          <Details direction='column' justify='flex-start'>
            <ProductTitle alignItems='center' justify='space-between'>
              <Text scale='large' weight='bold' width={rem(320)}>
                {mainProduct.title}
              </Text>
              <RateBadge rate={mainProduct.rating / 2} hasBorder />
            </ProductTitle>
            <ProductDescription>
              <Text scale='body' weight='normal'>
                {mainProduct.description}
              </Text>
            </ProductDescription>

            {products.map(product => (
              <ProductVariation
                key={product.id}
                product={product}
                vendorStates={vendorStates}
                addProduct={product => addProduct(product)}
                removeProduct={(product, toppings) =>
                  removeProduct(product, toppings)
                }
              />
            ))}
          </Details>
        </ProductDetailsHeader>

        {productComments.isLoading ? (
          <Loading>
            <Spinner />
          </Loading>
        ) : (
          !!productComments.comments?.comments.length && (
            <VendorDetailComments
              vendorComments={productComments.comments}
              vendorType={vendorTypeTitle}
              onSort={() => {}}
            />
          )
        )}
      </ShiftCard>
    </Modal>
  )
}
