import {PayloadAction} from '@reduxjs/toolkit'

import {AppThunk} from '@redux'
import {compareProducts} from '@utils'
import configs from '@configs'
import {ProductBase} from '@schema/product'
import {VendorBase} from '@schema/vendor'
import {
  AddPayload,
  Basket,
  BasketAction,
  BasketAPIResponse,
  CreatePayload,
  HandleAction,
  RemovePayload,
  UpdateByAPIPayload,
  AddDescriptionPayload,
  UpdatePayload,
} from '@schema/basket'
import {Address} from '@schema/address'
import {selectActiveAddressId} from '~growth/redux/location'
import {
  createBasket,
  clearBasket,
  addProduct,
  removeProduct,
  selectBaskets,
  updateBasket,
} from './local-basket'
import {
  getAggregator,
  baseActions,
  callBasketAPI,
  updateLocalBasket,
} from './remote-basket'
import Router from 'next/router'

export {selectBasketsAPI, selectBasketAPI, clearErrors} from './remote-basket'
export * from './local-basket'

export type CreateBasketAction = PayloadAction<CreatePayload>
export type UpdateBasketAction = PayloadAction<UpdatePayload>
export type RemoveBasketAction = PayloadAction<VendorBase['vendorCode']>

export type AddProductAction = PayloadAction<AddPayload>
export type RemoveProductAction = PayloadAction<RemovePayload>
export type UpdateByAPI = PayloadAction<UpdateByAPIPayload>
export type AddDescription = PayloadAction<AddDescriptionPayload>

export type ClearBasketAPIError = PayloadAction<VendorBase['vendorCode']>

export type BasketsState = {[vendorCode: string]: Basket}
export type BasketsAPI = {
  [key: string]: {
    response?: BasketAPIResponse['data']
    loading: {actions: BasketAction['action'][]; status: boolean}
    error: {
      message: string
      errorCodes: number[]
      isNetworkError: boolean
      actions: BasketAction['action'][]
    }
  }
}

export type BasketsAction =
  | CreateBasketAction
  | RemoveBasketAction
  | AddProductAction
  | UpdateBasketAction
  | UpdateByAPI
  | AddDescription
  | ClearBasketAPIError

const aggregate = getAggregator()

