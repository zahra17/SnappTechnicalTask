import {VendorBase} from './vendor'
import {PreOrder} from './pre-order'
import {Address} from './address'
import {ProductBase, Stocks} from './product'
import {Coupon} from './coupon'

export type BasketType =
  | 'normal'
  | 'food-party'
  | 'market-party'
  | 'e-commerce'
  | 'beauty'

export type BasketAPIType = 'daily_deal' | 'normal'

export type ExpeditionType = 'PICKUP' | 'ZF_EXPRESS' | 'DELIVERY'

export enum PaymentType {
  'ONLINE' = 1,
  'CREDIT' = 2,
  'CASH' = 3,
  'POS' = 4,
}
export type PaymentTypeName = 'ONLINE' | 'CREDIT' | 'CASH' | 'POS'

export interface PickupAvailability {
  user: boolean
  vendor: boolean
  order: boolean
}

interface SetProductPayload {
  id: number
  count: number
  toppings: {id: number; count: 1}[]
}

export type BasketAction =
  | {action: 'clearProducts'; argument: null}
  | {action: 'setProducts'; argument: SetProductPayload}
  | {action: 'setSource'; argument: {source: string}}
  | {action: 'setVendor'; argument: {vendor_code: string}}
  | {action: 'setExpeditionType'; argument: {expedition_type: ExpeditionType}}
  | {action: 'useCredit'; argument: boolean}
  | {action: 'setPaymentType'; argument: {payment_type: PaymentTypeName}}
  | {action: 'setType'; argument: {type: BasketAPIType}}
  | {action: 'setPreOrder'; argument: PreOrder}
  | {action: 'setAddress'; argument: {address_id: number}}
  | {action: 'setCoupon'; argument: {coupon_id: number | null}}
  | {action: 'setBank'; argument: {bank: string}}
  | {action: 'setVoucher'; argument: {voucher_code: string}}

interface Gateway {
  bankCode: string
  bankTitle: string
  logo: string
  activeLogo: string
  inactiveLogo: string
}

type DiscountType = 'VOUCHER' | 'VIP'

export interface Price {
  type: 'NORMAL' | 'DISCOUNT'
  alias:
    | 'TOTAL_PRICE'
    | 'DELIVERY_PRICE'
    | 'VAT_PRICE'
    | 'TOTAL_DISCOUNT_PRICE'
    | 'USE_CREDIT'
    | 'CONTAINER_PRICE'
  title: string
  value: number
  is_show: boolean
  formatted_value: string
  tag?: 'voucher' | 'delivery'
  discountType?: DiscountType
}

interface Options {
  paymentTypes: PaymentType[]
  gateways: Gateway[]
  showCredit: boolean
  showVoucherField: boolean
  pickupAvailability: PickupAvailability
  coupons: Coupon[]
}

export interface Basket {
  id?: string
  vendor: VendorBase
  prices?: Price[]
  products?: ProductBase[]
  productsMap?: Record<number, number>
  stocks?: Record<number, number>
  selectedCoupon?: Coupon | null
  basketType: BasketType[]
  paymentType?: PaymentType
  expeditionType?: ExpeditionType
  bank?: Gateway['bankCode']
  addressId?: Address['id']
  preOrder?: PreOrder
  total?: number
  usedCredit?: number
  useCredit?: boolean
  discount?: {amount: number; type: DiscountType; voucherCode?: string}
  totalDiscount?: number
  vat?: number
  deliveryFee?: number
  containerPrice?: number
  description?: string
  options?: Options
  verified: boolean
  createdAt: number
  updatedAt: number
}

export interface BasketAPIResponse {
  status: boolean
  data: {
    basket: {
      id: string
      address: Address | null
      products: ProductBase[]
      expedition_type: ExpeditionType
      bank: string
      payment_type: PaymentTypeName
      pre_order: {date: 'today' | 'tomorrow' | null; time: number}
      prices: Price[]
      total?: number
      used_credit: number
      use_credit: boolean
      voucher_code: string
      vendor: {isEcommerce: boolean; superTypeAlias: string}
      selected_coupon: Coupon | null
      coupon_list: Coupon[]
    }
    stocks: {
      available_stocks: Stocks
      out_of_stocks: {
        id: number
        errorCode: number
        quantity: string
        errorMessage: string
      }
    }
    gateways: Gateway[]
    payment_types: PaymentType[]
    pickup_availability: PickupAvailability
    show_credit: boolean
    show_voucher_field: boolean
  }
  error?: {
    errorCodes: number[]
    message: string
  }
}

export enum SpecialPayCode {
  debit = 'AP_DEBIT',
  snapp = 'SNAPP_CREDIT',
}

export interface SpecialBankInfo {
  bankStatus: boolean
  maxAmount: number
  remainingAmount: number
  info: Gateway
}
export interface SpecialPaymentInfo {
  data?: SpecialBankInfo
  error?: {code: number; message: string}
  status: boolean
}

export type CreatePayload = {
  clearProducts?: boolean
  vendor: VendorBase
  basketType: BasketType[]
  preOrder?: PreOrder
  addressId?: Address['id']
  paymentType?: PaymentType
  expeditionType?: ExpeditionType
  useCredit?: boolean
  selectedCoupon?: Coupon | null
}

export type UpdatePayload = Partial<Omit<CreatePayload, 'vendor'>> & {
  vendorCode: string
  voucherCode?: string
  bank?: string
  clearCoupon?: true
}

export type AddPayload = {
  count: number
  vendorCode: VendorBase['vendorCode']
  product: ProductBase
}

export type RemovePayload = AddPayload

export type UpdateByAPIPayload = {
  data: BasketAPIResponse['data']
  vendorCode: string
}

export type AddDescriptionPayload = {
  description: string
  vendorCode: string
}

export type HandleAction = 'add' | 'remove'

export enum BasketPrices {
  total = 'TOTAL_PRICE',
  delivery = 'DELIVERY_PRICE',
  vat = 'VAT_PRICE',
  discount = 'TOTAL_DISCOUNT_PRICE',
}

export enum DiscountTypes {
  voucher = 'VOUCHER',
  vip = 'VIP',
}
