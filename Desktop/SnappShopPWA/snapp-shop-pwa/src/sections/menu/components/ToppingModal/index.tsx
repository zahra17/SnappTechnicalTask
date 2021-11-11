import React, {useContext, useRef, useState} from 'react'
import styled from 'styled-components'
import {Modal, Text, FlexBox, Button, Price} from '@sf/design-system'
import {useTranslation} from 'react-i18next'

import {ModalHeader} from '@components/ModalTools'
import {ProductContext} from '@contexts/Product'
import {useToast} from '@contexts/Toast'
import {rem} from 'polished'
import ToppingGroup from './ToppingGroup'
import {useBasketProduct} from '@hooks/useBasket'
import {ToppingBase, ProductTopping} from '@schema/product'

const ModalContainer = styled(Modal)`
  width: ${rem(480)};
`

const Header = styled.section`
  padding: 0 1rem 1rem;

  div:first-child {
    margin-bottom: 0.5rem;
  }
`
const Body = styled.section`
  /* height: 50vh; */
  max-height: 50vh;
  padding: 1rem;
  overflow-y: auto;
`
const Footer = styled(FlexBox)`
  padding: ${rem(12)};

  button {
    height: 3rem;
  }
`

const ToppingModal: React.FC = () => {
  const INITIAL_ID_STATE = 0
  const [activeElement, setActiveElement] = useState(INITIAL_ID_STATE)
  const {t} = useTranslation()
  const {
    activeProduct,
    isToppingModalOpen,
    activeToppings = [],
    setContextState,
  } = useContext(ProductContext)
  const {showToast} = useToast()

  const bodyRef = useRef(null)
  const {handleProductAction} = useBasketProduct(activeProduct?.id)

  const closeModal = () => {
    setContextState!({isToppingModalOpen: false})
    setActiveElement(INITIAL_ID_STATE)
  }

  function submitTopping(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const flattedSelectedTopping = activeToppings.map(item => item.id)
    const necessaryProductToppings = activeProduct?.productToppings.filter(
      (productTopping: ProductTopping) => productTopping?.minCount > 0
    )
    const notSelectedProductToppings: ProductTopping[] =
      necessaryProductToppings?.filter(
        (necessaryProductTopping: ProductTopping) =>
          necessaryProductTopping.toppings?.filter(topping =>
            flattedSelectedTopping.includes(topping.id)
          ).length < necessaryProductTopping.minCount
      ) ?? []

    if (notSelectedProductToppings.length) {
      const firstGroup = notSelectedProductToppings[0]
      const notSelectedGroupElm = document.getElementById(
        `toppings-group-${firstGroup.id}`
      )
      notSelectedGroupElm?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })

      setActiveElement(firstGroup.id)

      // showToast({
      //   status: 'alert',
      //   right: 80,
      //   message: t('menu:topping.min-count-error', {
      //     text: firstGroup.title,
      //     score: firstGroup.minCount?.toString(),
      //   }),
      // })
    } else {
      handleProductAction({...activeProduct!, toppings: activeToppings}, 'add')
      setActiveElement(INITIAL_ID_STATE)
      closeModal()
    }
  }

  const accPrice = activeProduct
    ? activeProduct.price -
      activeProduct.discount +
      activeToppings?.reduce(
        (sum, activeTopping: ToppingBase) => sum + (activeTopping?.price ?? 0),
        0
      )
    : 0

  return (
    <ModalContainer
      isOpen={isToppingModalOpen!}
      onClose={closeModal}
      animation='slideDown'
      backdropColor='var(--modal-backdrop)'
    >
      <ModalHeader title='' onClose={closeModal} />
      <Header>
        <div>
          <Text
            scale='xlarge'
            weight='bold'
            colorName='carbon'
            colorWeight='light'
          >
            {t('menu:topping.select-topping')}
          </Text>
        </div>
        <div>
          <Text
            scale='body'
            weight='normal'
            colorName='carbon'
            colorWeight='light'
          >
            {activeProduct?.title}
          </Text>
        </div>
      </Header>
      <form onSubmit={submitTopping}>
        <Body ref={bodyRef}>
          <div>
            {activeProduct?.productToppings.map(productTopping => (
              <ToppingGroup
                key={productTopping.id}
                id={productTopping.id}
                title={productTopping.title}
                minCount={productTopping.minCount}
                maxCount={productTopping.maxCount}
                toppings={productTopping.toppings}
                isActive={activeElement === productTopping.id}
              />
            ))}
          </div>
        </Body>
        <Footer>
          <Button
            block
            type='submit'
            appearance={'solid'}
            colorName={'accent'}
            disabled={false}
            // isLoading={isLoading}
          >
            <Text
              scale='default'
              weight='bold'
              colorName='surface'
              padding='0 0 0 0.5rem'
            >
              {t('menu:topping.add-to-basket')}
            </Text>
            <Price
              value={accPrice}
              weight='normal'
              colorName='surface'
              labelColor='surface'
            />
          </Button>
        </Footer>
      </form>
    </ModalContainer>
  )
}

export default ToppingModal
