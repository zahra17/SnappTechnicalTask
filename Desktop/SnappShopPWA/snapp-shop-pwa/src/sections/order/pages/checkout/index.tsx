import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import styled from 'styled-components'
import {useRouter} from 'next/router'
import {rem} from 'polished'
import {useTranslation} from 'react-i18next'
import {useRudderStack} from '@contexts/RudderStack'
import {eventTypes} from '@schema/rudderStack'
import {
  FlexBox,
  Grid,
  Text,
  Button,
  ChevronLeftIcon,
  PinIcon,
  ApLogoIcon,
  CloseIcon,
  Price,
  PaymentIcon,
} from '@sf/design-system'

import configs from '@configs'
import {isAPIResponse} from '@api'
import ProtectRoute from '@root/Guard'
import {useAppDispatch} from '@redux'
import {SimplePageComponent} from '@root/types'
import {SpecialPayCode} from '@schema/basket'
import {selectAddress} from '@slices/core'
import {initialBasketInServer} from '@slices/baskets'
import {useToast} from '@contexts/Toast'
import requests from '~order/endpoints'
import {NewOrderPayload, NewOrderResponse} from '@schema/order'
import SelectCard from '~order/components/SelectCard'
import RadioCard from '~order/components/RadioCard'
import {useCheckout} from '~order/hooks/useCheckout'
import {useSpecialTransaction} from '~order/hooks/useSpecialTransaction'
import VoucherField from '~order/components/Voucher'
import CheckoutLayout from '~order/layouts/Checkout'
import {
  orderSideEffects,
  minimizeProducts,
  decodeBasketCode,
} from '~order/helpers'
import {BasketPrices, DiscountTypes} from '@schema/basket'
import {
  selectActiveAddress,
  showModal as showModalAction,
} from '~growth/redux/location'
import {SpecialTransactionLoading} from '~order/components/SpecialTransactionLoading'

const Page = styled(CheckoutLayout)<{isHidden: boolean}>`
  display: ${({isHidden}) => isHidden && 'none'};
  padding-top: ${rem(68)};
`
const Container = styled(FlexBox)`
  border: ${rem(1)} solid ${({theme}) => theme.carbon.alphaLight};
  border-radius: ${rem(8)};
`
const Section = styled(FlexBox).attrs({
  direction: 'column',
})`
  box-sizing: border-box;
  width: 100%;
  padding: ${({theme}) => theme.spacing[3]};

  &:not(:last-child) {
    padding-bottom: 0;
  }
`
const Header = styled(FlexBox)`
  height: ${({theme}) => theme.spacing[3]};
  margin-bottom: ${({theme}) => theme.spacing[2]};
`
const BasketInfo = styled(FlexBox)`
  border: ${rem(1)} solid ${({theme}) => theme.carbon.alphaLight};
  border-radius: ${rem(8)};

  > {
    &:last-child {
      margin: ${rem(12)};
    }
  }
`
const Item = styled(FlexBox).attrs({
  justify: 'space-between',
  alignItems: 'center',
})`
  box-sizing: border-box;
  min-height: ${({theme}) => theme.spacing[6]};
  padding: ${({theme}) => theme.spacing[1]} ${({theme}) => theme.spacing[2]};
  border-bottom: ${rem(1)} solid ${({theme}) => theme.carbon.alphaLight};

  > {
    &:last-child {
      * {
        margin-right: ${rem(2)};
      }
    }
  }
`
const BasketTitle = styled(FlexBox).attrs({
  alignItems: 'center',
})`
  box-sizing: border-box;
  min-height: ${({theme}) => theme.spacing[7]};
  padding: 0 ${({theme}) => theme.spacing[2]};
  border-bottom: ${rem(1)} solid ${({theme}) => theme.carbon.alphaLight};
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
  box-sizing: border-box;
  height: ${({theme}) => theme.spacing[6]};
  padding: 0 ${({theme}) => theme.spacing[2]};
  border-top: ${rem(1)} solid ${({theme}) => theme.carbon.alphaLight};
`

