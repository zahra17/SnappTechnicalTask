import React, {useState, useEffect, useCallback} from 'react'
import {FlexBox, Modal, Text, Checkbox, Price, Button} from '@sf/design-system'
import {ModalHeader} from '@components/ModalTools'
import styled from 'styled-components'
import {rem} from 'polished'
import {ProductChildren} from '~menu/types'
import {useTranslation} from 'react-i18next'
import {Img} from '@components/Img'
import {Product} from '@schema/product'

interface Props {
  isOpenModal: boolean
  productChildren: ProductChildren[] | null
  handleCloseModal: () => void
  propertyCategory: string | null
  product: Product
  addProduct: (product: Product) => void
}

const AddToBasketButton = styled(Button)`
  height: 48px;
  margin: ${({theme}) => theme.spacing[3]};
`

const OrderModalHeader = styled(FlexBox).attrs({
  direction: 'column',
})`
  padding: ${({theme}) => theme.spacing[2]};
  padding-top: 0;
`

const PropertiesContainer = styled(FlexBox).attrs({
  direction: 'column',
})`
  margin: ${rem(18)};
  border: 1px solid var(--gray7-color);
  border-radius: 6px;
`

const PropertyIcon = styled(Img)`
  width: 32px;
  height: 32px;
  margin-right: ${rem(18)};
  margin-left: ${rem(8)};
  border: 1px solid var(--black);
  border-radius: 4px;
  user-select: none;

  img {
    display: block;
  }
`

const PropertyItem = styled(FlexBox).attrs({
  direction: 'column',
})<{idx: number | string; length: number}>`
  padding: ${({theme}) => theme.spacing[3]};
  border-bottom: ${({idx, length}) =>
    idx < length - 1 ? '1px solid var(--gray7-color)' : 'none'};
`

const PropertyCategoryTitle = styled(Text).attrs({
  scale: 'large',
  weight: 'bold',
})`
  padding: ${({theme}) => theme.spacing[3]};
`

const ShiftCard = styled(FlexBox)`
  width: ${rem(720)};
  max-height: calc(90vh - 2rem);
  overflow-y: scroll;
`
export const OrderModal: React.FC<Props> = ({
  isOpenModal,
  handleCloseModal,
  productChildren,
  propertyCategory,
  product,
  addProduct,
}) => {
  const {t} = useTranslation()
  const [activeChild, setActiveChild] = useState<ProductChildren | undefined>()

  useEffect(() => {
    if (productChildren) {
      setActiveChild(productChildren.find(item => item.active))
    }
  }, [productChildren])

  const [selectedProduct, setSelectedProduct] = useState<Product>(product)

  const onSelectProperty = useCallback((property: ProductChildren) => {
    setActiveChild(property)
    const {id, price, discount, discountRatio} = property
    const selectedProduct: Product = {
      ...product,
      id: +id,
      price,
      discount,
      discountRatio,
    }
    setSelectedProduct(selectedProduct)
  }, [])

  const onAddToBasketClick = () => {
    addProduct(selectedProduct)
    handleCloseModal()
  }

  return (
    <Modal
      isOpen={isOpenModal}
      onClose={handleCloseModal}
      animation='slideUp'
      backdropColor='var(--modal-backdrop)'
    >
      <ModalHeader onClose={handleCloseModal} />
      <ShiftCard direction='column'>
        <OrderModalHeader>
          <Text
            scale='default'
            weight='bold'
            colorName='carbon'
            margin='0 0 8px 0'
          >
            {t('menu:product-properties')}
          </Text>
          <Text
            scale='body'
            colorName='carbon'
            colorWeight='light'
            weight='normal'
          >
            {t('menu:select-product-property')}
          </Text>
        </OrderModalHeader>
        <PropertiesContainer>
          {propertyCategory && (
            <PropertyCategoryTitle>
              {propertyCategory} {t('menu:product')}
            </PropertyCategoryTitle>
          )}
          {productChildren?.map((item, idx) => (
            <PropertyItem
              idx={idx}
              key={`${item.propertyTitle}-${item.id}`}
              length={productChildren.length}
            >
              <Checkbox
                checked={item.id === activeChild?.id}
                name='number'
                onChange={e => onSelectProperty(item)}
                round
                type='radio'
              >
                <FlexBox
                  justify='space-between'
                  alignItems='center'
                  style={{width: '100%'}}
                >
                  <Text
                    scale='body'
                    colorName='carbon'
                    colorWeight='light'
                    weight='normal'
                  >
                    {item.propertyTitle}
                  </Text>
                  <FlexBox alignItems='center'>
                    <Price value={item.price - item.discount} />
                    <PropertyIcon src={item.propertyIcon} />
                  </FlexBox>
                </FlexBox>
              </Checkbox>
            </PropertyItem>
          ))}
        </PropertiesContainer>

        <AddToBasketButton
          colorName='accent'
          onClick={() => onAddToBasketClick()}
        >
          {t('menu:topping.add-to-basket')} {' - '}
          <Price
            margin='0 6px 0 0'
            value={(activeChild?.price || 0) - (activeChild?.discount || 0)}
            colorName='surface'
            labelColor='surface'
          />
        </AddToBasketButton>
      </ShiftCard>
    </Modal>
  )
}
