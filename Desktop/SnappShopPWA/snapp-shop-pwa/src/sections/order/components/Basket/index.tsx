import React, {useState, useContext, useRef, useEffect} from 'react'
import {useRouter} from 'next/router'
import {useSelector} from 'react-redux'
import {useTranslation} from 'react-i18next'
import {SimplePageComponent as SPC} from '@root/types'
import {Basket as BasketType} from '@schema/basket'
import {useQueryParam, BooleanParam} from 'use-query-params'
import {
  Grid,
  Text,
  FlexBox,
  EditIcon,
  Button,
  Price,
  RemoveIcon,
  BasketIcon,
  Progress,
  Modal,
} from '@sf/design-system'
import styled from 'styled-components'
import {rem} from 'polished'

import {useAppDispatch} from '@redux'
import {selectUser} from '@slices/core'
import useBasket from '@hooks/useBasket'
import {useRudderStack} from '@contexts/RudderStack'
import {eventTypes} from '@schema/rudderStack'
import AddRemove from '@components/AddRemove'
import {ProductBase} from '@schema/product'
import {encodeBasketCode} from '~order/helpers'
import {getProductUniqueId} from '@utils'
import {ProductContext} from '@contexts/Product'
import {showModal as showModalAction} from '~growth/redux/location'
import {selectVendor} from '~menu/redux/vendor'
import {selectZooketVendor} from '~menu/redux/zooket'
import ConfirmationModal from '@components/ConfirmationModal'

