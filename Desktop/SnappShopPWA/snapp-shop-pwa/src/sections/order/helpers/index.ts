import i18n from '@i18n'
import lzString from 'lz-string'
import {ServerResponse} from 'http'

import {CTX} from '@root/types'
import {ProductBase} from '@schema/product'
import orderFa from '@assets/locales/order/fa.json'
import {VendorBase} from '@schema/vendor'

i18n.addResourceBundle('fa', 'order', orderFa)

export const orderSideEffects = (ctx: CTX) => {
  const {store} = ctx
}

export const minimizeProducts = (products?: ProductBase[]) => {
  const data = products?.map(product => ({
    id: product.id,
    count: product.count,
    toppings: product.toppings?.map(topping => topping.id) ?? [],
  }))
  return JSON.stringify(data)
}

export const encodeBasketCode = async (
  basketId: string,
  vendor: VendorBase
) => {
  const payload = JSON.stringify({basketId, vendor})
  return lzString.compressToEncodedURIComponent(payload)
}

export const decodeBasketCode = (
  basketCode: string,
  res?: ServerResponse
): {basketId?: string; vendor?: VendorBase} => {
  try {
    const data = lzString.decompressFromEncodedURIComponent(basketCode)
    const {vendor, basketId} = JSON.parse(data!)
    return {vendor, basketId}
  } catch (error) {
    if (typeof window !== 'undefined') window.location.assign('/')
    else res!.writeHead(301, {Location: '/'}).end()
    return {}
  }
}
