import {Image} from './image'
import {Vendor, VendorStates} from './vendor'
import {ZooketCategory} from '~menu/types'

export type Stock = number | null
export type Stocks = {id: number; stock: number}[]

export interface ProductIdentity {
  id: number
  toppings?: ToppingBase[]
}

export interface ProductBase extends ProductIdentity {
  count: number
  capacity?: number
  sectionCap?: number
  isSpecial?: boolean
  title: string
  price: number
  vat: number
  discountRatio: number
  containerPrice: number
  discount: number
  productDiscountValue?: number
  images?: Image[]
  category?: string
}

export interface ToppingBase {
  id: number
  title?: string
  count?: number
  price?: number
}

export interface SingleTopping {
  id: number
  title: string
  price: number
  discount: number
  containerPrice: number
  description: string
  images: string[]
}
export interface ProductTopping {
  id: number
  title: string
  maxCount: number
  minCount: number
  toppings: SingleTopping[]
  isActive: boolean
}

export interface ProductAttribute {
  title: string
  categoryTitle: string
}
export interface Product extends ProductBase {
  brand: {
    deepLink: string
    description: string | null
    id: number | string
    logo: string | null
    title: string
  }
  capacity: number
  comment_count: number
  data?: any
  categoryTile: string

  productTitle: string | null
  productVariationTitle: string | null
  description: string | null
  images: Image[]

  stock: Stock

  productToppings: ProductTopping[]

  discountRatio: number

  rating: number
  likesCount: number
  disLikesCount: number
  popularityBadgeName: string
  popularityBadgeURL: string
  popularityScore: number

  type: string[]
  productId: number | null
  disabledUntil: boolean
  videoLink: string | null

  createdAt: {date: string; timezone: string}
  vendor: Vendor
}
export interface ProductVariation {
  id: number | string
  products: Product[]
}
export interface MenuCategory {
  category: string
  categoryId: number
  description: string
  image: null
  products: Product[]
  productVariations: ProductVariation[]
}

export class ProductModel {
  constructor(public product: Product) {}
  isStuckOver(count?: number) {
    const {product} = this
    return typeof product.stock === 'number' && product.stock - (count || 0) < 1
  }
  isDisabledUntil() {
    return this.product.disabledUntil
  }
  isCapacityOver(count?: number) {
    const {product} = this
    return product.capacity > -1 && product.capacity - (count || 0) < 1
  }
  isDisableProduct(count?: number, vendorStates?: VendorStates) {
    const isDisabledAddButton =
      this.isDisabledUntil() ||
      this.isStuckOver(count) || // stuck
      this.isCapacityOver(count) || // capacity
      vendorStates === VendorStates.CLOSED ||
      vendorStates === VendorStates.PREORDER ||
      vendorStates === VendorStates.OUTOFSCOPE

    return isDisabledAddButton
  }
  static hasStock(stocks: Stocks, id: number) {
    const result = stocks.find(stock => stock.id === id)
    return result?.stock ?? null
  }
}

export function isProductType(
  arg: Product[] | Product | ZooketCategory[] = []
): arg is Product[] | Product {
  if (Array.isArray(arg)) {
    return arg.length ? 'productId' in (arg[0] as Product) : false
  }

  return 'productId' in (arg as Product)
}
