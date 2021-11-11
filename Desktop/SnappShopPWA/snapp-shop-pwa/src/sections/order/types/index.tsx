import {ProductBase} from '@schema/product'
import {VendorBase} from '@schema/vendor'

export type ErrorProp = {
  code: number
  message: string
}

export type OrderError = {
  error: ErrorProp
  status: boolean
}

export type TransactionsError = {
  error: ErrorProp
  status: boolean
}

export type ProductImage = {
  imageId: number
  imageSrc: string
  imageThumbnailSrc: string
}

export type Product = {
  price?: number
  productCode?: string
  productId?: null | number
  productVariationCode?: string
  productVariationId?: number
  product_discount?: number
  quantity?: number
  title?: string
  totalPrice?: number
  images: Array<ProductImage>
  count?: number
}

export type Biker = {
  id: number
  code: string
  cellphone: string
  image: string | null
  name: string
  showBiker: boolean
}

export type ButtonType = {
  title: string
  url: string
  method: string
  type: string
  params: {orderId: number}
}

export interface DeltaSettlement {
  deltaSettlement: {
    unpaidDeltaSettlementWithCashBack: number
    unpaidDeltaSettlement: number
    isDeltaSettlementPaid: boolean
  }
}

export type Price = {
  containerPrice: number
  deliveryFee: number
  couponDeliveryDiscountAmount?: number
  grossDeliveryFee?: number
  vatAmountDiscount: number
  deltaSettlement?: DeltaSettlement
  isDeltaSettlementPaid?: boolean
  unpaidDeltaSettlement?: number
  unpaidDeltaSettlementWithCashBack?: number
  displayContainerPrice?: boolean
  isSpecial?: boolean
  paymentType?: string
  totalPrice: number
  vatAmount: number
  vipDiscount?: number
  voucherAmount?: number
  subTotalDiscount?: number
  sumAllDiscount: number
}
export interface Info {
  biker: Biker
  buttons: {message: string; buttons: ButtonType[] | []} | []
  customerAddress: {
    address: string
    code: string
    id: number
    label: string
    latitude: number
    longitude: number
  }
  expedition: {
    type: string
    isExpress: boolean
  }
  order: {
    currentDate: string
    deliveredAt: string
    description: string
    hasDelay: boolean
    hasReview: boolean
    isDelay: boolean
    jalaliStartedAt: string
    localeTimeStamp: number
    orderCode: string
    orderId: number
    reviewRate: null | number
    startedAt: string
    preOrder: preOrder | undefined
  }
  orderState: string
  prices: Price
  primaryState: number
  products: Array<Product>
  pub_sub_token: string
  secondaryState: number
  vendor: {
    address: string
    latitude: number
    logo: string
    longitude: number
    name: string
    newType: string
    newTypeTitle: string
    type: string
    vendorCode: string
    vendorId: number
  }
}

export type preOrder = {day: string; interval: [string, string]}
export interface PendingOrder {
  addressLabel: string
  bikerImageUrl: string | null
  buttons: Array<unknown>
  code: string
  createdAt: string
  currentDate: string
  deliveredAt: string
  deliveryTime: number
  deltaSettlement: DeltaSettlement
  expeditionType: string
  fo: string
  gifUrl: string
  hasNextStep: boolean
  isDelay: boolean
  isDelivered: boolean
  newType: string
  newTypeTitle: string
  orderId: number
  orderStatus: number
  preOrder: preOrder | undefined
  primaryState: number
  reviewNo: string
  reviewYes: string
  secondaryState: number
  startedAt: string
  status: string
  statusCode: string
  userAddress: string
  vendor: string
  vendorAddress: string
  vendorCode: string
  vendorLogo: string
  vendorType: string
  waitTime: number
  superTypeAlias: string
}

export interface PendingOrderResponse {
  data: {orders: PendingOrder[]; pub_sub_token: string}
}

export interface Reorders extends VendorBase {
  childType: VendorBase['childType']
  containerPrice: number
  containerPriceDiscount: number
  couponDeliveryDiscountAmount: number
  couponDiscountAmount: number | null
  date: string
  deliveryFee: number
  deliveryFeeDiscount: number
  displayContainerPrice: boolean
  grossDeliveryFee: number
  inPlaceDelivery: boolean
  isSpecial: boolean
  isVendorEcommerce: boolean
  orderAddress: {id: string; address: string; label: string}
  orderCode: string
  products: Array<ProductBase>
  rate: string | number | null
  reviewLink: string
  reviewText: string
  reviewed: boolean
  showReview: boolean
  subTotalDiscount: number
  sumAllDiscount: number
  superTypeAlias: string
  time: string
  totalPrice: number
  vatAmount: number
  vatAmountDiscount: number
  vendorAddress: string
  vendorCode: string
  vendorId: number
  vendorLatitude: number
  vendorLogo: string
  vendorLongitude: number
  vendorPaymentTypes: Array<unknown>
  vendorTitle: string
  voucherDiscount: string
}
export interface ReordersResponse {
  data: {orders: Reorders[]; count: number; pageSize: number}
}
export type OrderStatusResponse = Info | OrderError

export type OrderStatusState = {
  info?: Info
  error?: OrderError
  status: boolean
}

export function isOrderErrorResponse(
  response: OrderStatusResponse
): response is OrderError {
  return 'error' in response
}

type orderAddress = {
  address: string
  id: number
  label: string
}

export interface previousOrder extends VendorBase {
  containerPrice: number
  containerPriceDiscount: number
  couponDiscountAmount: number
  date: string
  deliveryFee: number
  deliveryFeeDiscount: number
  inPlaceDelivery: boolean
  isSpecial: boolean
  isٰVendorEcommerce: boolean
  orderAddress: orderAddress
  orderCode: string
  products: Array<ProductBase>
  subTotalDiscount: number
  sumAllDiscount: number
  time: string
  superTypeAlias: string
  totalPrice: number
  vatAmount: number
  vatAmountDiscount: number
  vendorCode: string
  vendorId: number
  vendorLogo: string
  vendorTitle: string
  voucherDiscount: string | number
}
export type transactionStatus = 'COMPLETED' | 'PENDING' | 'REJECTED'
export interface payment {
  amount: number
  isDeltaSettlement: string
  payForId: number
  payForType: string
  ipgType: string
  status: transactionStatus
  title: string
  transactionCode: string
  type: string
  updatedAt: {date: string; timezone_type: number; timezone: string}
  transactionReason?: string
}

export interface listData {
  count: number
  orders: Array<previousOrder>
  pageSize: number
}

export interface transactionsListData {
  count: number
  payments: Array<payment>
  page: number
}

export interface listResponse {
  status: boolean
  data: listData
}

export interface transactionsListResponse {
  status: boolean
  data: transactionsListData
}

export type ordersListReponse = listResponse | OrderError

export function isPrevOrderErrorResponse(
  response: ordersListReponse
): response is OrderError {
  return 'error' in response
}
export enum FetchStates {
  NO_TRANSACTION = 0,
  LOADING = 1,
  DONE = 2,
}
