import {useMemo, useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import {useSelector} from 'react-redux'

import useUpdateAddress from '@hooks/useUpdateAddress'
import {VendorBaseModel} from '@schema/vendor'
import {useAppDispatch} from '@redux'
import {
  basketActions,
  clearErrors,
  selectBasket,
  selectBasketAPI,
} from '@slices/baskets'
import {
  ExpeditionType,
  UpdatePayload,
  PaymentType,
  PaymentTypeName,
  SpecialPayCode,
} from '@schema/basket'
import {decodeBasketCode} from '~order/helpers'
import useCredit from '~order/hooks/useCredit'
import useBasketError from '@hooks/useBasketError'
import {useSpecialPayment} from '~order/hooks/useSpecialPayment'
import {checkTimeRange} from '@utils'

export const useCheckout = () => {
  const router = useRouter()

  const {query} = router

  const {vendor: vendorBase} = decodeBasketCode(query.basketCode as string)

  const vendor = new VendorBaseModel(vendorBase!)

  const dispatch = useAppDispatch()

  const {vendorCode} = vendor

  const basket = useSelector(selectBasket(vendorCode))
  const basketAPI = useSelector(selectBasketAPI(vendorCode))

  useBasketError(vendorCode)
  useUpdateAddress(vendorCode)

  const credit = useCredit()
  const specialGateways = useSpecialPayment(basket)

  const payments = {credit, specialGateways}

  const updateBasket = (data: UpdatePayload) => {
    dispatch(basketActions.updateBasket(data))
  }

  useEffect(() => {
    if (!basket) router.replace(vendor.getLink())
    else if (!basket.bank && basket.options?.gateways.length) {
      const [gateway] = basket.options.gateways
      updateBasket({vendorCode, bank: gateway.bankCode})
    }
  }, [basket])

  const actions = useMemo(
    () => ({
      setDelivery: () => {
        if (/ZF_EXPRESS|DELIVERY/.test(basket?.expeditionType ?? '')) return

        const expedition: ExpeditionType = vendor.isExpress()
          ? 'ZF_EXPRESS'
          : 'DELIVERY'
        updateBasket({vendorCode, expeditionType: expedition})
      },
      setPickup: () => {
        updateBasket({vendorCode, expeditionType: 'PICKUP'})
      },
      setBankCode: (bankCode: string) => {
        updateBasket({
          vendorCode,
          bank: bankCode,
          paymentType: PaymentType.ONLINE,
        })
      },
      useCredit: (useCredit: boolean) => {
        updateBasket({vendorCode, useCredit})
      },
      setInLocationPaymentType: () => {
        let paymentType = PaymentType.ONLINE
        const other = props.hasCASH
          ? (PaymentType[PaymentType.CASH] as PaymentTypeName)
          : props.hasPOS
          ? (PaymentType[PaymentType.POS] as PaymentTypeName)
          : undefined
        if (other) paymentType = PaymentType[other]
        updateBasket({vendorCode, paymentType})
      },
      setVoucher: (voucherCode: string) => {
        updateBasket({vendorCode, voucherCode})
      },
      clearAPIErrors: () => {
        dispatch(clearErrors(vendorCode))
      },
      isGatewayActive: (code: string) => {
        return !props.isPayInLocationActive && code === basket?.bank
      },
    }),
    [query.vendor, basket, specialGateways.isActive]
  )

  const props = useMemo(() => {
    const hasPOS =
      basket?.options?.paymentTypes?.includes(PaymentType.POS) &&
      checkTimeRange({h: 11}, {h: 22, m: 30})

    const hasCASH = basket?.options?.paymentTypes?.includes(PaymentType.CASH)

    return {
      isPayInLocationActive: basket?.paymentType
        ? [PaymentType.POS, PaymentType.CASH].includes(basket.paymentType)
        : false,

      hasPOS,

      hasCASH,

      showVoucher:
        basket?.options?.showVoucherField &&
        basket?.paymentType !== PaymentType.CASH,

      isCreditActive: basket?.useCredit,

      showCredit:
        basket?.options?.showCredit &&
        payments.credit &&
        basket?.paymentType !== PaymentType.CASH &&
        basket.bank !== SpecialPayCode.snapp,

      isSpecial:
        !!basket?.basketType?.includes('food-party') ||
        !!basket?.basketType?.includes('market-party'),

      paymentType:
        basket?.paymentType &&
        (PaymentType[basket.paymentType] as PaymentTypeName),

      voucherLoading:
        basketAPI?.loading.actions.includes('setVoucher') &&
        basketAPI?.loading.status,

      voucherError: basketAPI?.error.actions.includes('setVoucher')
        ? basketAPI?.error.message
        : '',

      loading: basketAPI?.loading.status ?? false,
    }
  }, [query.vendor, basket, basketAPI, payments])

  return {basket, vendor, actions, props, payments}
}