const Container = styled(Grid)`
  box-sizing: border-box;
  margin-top: ${({theme}) => theme.spacing[1]};
  padding: ${({theme}) => theme.spacing[2]};
  padding-bottom: ${rem(12)};
  background-color: ${({theme}) => theme.surface.light};
  border: ${rem(1)} solid ${({theme}) => theme.carbon.alphaLight};
  border-radius: ${({theme}) => theme.spacing[1]};
`
const NoBasketContainer = styled(FlexBox)`
  box-sizing: border-box;
  margin-top: ${({theme}) => theme.spacing[1]};
  padding-top: ${({theme}) => theme.spacing[6]};

  > {
    &:last-child {
      margin-top: ${({theme}) => theme.spacing[3]};
    }
  }
`
const Header = styled(FlexBox)`
  height: ${({theme}) => theme.spacing[3]};
  margin-bottom: ${({theme}) => theme.spacing[1]};
`
const ItemContent = styled(FlexBox)`
  padding: ${({theme}) => theme.spacing[1]} 0;
  border-bottom: 1px solid ${({theme}) => theme.carbon.alphaLight};

  > {
    &:first-child {
      min-height: ${({theme}) => theme.spacing[5]};
    }
  }
`
const Item = styled(FlexBox).attrs({
  justify: 'space-between',
  alignItems: 'center',
})`
  height: ${({theme}) => theme.spacing[4]};
`
const ToppingItem = styled(FlexBox).attrs({
  alignItems: 'center',
})`
  height: ${({theme}) => theme.spacing[4]};
`
const Footer = styled(FlexBox)`
  height: ${({theme}) => theme.spacing[5]};
`
const Bill = styled(FlexBox)`
  border-bottom: 1px solid ${({theme}) => theme.carbon.alphaLight};
`
const Total = styled(FlexBox).attrs({
  justify: 'space-between',
  alignItems: 'center',
})`
  height: ${({theme}) => theme.spacing[6]};
`
const Textarea = styled.textarea`
  box-sizing: border-box;
  width: 100%;
  min-height: calc(${({theme}) => theme.spacing[6]} * 2);
  margin-top: ${({theme}) => theme.spacing[2]};
  margin-bottom: calc(${({theme}) => theme.spacing[2]} + ${rem(12)});
  padding: ${rem(12)};
  color: ${({theme}) => theme.carbon.main};
  border-color: ${({theme}) => theme.carbon.alphaMedium};
  border-radius: ${rem(6)};
  resize: vertical;
`
const Coupon = styled.div`
  flex: 1 0 auto;
  max-width: calc(100% - ${({theme}) => theme.spacing[4]});
  margin: ${({theme}) => theme.spacing[2]} 0;

  > *:first-child {
    display: block;
    margin-bottom: ${rem(4)};
  }
`
const RemoveCoupon = styled(Button)`
  flex: 0 0 ${({theme}) => theme.spacing[4]};
  min-width: ${({theme}) => theme.spacing[4]};
`
const Edit = styled(EditIcon)`
  width: ${rem(13)};
  height: ${rem(13)};
`
const ProgressMinOrder = styled(FlexBox)`
  height: ${({theme}) => theme.spacing[6]};
  padding-top: ${({theme}) => theme.spacing[2]};
`
const OutRangeContainer = styled(FlexBox)`
  height: ${rem(120)};
  margin: -${rem(12)} -${({theme}) => theme.spacing[2]};
  padding: 0 ${({theme}) => theme.spacing[2]};
`
const Confirmation = styled(FlexBox)`
  box-sizing: border-box;
  width: ${rem(480)};
  height: ${rem(180)};
  padding: ${({theme}) => theme.spacing[2]};

  > {
    &:last-child {
      width: 100%;

      button {
        width: ${rem(216)};
      }
    }
  }
`
const BillContainer = styled.div`
  max-height: 45vh;
  overflow: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
`
const SubmitButton = styled(Button)`
  margin-top: ${({theme}) => theme.spacing[2]};
  margin-bottom: auto;
`
const SubmitContainer = styled.div`
  position: sticky;
  bottom: 0;
  width: 100%;
  height: ${rem(120)};
  background-color: ${({theme}) => theme.surface.light};
`
const Basket = () => {
  const {t} = useTranslation()
  const rudderStack = useRudderStack()
  const router = useRouter()

  const user = useSelector(selectUser)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [, setLoginRequired] = useQueryParam('login', BooleanParam)

  const dispatch = useAppDispatch()

  const descriptionRef = useRef<HTMLTextAreaElement>(null)

  const {
    basket,
    handleProduct,
    setDescription,
    clearBasket,
    removeCoupon,
  } = useBasket()

  // check if it's current vendor?
  let vendor = useSelector(selectVendor)
  const zooket = useSelector(selectZooketVendor)
  if (vendor?.vendorCode !== basket?.vendor.vendorCode) {
    vendor = zooket
  }

  const hasBasketAddressId = basket?.addressId

  const basket_total_price =
    basket?.prices?.filter(item => item.alias === 'TOTAL_PRICE')[0].value ?? 0

  const isOrderPriceMoreThanMinOrder =
    Number(basket_total_price) < Number(vendor?.minOrder)

  const getAddButtonStatus = (product: ProductBase) => {
    //disable if basket has no item
    if (!basket?.products) return true

    const productTotalCount = basket.products
      .filter(item => product.id === item.id)
      .reduce((acc, item) => acc + item.count, 0)

    let minCap = undefined

    if (product.capacity && product.sectionCap) {
      minCap = Math.min(product.capacity, product.sectionCap)
    } else {
      minCap = product.capacity || product.sectionCap
    }

    //NOTE: if capacity is 0 we return true in wrong way (but it's nonsense right? :D)
    const hasBasketEnoughCapacity = !minCap || productTotalCount < minCap

    const hasBasketStockLimit =
      basket.stocks &&
      product.id in basket.stocks &&
      basket.stocks[product.id] < 1

    return hasBasketStockLimit || !hasBasketEnoughCapacity
  }
  const {setContextState} = useContext(ProductContext)

  const openToppingModal = (product: ProductBase) => {
    setContextState!({
      isToppingModalOpen: true,
      // activeProduct: product,
      activeToppings: product.toppings,
    })
  }

  const addProduct = (product: ProductBase) => {
    handleProduct(product, 'add')
  }

  const removeProduct = (product: ProductBase) => {
    handleProduct(product, 'remove')
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!user) return setLoginRequired(true, 'replaceIn')

    if (!hasBasketAddressId) return dispatch(showModalAction(true))

    if (!basket?.verified) return

    if (descriptionRef.current?.value) {
      setDescription(descriptionRef.current?.value)
    }

    const basketCode = await encodeBasketCode(basket.id!, basket.vendor)

    router.push(`/checkout/${basketCode}`)
  }

  const handleOpenRemoveModal = () => {
    setIsModalOpen(true)
  }
  const handleClearBasket = () => {
    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: 'Basket removed',
    })
    clearBasket()
    setIsModalOpen(false)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }
  // empty basket
  if (!basket || !basket.products?.length)
    return (
      <NoBasketContainer direction='column' alignItems='center'>
        <BasketIcon fill='var(--sf-inactive-dark)' />
        <Text scale='body' colorName='inactive' colorWeight='dark'>
          {t('basket.noBasketText')}
        </Text>
      </NoBasketContainer>
    )

  // created basket
  return (
    <Container as='form' onSubmit={handleSubmit}>
      <Header justify='space-between' alignItems='center'>
        <FlexBox>
          <Text scale='body' colorWeight='light' weight='bold'>
            {t('basket.cart')}
          </Text>
          &nbsp;
          <Text scale='body' colorWeight='light' as='span'>
            {`(${basket.products.reduce((a, b) => a + b.count, 0)})`}
          </Text>
        </FlexBox>
        <Button
          round
          size='body'
          appearance='naked'
          type='button'
          onClick={() => handleOpenRemoveModal()}
        >
          <RemoveIcon role='button' tabIndex={-1} fill='var(--sf-alert-main)' />
        </Button>
      </Header>
      {basket.products?.map(product => (
        <ItemContent key={`${getProductUniqueId(product)}`} direction='column'>
          <FlexBox justify='space-between' alignItems='center'>
            <Text scale='body' weight='bold' as='span'>
              {product.title}
            </Text>
            {/* {product.toppings?.length ? (
              <Button
                round
                size='body'
                type='button'
                appearance='naked'
                onClick={() => openToppingModal(product)}
              >
                <Edit fill='var(--sf-carbon-light)' />
              </Button>
            ) : null} */}
          </FlexBox>
          {product.toppings?.map(topping => (
            <ToppingItem key={topping.id}>
              <Text scale='caption'>{topping.title}</Text>
              <Text
                style={{marginRight: '4px'}}
                as='span'
                scale='body'
                weight='normal'
              >
                (
              </Text>
              <Price value={topping.price!} scale='body' weight='normal' />
              <Text as='span' scale='body' weight='normal'>
                )
              </Text>
            </ToppingItem>
          ))}
          <ProductFooter
            product={product}
            basket={basket}
            addProduct={addProduct}
            removeProduct={removeProduct}
            getAddButtonStatus={getAddButtonStatus}
          />
        </ItemContent>
      ))}
      <Bill direction='column'>
        {basket.prices?.map(price => (
          <Item key={price.title}>
            <Text as='span' scale='body'>
              {price.title}
            </Text>
            <Price value={price.value} weight='normal' scale='body' />
          </Item>
        )) ?? null}
      </Bill>

      {!!basket.selectedCoupon && (
        <Bill direction='column'>
          <FlexBox justify='space-between' alignItems='center'>
            <Coupon>
              <Text as='span' scale='caption' weight='bold' colorName='accent2'>
                {basket.selectedCoupon.title}
              </Text>
              <Text as='span' scale='caption'>
                {basket.selectedCoupon.descriptions}
              </Text>
            </Coupon>
            <RemoveCoupon
              type='button'
              size='body'
              appearance='naked'
              colorName='carbon'
              onClick={removeCoupon}
            >
              <RemoveIcon role='button' />
            </RemoveCoupon>
          </FlexBox>
        </Bill>
      )}

      {basket.total ? (
        <Total>
          <Text scale='body' weight='bold'>
            {t('basket.total')}
          </Text>
          <Price value={basket.total} scale='body' />
        </Total>
      ) : null}
      <Textarea
        placeholder={t('basket.description')}
        name='description'
        ref={descriptionRef}
      />
      {/* // check if order price is more than min order */}
      {vendor?.minOrder &&
      basket_total_price && //check if just start to add first product
      isOrderPriceMoreThanMinOrder ? (
        <SubmitContainer>
          <ProgressMinOrder direction='column' justify='space-around'>
            <FlexBox justify='space-between'>
              <Text scale='caption'>
                {t('basket.leftToMinAmount', {
                  value: vendor?.minOrder - basket_total_price,
                })}
              </Text>
              <Text scale='caption'>
                {t('basket.price', {
                  value: vendor?.minOrder,
                })}
              </Text>
            </FlexBox>
            <Progress value={basket_total_price} max={vendor.minOrder} />
          </ProgressMinOrder>
        </SubmitContainer>
      ) : user && !basket.addressId ? (
        <SubmitContainer>
          <OutRangeContainer direction='column' justify='space-evenly'>
            <Text scale='body' colorName='alert'>
              {t('basket.OtherAddressError', {
                vendorTypeTitle: basket.vendor.vendorTypeTitle,
              })}
            </Text>
            <Button
              block
              size='body'
              type='submit'
              isLoading={!basket.verified}
              appearance='outline'
            >
              {t('basket.selectOtherAddress')}
            </Button>
          </OutRangeContainer>
        </SubmitContainer>
      ) : (
        <SubmitContainer>
          <SubmitButton
            block
            size='large'
            type='submit'
            isLoading={!basket.verified}
          >
            {user ? t('basket.submit') : t('login_pass')}
          </SubmitButton>
        </SubmitContainer>
      )}
      <ConfirmationModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        title={t('basket.removeConfirmation')}
        mainButtonText={t('basket.remove')}
        secondaryButtonText={t('basket.cancel')}
        onSubmit={handleClearBasket}
      />
    </Container>
  )
}

const ProductFooter: SPC<{
  product: ProductBase
  basket: BasketType
  addProduct: (product: ProductBase) => void
  removeProduct: (product: ProductBase) => void
  getAddButtonStatus: (product: ProductBase) => false | undefined | boolean
}> = ({product, basket, addProduct, removeProduct, getAddButtonStatus}) => {
  const [toppingsPrice, setToppingsPrice] = useState(0)
  useEffect(() => {
    setToppingsPrice(
      product.toppings && product.toppings.length
        ? product.toppings
            .map(item => item && item.price!)
            .reduce((prev, next) => prev + next)
        : 0
    )
  }, [])
  return (
    <Footer alignItems='center' justify='space-between'>
      <Price
        value={product.price - product.discount + toppingsPrice}
        oldPrice={product.discount && product.price}
        discount={product.productDiscountValue}
      />
      <AddRemove
        showStockLimit={false}
        stock={basket?.stocks?.[product.id] ?? null}
        round
        count={product.count ?? 0}
        onClickAdd={() => addProduct(product)}
        onClickRemove={() => removeProduct(product)}
        disableAdd={getAddButtonStatus(product)}
      />
    </Footer>
  )
}
export default Basket