export const basketActions = {
  createBasket: (data: CreatePayload): AppThunk => dispatch => {
    dispatch(createBasket(data))

    // basket api actions
    const apiActions = []

    if (data.clearProducts) {
      apiActions.push(baseActions.clearProducts())
    }

    apiActions.push(baseActions.setVendor(data.vendor.vendorCode))
    apiActions.push(baseActions.setSource(configs.CLIENT!))

    if (data.addressId) apiActions.push(baseActions.setAddress(data.addressId))

    const isDailyDeal =
      data.basketType.includes('food-party') ||
      data.basketType.includes('market-party')
    apiActions.push(baseActions.setType(isDailyDeal ? 'daily_deal' : 'normal'))

    if (data.preOrder) apiActions.push(baseActions.setPreOrder(data.preOrder))
    if (data.paymentType) {
      apiActions.push(baseActions.setPaymentType(data.paymentType))
    }
    if (data.expeditionType) {
      apiActions.push(baseActions.setExpeditionType(data.expeditionType))
    }
    if (typeof data.useCredit !== 'undefined') {
      apiActions.push(baseActions.useCredit(data.useCredit))
    }
    if (data.selectedCoupon) {
      apiActions.push(baseActions.setCoupon(data.selectedCoupon.id))
    }
    dispatch(aggregate(data.vendor.vendorCode, apiActions))
  },
  updateBasket: (data: UpdatePayload): AppThunk => dispatch => {
    dispatch(updateBasket(data))

    // basket api actions
    const apiActions = []

    if (data.clearProducts) {
      apiActions.push(baseActions.clearProducts())
    }

    if (data.addressId) apiActions.push(baseActions.setAddress(data.addressId))

    const isDailyDeal =
      data.basketType?.includes('food-party') ||
      data.basketType?.includes('market-party')
    apiActions.push(baseActions.setType(isDailyDeal ? 'daily_deal' : 'normal'))

    if (data.preOrder) apiActions.push(baseActions.setPreOrder(data.preOrder))
    if (data.paymentType) {
      apiActions.push(baseActions.setPaymentType(data.paymentType))
    }
    if (data.expeditionType) {
      apiActions.push(baseActions.setExpeditionType(data.expeditionType))
    }
    if (typeof data.voucherCode === 'string') {
      apiActions.push(baseActions.setVoucher(data.voucherCode))
    }
    if (data.bank) {
      apiActions.push(baseActions.setBank(data.bank))
    }
    if (typeof data.useCredit !== 'undefined') {
      apiActions.push(baseActions.useCredit(data.useCredit))
    }
    if (typeof data.selectedCoupon !== 'undefined') {
      apiActions.push(baseActions.setCoupon(data.selectedCoupon?.id ?? null))
    }
    dispatch(aggregate(data.vendorCode, apiActions))
  },
  clearBasket: (vendorCode: string): AppThunk => dispatch => {
    // basket api actions
    dispatch(aggregate.deleteBasket(vendorCode))

    dispatch(clearBasket(vendorCode))
  },
  addProduct: (data: AddPayload): AppThunk => (dispatch, getState) => {
    dispatch(addProduct(data))

    // basket api actions
    const baskets = selectBaskets(getState())

    const targetProduct = baskets[data.vendorCode].products?.find(p => {
      return compareProducts(p, data.product)
    })

    const quantity = targetProduct?.count ?? 0

    dispatch(
      aggregate(
        data.vendorCode,
        baseActions.setProducts({...data.product, count: quantity})
      )
    )
  },
  removeProduct: (data: RemovePayload): AppThunk => (dispatch, getState) => {
    dispatch(removeProduct(data))

    // basket api actions
    const baskets = selectBaskets(getState())

    const targetProduct = baskets[data.vendorCode].products?.find(p => {
      return compareProducts(p, data.product)
    })

    const quantity = targetProduct?.count ?? 0

    dispatch(
      aggregate(
        data.vendorCode,
        baseActions.setProducts({...data.product, count: quantity})
      )
    )
  },
}

export const handleProduct = (
  data: Omit<CreatePayload, 'addressId'>,
  product: ProductBase,
  action: HandleAction
): AppThunk => (dispatch, getState) => {
  const {vendorCode} = data.vendor
  const baskets = selectBaskets(getState())
  const basket = baskets[vendorCode]
  const activeAddressId = selectActiveAddressId(getState())
  if (!basket) {
    dispatch(basketActions.createBasket({...data, addressId: activeAddressId}))
  }

  switch (action) {
    case 'add':
      dispatch(basketActions.addProduct({product, count: 1, vendorCode}))
      break

    case 'remove':
      dispatch(basketActions.removeProduct({product, count: 1, vendorCode}))
      break
  }
}

export const recreateBasket = (
  data: CreatePayload,
  products: ProductBase[]
): AppThunk => dispatch => {
  dispatch(
    basketActions.createBasket({
      ...data,
      clearProducts: true,
    })
  )
  products.map(product => {
    dispatch(
      basketActions.addProduct({
        product,
        count: product.count,
        vendorCode: data.vendor.vendorCode,
      })
    )
  })
}

export const initialBasketInServer = (
  vendor: VendorBase,
  basketId: string
): AppThunk<Promise<void>> => async dispatch => {
  dispatch(createBasket({vendor, basketType: ['normal']}))
  return dispatch(
    callBasketAPI({actions: [], vendorCode: vendor.vendorCode, id: basketId})
  ).then(() => {
    dispatch(updateLocalBasket(vendor.vendorCode))
  })
}
