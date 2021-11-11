import pick from 'lodash/pick'
import {createSelector, createSlice} from '@reduxjs/toolkit'

import {StoreShape} from '@redux'
import {compareProducts} from '@utils'
import {
  AddDescription,
  AddProductAction,
  BasketsState,
  CreateBasketAction,
  RemoveBasketAction,
  RemoveProductAction,
  UpdateBasketAction,
  UpdateByAPI,
} from '..'
import {vendorBaseKeys} from '@schema/vendor'
import {PaymentType, Price} from '@schema/basket'

const initialState: BasketsState = {}

const basketsSlice = createSlice({
  name: 'baskets',
  initialState,
  reducers: {
    createBasket(state, {payload}: CreateBasketAction) {
      const now = new Date()
      const {vendor, clearProducts, ...rest} = payload
      const {vendorCode} = vendor

      state[vendorCode] = {
        ...rest,
        vendor: pick(vendor, vendorBaseKeys),
        verified: false,
        createdAt: now.getTime(),
        updatedAt: now.getTime(),
      }
    },
    updateBasket(state, {payload}: UpdateBasketAction) {
      const now = new Date()
      const {vendorCode, voucherCode, clearProducts, ...rest} = payload

      state[vendorCode] = {
        ...state[vendorCode],
        ...rest,
        verified: false,
        updatedAt: now.getTime(),
      }
    },
    clearBasket(state, {payload: vendorCode}: RemoveBasketAction) {
      if (!state[vendorCode]) return
      delete state[vendorCode]
    },
    addProduct(state, {payload}: AddProductAction) {
      const {vendorCode, count, product} = payload

      if (!state[vendorCode]) return

      const productIndex =
        state[vendorCode].products?.findIndex(p => {
          return compareProducts(p, product)
        }) ?? -1

      if (productIndex > -1) {
        state[vendorCode].products![productIndex]!.count += count
      } else {
        if (!state[vendorCode].products) state[vendorCode].products = []
        state[vendorCode].products!.push({...product, count})
      }

      // update stock
      if (state[vendorCode].stocks && product.id in state[vendorCode].stocks!) {
        state[vendorCode].stocks![product.id] -= count
      }

      // set product map
      if (!state[vendorCode].productsMap) {
        state[vendorCode].productsMap = {[product.id]: count}
      } else if (!state[vendorCode].productsMap![product.id]) {
        state[vendorCode].productsMap![product.id] = count
      } else state[vendorCode].productsMap![product.id] += count

      state[vendorCode].verified = false
    },
    removeProduct(state, {payload}: RemoveProductAction) {
      const {vendorCode, count, product} = payload

      if (!state[vendorCode]) return

      const productIndex =
        state[vendorCode].products?.findIndex(p => {
          return compareProducts(p, product)
        }) ?? -1

      if (productIndex < 0) return

      const {count: oldCount} = state[vendorCode].products![productIndex]

      if (oldCount > count) {
        state[vendorCode].products![productIndex].count -= count
      } else {
        state[vendorCode].products!.splice(productIndex, 1)
      }

      state[vendorCode].productsMap![product.id] -= count
      if (state[vendorCode].productsMap![product.id] < 1) {
        delete state[vendorCode].productsMap![product.id]
      }

      if (!state[vendorCode].products!.length) {
        delete state[vendorCode].products
        delete state[vendorCode].productsMap
      }

      // update stock
      if (state[vendorCode].stocks && product.id in state[vendorCode].stocks!) {
        if (oldCount > count) state[vendorCode].stocks![product.id] += count
        else state[vendorCode].stocks![product.id] += oldCount
      }

      state[vendorCode].verified = false
    },
    updateBasketByAPI(state, {payload}: UpdateByAPI) {
      const {data, vendorCode} = payload

      state[vendorCode].id = data.basket.id
      state[vendorCode].addressId = data.basket.address?.id
      state[vendorCode].expeditionType = data.basket.expedition_type
      state[vendorCode].bank = data.basket.bank
      state[vendorCode].paymentType = PaymentType[data.basket.payment_type]

      // set pre-order
      const {pre_order} = data.basket
      if (pre_order.date !== null && pre_order.time !== -1) {
        state[vendorCode].preOrder = {
          date: pre_order.date,
          time: pre_order.time,
        }
      }

      const prices = data.basket.prices.filter(price => price.is_show)

      state[vendorCode].prices = prices
      state[vendorCode].total = data.basket.total
      state[vendorCode].usedCredit = data.basket.used_credit
      state[vendorCode].useCredit = data.basket.use_credit

      // set products
      const productsOrder = state[vendorCode].products?.map(p => p.id)
      const products = [...data.basket.products]
      // restore original orders
      if (productsOrder) {
        products.sort((a, b) => {
          let aIndex = productsOrder.findIndex(id => id === a.id)
          if (aIndex < 0) aIndex = Infinity
          let bIndex = productsOrder.findIndex(id => id === b.id)
          if (bIndex < 0) bIndex = Infinity
          return aIndex - bIndex
        })
      }
      state[vendorCode].products = products

      // set products map
      const productsMap: Record<number, number> = {}
      data.basket.products.forEach(product => {
        if (product.id in productsMap) productsMap[product.id] += product.count
        else productsMap[product.id] = product.count
      })
      state[vendorCode].productsMap = productsMap

      // set stocks
      const stocks: Record<number, number> = {}
      data.stocks.available_stocks.forEach(stockLimit => {
        stocks[stockLimit.id] = stockLimit.stock
      })
      state[vendorCode].stocks = stocks
      // set total discount, discount,
      // delivery fee, container price and vat
      let containerPrice: Price | undefined
      let totalDiscount: Price | undefined
      let discount: Price | undefined
      let delivery: Price | undefined
      let vat: Price | undefined

      prices.forEach(price => {
        if (price.tag === 'voucher') discount = price
        if (price.alias === 'VAT_PRICE') vat = price
        if (price.alias === 'DELIVERY_PRICE') delivery = price
        if (price.alias === 'CONTAINER_PRICE') containerPrice = price
        if (price.alias === 'TOTAL_DISCOUNT_PRICE') totalDiscount = price
      })

      // set discount
      if (discount) {
        state[vendorCode].discount = {
          amount: discount.value,
          type: discount.discountType!,
          voucherCode: data.basket.voucher_code,
        }
      } else state[vendorCode].discount = undefined

      // set delivery fee
      if (delivery) state[vendorCode].deliveryFee = delivery.value

      // set vat amount
      if (vat) state[vendorCode].vat = vat.value

      // set total discount
      if (totalDiscount) state[vendorCode].totalDiscount = totalDiscount.value

      // set container price
      if (containerPrice) {
        state[vendorCode].containerPrice = containerPrice.value
      }

      // set active coupon
      state[vendorCode].selectedCoupon = data.basket.selected_coupon

      // update options
      state[vendorCode].options = {
        gateways: data.gateways,
        paymentTypes: data.payment_types,
        pickupAvailability: data.pickup_availability,
        showCredit: data.show_credit,
        showVoucherField: data.show_voucher_field,
        coupons: data.basket.coupon_list,
      }
      state[vendorCode].verified = true
    },
    addDescription(state, {payload}: AddDescription) {
      const {vendorCode, description} = payload
      if (state[vendorCode]) state[vendorCode].description = description
    },
  },
})

export const {
  createBasket,
  updateBasket,
  clearBasket,
  addProduct,
  removeProduct,
  updateBasketByAPI,
  addDescription,
} = basketsSlice.actions

export const selectBaskets = (state: StoreShape) => state[basketsSlice.name]
export const selectBasket = (vendorCode?: string) => (state: StoreShape) => {
  return vendorCode ? selectBaskets(state)[vendorCode] : undefined
}
export const selectProductCount = (productId?: number, vendorCode?: string) =>
  createSelector(selectBasket(vendorCode), basket => {
    if (!productId) return undefined
    return basket?.productsMap?.[productId]
  })
export const selectProductToppings = (
  productId?: number,
  vendorCode?: string
) =>
  createSelector(selectBasket(vendorCode), basket => {
    if (!productId) return []
    return (
      basket?.products?.find(product => {
        return product.id === productId
      })?.toppings ?? []
    )
  })

export default basketsSlice
