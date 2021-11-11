import {AnyAction} from '@reduxjs/toolkit'
import {Vendor} from '@schema/vendor'
import {MenuCategory, Stocks} from '@schema/product'
import {Coupon} from '@schema/coupon'
export * from './zooket'
export interface Comment {
  commentId: number
  commentText: string
  createdDate: string
  customerId: string
  date: string
  expeditionType: string
  feeling: string
  foods?: {title: string}[]
  rate: number
  replies: ReplyComment[]
  sender: string
  status: number
}

export type SortType = 'new' | 'score'

export interface ReplyComment {
  commentText: string
  source: 'VENDOR' | 'ZOODFOOD' | 'USER' | 'EXPRESS'
  timestamp: string
}
export interface CommentsSort {
  key: string
  method: string
  params: {key: SortType; title: string}[]
}
export interface VendorStaticResponse {
  status: boolean
  data?: {
    menus: MenuCategory[]
    stocks: Stocks
    vendor: Vendor
  }
  error?: {code: number; message: string}
}

export function isVendorStaticErrorResponse(
  result:
    | VendorStaticResponse['data']
    | VendorStaticResponse['error']
    | undefined
): result is VendorStaticResponse['error'] {
  return (result as VendorStaticResponse['error'])?.code !== undefined
}

export interface CommentsType {
  comments: Comment[]
  count: number
  pageSize: number
  sort: CommentsSort
}

export function isCommentsType(
  arg: string | undefined | CommentsType = ''
): arg is CommentsType {
  return 'comments' in (arg as CommentsType)
}

export interface VendorCommentsResponse {
  status: boolean
  data: CommentsType
}

export interface CouponResponse {
  status: boolean
  data?: {
    coupons: Coupon[]
  }
}

export function isCouponResponseType(
  arg: string | undefined | Coupon[] | CouponResponse['data'] = []
): arg is CouponResponse['data'] {
  return 'coupons' in ((arg as CouponResponse['data']) || {})
}

export type PromiseAnyAction = Promise<AnyAction> & {
  abort: (reason?: string) => void
}
