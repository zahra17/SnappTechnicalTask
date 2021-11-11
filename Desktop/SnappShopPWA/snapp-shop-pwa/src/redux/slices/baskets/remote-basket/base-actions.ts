import {
  BasketAction,
  BasketAPIType,
  ExpeditionType,
  PaymentType,
  PaymentTypeName,
} from '@schema/basket'
import {PreOrder} from '@schema/pre-order'
import {ProductBase} from '@schema/product'
import {Address} from '@schema/address'
import {prepareProductToPost} from '@utils'

export const baseActions = {
  clearProducts(): BasketAction {
    return {action: 'clearProducts', argument: null}
  },
  setProducts(product: ProductBase): BasketAction {
    return {action: 'setProducts', argument: prepareProductToPost(product)}
  },
  setSource(source: string): BasketAction {
    return {action: 'setSource', argument: {source}}
  },
  setVendor(vendorCode: string): BasketAction {
    return {action: 'setVendor', argument: {vendor_code: vendorCode}}
  },
  setExpeditionType(type: ExpeditionType): BasketAction {
    return {action: 'setExpeditionType', argument: {expedition_type: type}}
  },
  useCredit(status: boolean): BasketAction {
    return {action: 'useCredit', argument: status}
  },
  setPaymentType(type: PaymentType): BasketAction {
    return {
      action: 'setPaymentType',
      argument: {payment_type: PaymentType[type] as PaymentTypeName},
    }
  },
  setType(type: BasketAPIType): BasketAction {
    return {action: 'setType', argument: {type}}
  },
  setPreOrder(preOrder: PreOrder): BasketAction {
    return {action: 'setPreOrder', argument: preOrder}
  },
  setAddress(id: Address['id']): BasketAction {
    return {
      action: 'setAddress',
      argument: {address_id: Number(id)},
    }
  },
  setCoupon(id: number | null): BasketAction {
    return {action: 'setCoupon', argument: {coupon_id: id}}
  },
  setBank(code: string): BasketAction {
    return {action: 'setBank', argument: {bank: code}}
  },
  setVoucher(code: string): BasketAction {
    return {action: 'setVoucher', argument: {voucher_code: code}}
  },
}
