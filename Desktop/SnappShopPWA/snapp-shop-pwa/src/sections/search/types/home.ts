import {FC} from 'react'
import {Vendor} from '@schema/vendor'
import {Product} from '@schema/product'
import {Banner} from '@schema/banner'

export enum HOME_SECTION_TYPE {
  SHOP_DELIVERY = 0,
  VENDORS = 1,
  BANNER = 2,
  CUISINES = 4,
  FOODPARTY = 5,
  SLIDER = 6,
  PRODUCTS = 7,
  SPECIAL_PRODUCTS = 8,
  CITIES = 10,
}

export interface HomeSectionData {
  deepLink: string
  front_id: string
  icon: string
  id: number
  link: string | null
  modern_render: boolean
  page_size: number
  show_more: boolean
  title: string
  visible: boolean
}
export interface VendorCollectionType extends HomeSectionData {
  type: HOME_SECTION_TYPE.VENDORS
  data?: {
    restaurants: Vendor[]
  }
}

export interface ProductCollectionType extends HomeSectionData {
  type: HOME_SECTION_TYPE.SPECIAL_PRODUCTS
  data?: {
    products: Product[]
  }
}

export interface BannerBaseType extends HomeSectionData {
  auto_play: boolean
  random_sort: boolean
  type: number
  url: string
}

export interface BannerType extends BannerBaseType {
  type: HOME_SECTION_TYPE.BANNER
  data: {
    banner: Banner
  }
}

export interface BannerSliderType extends BannerBaseType {
  type: HOME_SECTION_TYPE.SLIDER
  data: {
    banner: Banner[]
  }
}

export interface Cuisine {
  backgroundImage: string
  backgroundImageCustom: string
  deepLink: string
  icon: string
  icon_custom: string
  id: number
  ranking: number
  title: string
}

export interface SHOP_SERVICE_OPTIONS {
  id: number
  title: string
  description: string
  Icon: FC
}

export interface SHOP_DELIVERY {
  type: HOME_SECTION_TYPE.SHOP_DELIVERY
  front_id: string
  id: number
  data: SHOP_SERVICE_OPTIONS[]
}

export interface Cuisines extends HomeSectionData {
  type: HOME_SECTION_TYPE.CUISINES
  data?: {
    cuisines: Array<Cuisine>
  }
}

export interface City {
  english_title: string
  id: number
  title: string
}
export interface Cities extends HomeSectionData {
  type: HOME_SECTION_TYPE.CITIES
  data: {
    cities: City[]
    deepLink: string
  }
}
export type HomeSection =
  | VendorCollectionType
  | Cuisines
  | Cities
  | ProductCollectionType
  | BannerType
  | BannerSliderType
  | SHOP_DELIVERY

export interface HomeResponse {
  status: boolean
  data: {
    result: Array<HomeSection>
    error?: string
  }
}

export interface CitiesResponse {
  status: boolean
  data: Cities['data'] & {error?: string}
}
