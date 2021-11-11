import {Vendor} from './vendor'

export const schemaType = {
  Organization: 'Organization',
  PostalAddress: 'PostalAddress',
  ContactPoint: 'ContactPoint',
  GeoCoordinates: 'GeoCoordinates',
  AggregateRating: 'AggregateRating',
}
export enum PageTypes {
  HOME_PAGE,
  VENDOR_LIST,
  VENDOR_DETAIL,
  PRODUCTS,
  SEARCH,
}
export enum vendorTypes {
  CAFE,
  RESTAURANT,
  CONFECTIONERY,
  BAKERY,
}
export const vendorSchemaText = {
  CafeOrCoffeeShop: 'CafeOrCoffeeShop',
  Bakery: 'Bakery',
  Restaurant: 'Restaurant',
  Confectionery: 'Confectionery',
}
export type SEOSchema = {
  title: string | null
  url: string
  image: string
  description?: string | null
  page: PageTypes
  vendorType?: vendorTypes
  chainName?: string | null
  address?: {
    lat: string
    long: string
    addressDetail: string
  }
  rating?: number
  commentCount?: number
  vendorItems?: string | null
  noIndex?: boolean
  canonical?: string | null
}

export type VendorSEOSchema = {
  vendorType?: vendorTypes
  logo: string | null
  title: string | null
  address?: {
    lat: string
    long: string
    addressDetail: string
  }
  rating?: number
  commentCount?: number
}