const CheckoutPage: SimplePageComponent = () => {
  const {t} = useTranslation()
  const rudderStack = useRudderStack()
  const router = useRouter()
  const {showToast} = useToast()

  const [submitting, setSubmitting] = useState(false)

  const specialTransaction = useSpecialTransaction()
  const {basket, vendor, actions, props, payments} = useCheckout()

  const address = useSelector(selectAddress(basket?.addressId))

  const activeAddress = useSelector(selectActiveAddress)

  const dispatch = useAppDispatch()

  const setNewOrderError = (message: string) => {
    showToast({message, status: 'alert'})
  }

  const handleChangeAddress = () => {
    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: 'Checkout Address Change',
    })
    dispatch(showModalAction(true))
  }

  const handleSetBankCode = (bankCode: string) => {
    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: 'Payment Method Click',
      payload: {
        method_name: bankCode,
      },
    })
    actions.setBankCode(bankCode)
  }

  const handleUseCredit = (
    credit: number,
    isCreditActive: boolean | undefined
  ) => {
    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: 'AP Wallet',
      payload: {
        Amount: credit,
      },
    })
    actions.useCredit(!isCreditActive)
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!basket?.verified || submitting) return

    if (!basket.addressId) return

    if (!props.paymentType) {
      return console.log('Please select address.')
    }

    if (!basket.expeditionType) {
      return console.log('Please select expedition type.')
    }

    setSubmitting(true)

    const data: NewOrderPayload = {
      vendorId: vendor.vendor.id,
      bankCode: basket.bank,
      voucherCode: basket.discount?.voucherCode,
      paymentType: props.paymentType,
      addressId: +basket.addressId,
      products: minimizeProducts(basket.products),
      paidByCredit: props.isCreditActive ? 1 : 0,
      expeditionType: basket.expeditionType,
      preorderDate: undefined,
      isSpecial: props.isSpecial ? 1 : 0,
      couponId: basket.selectedCoupon?.id,
      customerComment: basket.description,
      reserverIdentity: basket.id!,
      platform: configs.CLIENT!,
    }
    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: 'Checkout Started',
      payload: {
        // order_id: 'response.data.data.code',
        value: basket.total,
        revenue: basket.prices?.find(
          price => price.alias === BasketPrices.total
        )?.value,
        shipping: basket.deliveryFee,
        tax: basket.vat,
        discount: basket.totalDiscount,
        coupon:
          basket.discount?.type === DiscountTypes.voucher
            ? basket.discount?.voucherCode
            : '',
        products: basket.products?.map((product, index) => {
          return {
            product_id: product.id,
            category: product.category,
            name: product.title,
            price: product.price,
            quantity: product.count,
            position: index,
            image_url:
              product.images &&
              product.images?.length > 0 &&
              product.images[0]?.imageSrc,
          }
        }),
      },
    })
    try {
      const response = await requests.submitNewOrder<NewOrderResponse>({data})
      if (isAPIResponse(response) && response.data.data) {
        await handleRedirect(response.data.data, basket.bank!)
      } else if (isAPIResponse(response) && response.data.error) {
        setNewOrderError(response.data.error.message)
      } else {
        throw 'network-error'
      }
    } catch (error) {
      setNewOrderError(t('order:network-error'))
    }
    setSubmitting(false)
  }

  const handleRedirect = async (
    data: NewOrderResponse['data'],
    bankCode: string
  ) => {
    if (data?.url) window.location.assign(data.url)
    else if (data?.code) {
      const params = new URLSearchParams()
      params.append('payment_type', props.paymentType!)
      params.append('paymentAmount', `${data.totalCost}`)

      const result = await specialTransaction.handler(bankCode, data.code)

      if (result) router.push(`/order/success/${data.code}?${params}`)
    }
  }

  if (!basket) return null
  return (
    <Page isHidden={specialTransaction.loading}>
      <Grid container spacing={4}>
        <Grid item xs={1}></Grid>
        <Grid item xs={7}>
          <Container direction='column'>
            <Section>
              <Header justify='space-between' alignItems='center'>
                <Text scale='caption' colorWeight='light' weight='bold'>
                  {t('order:address')}
                </Text>
                <Button
                  type='button'
                  appearance='naked'
                  colorName='accent2'
                  size='body'
                  onClick={() => handleChangeAddress()}
                >
                  <Text scale='caption' colorName='inherit' weight='bold'>
                    {t('order:checkout.change-address')}
                  </Text>
                  <ChevronLeftIcon height={12} fill='var(--sf-accent2-main)' />
                </Button>
              </Header>
              <FlexBox direction='column'>
                {address ? (
                  <SelectCard
                    id={address.id}
                    isActive={basket?.expeditionType !== 'PICKUP'}
                    title={address.label}
                    description={address.address}
                    onClick={actions.setDelivery}
                    logo={PinIcon}
                  />
                ) : activeAddress ? (
                  <SelectCard
                    id={activeAddress.id}
                    disabled
                    isActive={false}
                    disabledReason={t('order:checkout.out-range')}
                    title={activeAddress.label}
                    description={activeAddress.address}
                    onClick={() => {}}
                    logo={PinIcon}
                  />
                ) : null}
                {/* {basket.options?.pickupAvailability.order ? (
                  <SelectCard
                    id={1}
                    title={t('order:checkout.pickup-vendor', {
                      name: vendor.vendor.title,
                    })}
                    description={vendor.vendor.address}
                    isActive={basket?.expeditionType === 'PICKUP'}
                    onClick={actions.setPickup}
                    logo={PackIcon}
                  />
                ) : null} */}
              </FlexBox>
            </Section>
            <Section>
              <Header justify='space-between' alignItems='center'>
                <Text scale='caption' colorWeight='light' weight='bold'>
                  {t('order:checkout.payment-options')}
                </Text>
              </Header>
              <FlexBox direction='column'>
                {payments.specialGateways.sortedInfo.map(gateway => {
                  const {code, info, maxAmount} = gateway
                  const bankCode = code as SpecialPayCode
                  const isActive = payments.specialGateways.isActive?.[bankCode]
                  return (
                    <SelectCard
                      key={bankCode}
                      id={bankCode}
                      title={t(`order:checkout.${bankCode}.title`)}
                      description={t(`order:checkout.${bankCode}.amount`, {
                        maxAmount,
                      })}
                      isActive={actions.isGatewayActive(bankCode)}
                      onClick={() => actions.setBankCode(bankCode)}
                      disabled={!isActive}
                      logo={isActive ? info!.activeLogo : info!.inactiveLogo}
                    />
                  )
                })}
                {basket.options?.gateways.map(gateway => (
                  <SelectCard
                    key={gateway.bankCode}
                    id={gateway.bankCode}
                    title={t('order:checkout.online-payment')}
                    description={gateway.bankTitle}
                    isActive={actions.isGatewayActive(gateway.bankCode)}
                    onClick={() => handleSetBankCode(gateway.bankCode)}
                    logo={gateway.activeLogo}
                  />
                )) ?? null}
                {props.hasCASH || props.hasPOS ? (
                  <SelectCard
                    id='pay-in-location'
                    title={t('order:checkout.pay-in-location')}
                    isActive={props.isPayInLocationActive}
                    onClick={actions.setInLocationPaymentType}
                    logo={PaymentIcon}
                  />
                ) : null}
              </FlexBox>
            </Section>
            <Section>
              {props.showCredit ? (
                <RadioCard
                  title={t('order:checkout.use-credit')}
                  description={t('order:checkout.credit-amount', {
                    credit: payments.credit,
                  })}
                  isActive={props.isCreditActive}
                  onClick={() =>
                    handleUseCredit(payments.credit, props.isCreditActive)
                  }
                  logo={ApLogoIcon}
                />
              ) : null}
              {/* <RadioCard
                title={t('order:checkout.vip-discount', {total: 5, number: 4})}
                isActive={freeDelivery}
                onClick={() => setFreeDelivery(!freeDelivery)}
                logo={GiftIcon}
              /> */}
              {props.showVoucher ? (
                <VoucherField
                  setVoucher={actions.setVoucher}
                  clearErrors={actions.clearAPIErrors}
                  voucherCode={basket?.discount?.voucherCode}
                  amount={basket?.discount?.amount}
                  error={props.voucherError}
                  loading={props.voucherLoading ?? false}
                />
              ) : null}
            </Section>
          </Container>
        </Grid>
        <Grid item xs={3} as='form' onSubmit={handleSubmit}>
          <BasketInfo direction='column'>
            <BasketTitle>
              <Text as='span' scale='body' weight='bold'>
                {t('basket.cart')}
              </Text>
              &nbsp;
              <Text as='span' scale='body'>
                {`(${basket.products?.reduce((a, b) => a + b.count, 0)})`}
              </Text>
            </BasketTitle>
            {basket.products?.map(
              product =>
                (
                  <Item key={product.id}>
                    <Text as='span' scale='body'>
                      {product.title}
                    </Text>
                    <FlexBox direction='row-reverse' alignItems='center'>
                      <Price value={product.price} />
                      <CloseIcon width={6} height={6} />
                      <Text as='span' scale='body' colorWeight='light'>
                        {product.count}
                      </Text>
                    </FlexBox>
                  </Item>
                ) ?? null
            )}

            {basket.prices?.map(price => (
              <BillItem key={price.title}>
                <Text as='span' scale='body'>
                  {price.title}
                </Text>
                <Price value={price.value} weight='normal' scale='body' />
              </BillItem>
            )) ?? null}
            <Total>
              <Text scale='body' as='span' weight='bold'>
                {t('basket.total')}
              </Text>
              <Price value={basket.total ?? 0} scale='body' />
            </Total>
            <Button
              type='submit'
              size='large'
              isLoading={props.loading || submitting}
              disabled={!basket.addressId}
            >
              {props.isPayInLocationActive
                ? t('basket.submit')
                : t('order:payment')}
            </Button>
          </BasketInfo>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
      <SpecialTransactionLoading
        loading={specialTransaction.loading}
        title={t(`order:checkout.${basket.bank}.title`)}
        gateway={payments.specialGateways.info?.[basket.bank as SpecialPayCode]}
      />
    </Page>
  )
}

CheckoutPage.getInitialProps = async ctx => {
  orderSideEffects(ctx)
  const {store, isServer, query, res} = ctx

  // fetch basket
  if (isServer) {
    const {basketCode} = query

    if (basketCode) {
      const {vendor, basketId} = decodeBasketCode(basketCode as string, res)

      await store.dispatch(initialBasketInServer(vendor!, basketId!))
    }
  }
}

export default ProtectRoute(CheckoutPage)
