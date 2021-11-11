import {Product} from '@schema/product'
import {Vendor} from '@schema/vendor'

export type SearchVendorsResponse = {
  status: boolean
  data: {
    result: Vendor[]
    term: string
    total: number
  }
}

export interface SearchProductsResponse {
  status: boolean
  data: {
    result: Product[]
    term?: string | undefined
    title?: string | undefined
    total?: number | undefined
    count?: number | undefined
  }
}
// Search Page Types

export enum SECTION_TYPE {
  VENDORS,
  PRODUCTS,
}

type ProductsSecton = {
  items: Product[]
  type: SECTION_TYPE.PRODUCTS
}

type VendorsSection = {
  items: Vendor[]
  type: SECTION_TYPE.VENDORS
}

export type SearchSection = (ProductsSecton | VendorsSection) & {
  order: number
  total: number
}

export interface SearchResponse {
  status: boolean
  data: {
    product_variation: SearchSection
    vendor: SearchSection
  }
}
