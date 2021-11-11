import {User} from './user'
import {ExpeditionType, PaymentTypeName, SpecialPayCode} from './basket'

export interface NewOrderPayload {
  vendorId: number
  bankCode: string | undefined
  voucherCode: string | undefined
  paymentType: PaymentTypeName
  addressId: number
  products: string
  paidByCredit: 1 | 0
  expeditionType: ExpeditionType
  preorderDate: string | undefined
  isSpecial: 1 | 0
  couponId: number | undefined
  customerComment: string | undefined
  reserverIdentity: string
  platform: string
}

export interface NewOrderResponse {
  data?: {
    isUserVerified: boolean
    url?: string
    code?: string
    totalCost?: number
  }
  error?: {code: number; message: string}
  status: boolean
}

export interface SpecialPaymentResponse {
  data: {
    user: User
    order: {
      code: string
      containerPrice: number
      deliveryFee: number
      isOnlineOrder: boolean
      subTotal: number
      tax: number
      totalCost: number
      date: {date: string; timezone: string}
    }
    payment: {
      bank: SpecialPayCode
      code: string
      receipt: string
      status: boolean
      type: PaymentTypeName
    }
    vendor: {code: string; title: string}
  } | null
  error?: {code: number; message: string}
  status: boolean
}
