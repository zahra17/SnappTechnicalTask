import {Vendor} from '@schema/vendor'
import {Product, ProductAttribute} from '@schema/product'

export enum ZooketSectionType {
  Products = 8,
  Categories = 10,
}

export interface ZooketCategory {
  id: number
  image: string | null
  lft: number
  rgt: number
  title: string
  sub?: ZooketCategory[]
}
export interface ProductsSection {
  backgroundColor: string
  color: string
  deepLink: string
  items: Product[]
  link: string
  title: string
  total: number
}
export interface ZooketCategoriesSection {
  items: ZooketCategory[]
  title: string
}
export type ZooketSection =
  | {
      data: ProductsSection
      id: number
      type: ZooketSectionType.Products
    }
  | {
      data: ZooketCategoriesSection
      id: number
      type: ZooketSectionType.Categories
    }

export interface ZooketDetailResponse {
  status: boolean
  data: {
    sections: Array<ZooketSection>
    vendor: Vendor
  }
}

export interface ZooketPagination {
  page: number
  size: number
  total: number
}
export interface ZooketProductsResponse {
  status: boolean
  data: {
    categories: ZooketCategory[]
    product_variations: Product[]
    meta: {
      pagination: ZooketPagination
    }
  }
}

export type ZooketProductDetailType = 'ZOOKET_PRODUCT_VARIATION'

export interface ZooketBrand {
  deeplink: string
  description: string | null
  id: number
  logo: string | null
  title: string
}

export interface ZooketProductDetailsCategories {
  deeplink: string
  id: number
  title: string
}

export interface ZooketProductDetailsList {
  title: string
  products: Product[]
}

export interface ProductChildren {
  active: boolean
  discount: number
  discountRatio: number
  id: string | number
  images: string[]
  price: number
  propertyIcon: string
  title: string
  propertyTitle: string
}
export interface ZooketProductDetailsData {
  attributes: ProductAttribute[]
  brand: ZooketBrand
  children: {
    childProducts: ProductChildren[]
    propertyCategory: {
      id: number | string
      title: string
      type: string
    }
  }
  categories: ZooketProductDetailsCategories[]
  details: Product
  lists: ZooketProductDetailsList[]
}

export interface ZooketProductDetailsResponse {
  status: boolean
  code: number
  data: ZooketProductDetailsData
}

export function isProductDetailsType(
  arg: string | undefined | ZooketProductDetailsData = ''
): arg is ZooketProductDetailsData {
  return 'details' in (arg as ZooketProductDetailsData)
}
