import {ColorNames, ColorWeight, toPersian} from '@sf/design-system'
import i18n from '@i18n'
import {NextRouter} from 'next/router'
import {isProductType, MenuCategory, Product, ProductVariation} from './product'
import {ZooketSection} from '~menu/types'
import {
  DISCOUNTS_CATEGORY_ID,
  POPULAR_CATEGORY_ID,
  PREVIOUS_PURCHASES_ID,
} from '~menu/constants'
import {ParsedUrlQuery} from 'querystring'
export interface VendorBase {
  id: number
  vendorCode: string
  code: string
  vendorType: string
  vendorTypeTitle: string
  title: string
  logo: string
  address: string
  deliveryFee: number
  delivery_fee: number
  isOpen: boolean
  is_open: boolean
  status: number
  deliver: boolean
  preOrderEnabled: boolean
  is_preorder_enabled: boolean
  isZFExpress: boolean
  is_express: boolean
  newTypeTitle: string
  childType: keyof typeof VENDOR_TYPES
  superTypeAlias?: string | null
  is_ecommerce?: boolean
  vendorState: number
  preorderToday: Preorder
  preorderTomorrow: Preorder
  vendorStateText: string
}
export interface Schedule {
  allDay: boolean
  startHour: string
  stopHour: string
  weekday: number
}

interface GetVendorBadgeStyle {
  badgeColor: ColorNames
  badgeWeight: ColorWeight
  badgeBackground: ColorNames
}
export interface SortedSchedules {
  weekday: number
  schedules: Schedule[]
}
export enum VendorStates {
  OPEN,
  CLOSED,
  PREORDER,
  OUTOFSCOPE,
  UNKNOWN,
  RESTRICTIONS_ON_SERVICE,
}
export interface Preorder {
  intervals?: Array<{label: string; value: string}>
  name: string
  weekday: string
}
export interface Vendor extends VendorBase {
  area: string
  backgroundImage: string
  backgroundImageCustom: string
  badges: Array<{title: string}>
  bid: boolean
  budgetClass: string
  city: string
  commentCount: number
  containerFee: number
  costsForTwo: number
  countOfUserImages: string
  countReview: number
  coupon_count: number
  coverPath: string
  cuisinesArray: Array<{id: number; title: string}>
  defLogo: string
  delay: string
  deliveryArea: string
  deliveryFeeDiscount: number
  deliveryGuarantee: boolean
  deliveryTime: number
  description: string
  discount: number
  discountForAll: boolean
  discountStartHour1: string
  discountStartHour2: string
  discountStopHour1: string
  discountStopHour2: string
  discountType: string
  discountValue: number
  discountValueForView: number
  establishment: string
  eta: number
  foodTypes: Array<unknown>
  has_coupon: boolean
  isFavorite: boolean
  is_pickup: boolean
  lat: number
  lon: number
  maxDeliveryFee: number
  max_eta: number
  menuImage: Array<unknown>
  menuUrl: string
  minDeliveryFee: number
  minOrder: number
  min_eta: number
  mostPopularItems: string
  noOrder: boolean
  onlineOrder: boolean
  paymentTypes: number[]
  phone: string
  priority: number
  rate: number
  rating: number
  recommendedFor: string
  restaurantClass: string
  restaurantTypes: unknown[]
  trendingScore: number
  voteCount: number
  schedules: Schedule[]
  tagNames: string[]
  state: number
  vendorStateText: string
  reviewStars: {
    five: number
    four: number
    one: number
    three: number
    two: number
    [k: string]: number
  }
  textCommentCount: number
  featured: string
  has_packaging: boolean
  sortedSchedules: SortedSchedules[]
}

export interface HasKeys {
  [key: string]: boolean
}

export function sanitizeTitle(title: string) {
  if (!title) return ''

  return title?.trim().replace(/[% -/]/g, '_')
}

export function getVendorType(vendor: VendorBase) {
  const {childType = VENDOR_TYPES.RESTAURANT, is_ecommerce} = vendor

  if (is_ecommerce) return 's'
  switch (childType) {
    case VENDOR_TYPES.SUPERMARKET:
    case VENDOR_TYPES.SUPERMARKET_TEST:
      return 'z'
    case VENDOR_TYPES.BOOK:
    case VENDOR_TYPES.DIGITAL:
    case VENDOR_TYPES.COSMETIC:
      return 's'
    case VENDOR_TYPES.RESTAURANT:
    default:
      return 'r'
  }
}

// Detect if query is new URL format
// vendorName-VendorType-VendorCode
const regexNewURLFormat = new RegExp('-[srz]-')

export function getVendorCodeFromQuery(queryInfo: ParsedUrlQuery) {
  let vendorCode = queryInfo.vendorInfo as string,
    isOldUrl: boolean = true

  if (regexNewURLFormat.test(vendorCode)) {
    /* router.query = queryInfo => URL contains
     * vendorName-VendorType-VendorCode
     * See getLink function in this file
     * We have to get vendorCode from queryInfo
     */
    const [, , vendorCodeInfo] = vendorCode?.split('-')
    vendorCode = vendorCodeInfo
    isOldUrl = false
  }

  return {
    vendorCode,
    isOldUrl,
  }
}

export class VendorBaseModel {
  constructor(public vendor: VendorBase) {}

  get vendorCode() {
    return this.vendor.vendorCode || this.vendor.code
  }

  getVendorDeliveryFee() {
    return this.vendor.delivery_fee ?? this.vendor.deliveryFee
  }
  isOpen() {
    if (this.vendor.status === -1) {
      return this.vendor.isOpen || this.vendor.is_open
    }
    return this.vendor.status !== 2
  }
  isInRange() {
    const {vendor} = this
    const state = new VendorModel(vendor as Vendor).getVendorState()
    return this.vendor.deliver ?? state !== VendorStates.OUTOFSCOPE
  }
  isPreorderEnabled() {
    return this.vendor.preOrderEnabled || this.vendor.is_preorder_enabled!
  }
  isExpress() {
    return this.vendor.isZFExpress || this.vendor.is_express
  }
  getVendorLink(isForCanonical = false) {
    const {superTypeAlias, vendorCode, title, code} = this.vendor

    const pathname = `${
      isForCanonical ? '' : '/'
    }${superTypeAlias?.toLocaleLowerCase()}/menu/${sanitizeTitle(
      title
    )}-${getVendorType(this.vendor)}-${vendorCode ?? code}`

    return pathname
  }
  getLink(product?: Product) {
    if (!this.vendorCode) {
      return '/404'
    }
    const {childType = VENDOR_TYPES.RESTAURANT} = this.vendor

    const productId = product?.id
    return {
      pathname: this.getVendorLink(),
      search: `${
        childType === VENDOR_TYPES.SUPERMARKET_TEST
          ? `vendorType=shop${productId ? `&productId=${productId}` : ''}`
          : `${productId ? `&productId=${productId}` : ''}`
      }`,
    }
  }
  static shopSearchLink(router: NextRouter, term = '') {
    const query = router.query.vendorInfo ?? router.query.vendorCode
    let path = ''

    if (regexNewURLFormat.test(query as string)) {
      const [title, type, vendorCode] = (query as string)?.split('-')
      path = `/${router.query.service}/menu/${title}-${type}-${vendorCode}?vendorType=${router.query.vendorType}&query=${term}`
    } else {
      // Supports old url format for searching
      path = `/${router.query.service}/menu/${query}?vendorType=${router.query.vendorType}&query=${term}`
    }

    return path
  }
}

export class VendorModel extends VendorBaseModel {
  static VendorStates = VendorStates

  constructor(public vendor: Vendor) {
    super(vendor)
  }
  findSchedules() {
    const {vendor} = this
    if (vendor?.schedules) {
      const now = new Date()
      const hour = now.getHours()
      let today = now.getDay() + 2
      today = today > 7 ? today % 7 : today
      const tomorrow = today === 7 ? 1 : today + 1

      let schedule: Schedule | undefined

      const schedules = vendor.schedules.filter(sch => sch.weekday === today)
      const schedulesTomorrow = vendor.schedules.filter(
        sch => sch.weekday === tomorrow
      )

      if (schedules.length === 0 && schedulesTomorrow.length === 0) {
        return `${vendor && vendor.newTypeTitle}${i18n.t(
          'menu:vendorInfo.today-is-holiday'
        )}`
      }

      if (schedules && schedules.length > 1) {
        schedule = schedules
          .sort((a, b) => (a.startHour > b.startHour ? 1 : -1))
          .find(sch => {
            return Number(sch.startHour.slice(0, 2)) >= hour
          })

        if (!schedule && schedulesTomorrow.length > 0) {
          schedule = schedulesTomorrow[0]
        }
      } else {
        schedule = schedules[0]
      }

      if (!schedule) {
        return `${i18n.t('menu:vendorInfo.open-hour')}${
          vendor && vendor.newTypeTitle
        }${i18n.t('menu:vendorInfo.today-is-holiday')}`
      }

      return `${i18n.t('menu:vendorInfo.open-hour')} ${toPersian(
        Number(schedule.startHour.slice(0, 2)) === 0
          ? `24:${schedule.startHour.slice(3, 5)}`
          : schedule.startHour
      )}`
    }
    return null
  }
  getTodaySchedule() {
    const {vendor, findCurrentDateSchedule} = this
    const now = new Date()
    const hour = now.getHours()
    let today = now.getDay() + 2
    today = today > 7 ? today % 7 : today
    const tomorrow = today === 7 ? 1 : today + 1

    let schedule: Schedule | undefined = undefined
    let startHour
    let stopHour

    const schedules = vendor.schedules.filter(sch => sch.weekday === today)
    const schedulesTomorrow = vendor.schedules.filter(
      sch => sch.weekday === tomorrow
    )

    if (schedules.length === 0 && schedulesTomorrow.length === 0) {
      return `${vendor && vendor.newTypeTitle}${i18n.t(
        'menu:vendorInfo.today-is-holiday'
      )}`
    }

    if (schedules && schedules.length > 1) {
      schedule = findCurrentDateSchedule(schedules, hour)

      if (!schedule && schedulesTomorrow.length > 0) {
        schedule = schedulesTomorrow[0]
      }
    } else {
      schedule = schedules[0]
    }

    if (!schedule) {
      return `${vendor && vendor.newTypeTitle}${i18n.t(
        'menu:vendorInfo.today-is-holiday'
      )}`
    }

    if (schedule && schedule.startHour) {
      const start = Number(schedule.startHour.slice(0, 2))
      const end = Number(schedule.stopHour.slice(0, 2))

      if (start === 0) {
        startHour = `24:${schedule.startHour.slice(3, 5)}`
      }

      if (end === 0) {
        stopHour = `24:${schedule.stopHour.slice(3, 5)}`
      }
    } else {
      return `${vendor && vendor.newTypeTitle}${i18n.t(
        'menu:vendorInfo.today-is-holiday'
      )}`
    }

    return toPersian(
      `${i18n.t('menu:vendorInfo.today-from-hour')} ${
        startHour || schedule.startHour
      } ${i18n.t('menu:vendorInfo.from')} ${stopHour || schedule.stopHour}`
    )
  }
  getVendorState() {
    const {vendor} = this
    switch (vendor?.vendorState) {
      case 1:
        return VendorStates.OPEN
      case 2: {
        if (this.hasPreOrder()) {
          return VendorStates.PREORDER
        } else {
          return VendorStates.CLOSED
        }
      }
      case -1:
        return VendorStates.RESTRICTIONS_ON_SERVICE
      case 3:
      case 5:
        return VendorStates.CLOSED
      case 4:
        return VendorStates.OUTOFSCOPE
      default:
        return VendorStates.UNKNOWN
    }
  }
  hasPreOrder() {
    const {vendor} = this
    return Boolean(
      vendor.preorderToday?.intervals?.length &&
        vendor.preorderTomorrow?.intervals?.length
    )
  }

  hasVendorStateBadge() {
    //when vendor is close or restriction on service
    const {vendor} = this
    const state = new VendorModel(vendor as Vendor).getVendorState()

    switch (state) {
      case VendorStates.RESTRICTIONS_ON_SERVICE:
      case VendorStates.PREORDER:
      case VendorStates.CLOSED:
        return true
      default:
        return false
    }
  }

  getVendorBadgeStyle(): GetVendorBadgeStyle {
    const {vendor} = this
    const openingTime = this.findSchedules()
    const state = new VendorModel(vendor as Vendor).getVendorState()

    let badgeStyle: GetVendorBadgeStyle = {
      badgeColor: 'carbon',
      badgeWeight: 'main',
      badgeBackground: 'carbon',
    }

    switch (state) {
      case VendorStates.RESTRICTIONS_ON_SERVICE:
        badgeStyle = {
          badgeColor: 'attention',
          badgeWeight: 'dark',
          badgeBackground: 'attention',
        }
        return badgeStyle
      case VendorStates.PREORDER:
        badgeStyle = {
          badgeColor: 'carbon',
          badgeWeight: 'main',
          badgeBackground: 'carbon',
        }
        return badgeStyle
      case VendorStates.CLOSED:
        if (openingTime) {
          badgeStyle = {
            badgeColor: 'carbon',
            badgeWeight: 'main',
            badgeBackground: 'carbon',
          }
        } else {
          badgeStyle = {
            badgeColor: 'alert',
            badgeWeight: 'main',
            badgeBackground: 'alert',
          }
        }
        return badgeStyle
      default:
        return badgeStyle
    }
  }

  getVendorBadgeMessage() {
    const {vendor} = this
    const openingTime = this.findSchedules()
    const state = new VendorModel(vendor as Vendor).getVendorState()

    switch (state) {
      case VendorStates.RESTRICTIONS_ON_SERVICE:
        return `${i18n.t('menu:vendorInfo.restrictions-on-service')}`
      case VendorStates.PREORDER:
        return openingTime
      case VendorStates.CLOSED:
        if (openingTime) return openingTime
        return `${i18n.t('menu:vendorInfo.vendor-is-closed')}`
      default:
        return ''
    }
  }

  static findShopProductById = (
    sections: ZooketSection[],
    productId: number
  ) => {
    let findedProduct: Product | undefined

    for (let index = 0; index < sections.length; index++) {
      const sectionItems = sections[index].data.items

      if (isProductType(sectionItems)) {
        findedProduct = sectionItems.find(product => product.id === productId)
        if (findedProduct) break
      }
    }

    return findedProduct
  }
  static findVendorProductById = (
    categories: MenuCategory[],
    productId: number
  ) => {
    let findedProduct: Product | undefined
    let result: Product[] = []

    for (let index = 0; index < categories.length; index++) {
      findedProduct = categories[index].products.find(
        product => product.id === productId
      )

      // if product has productId, then filter product variations with productId
      if (findedProduct) {
        if (findedProduct.productId) {
          result = categories[index].products.filter(
            product => product.productId === findedProduct?.productId
          )
        } else {
          result = [findedProduct]
        }

        break
      }
    }

    return result
  }

  static searchVendorMenu = (
    categories: MenuCategory[],
    searchParam: string | string[] | undefined
  ) => {
    if (!searchParam) return []

    const {getVariations} = VendorModel
    let findedProduct: Product[] | undefined
    let result: Product[] = []
    let productVariations: ProductVariation[] = []

    for (let index = 0; index < categories.length; index++) {
      findedProduct = categories[index].products.filter(product =>
        product.title.includes(String(searchParam))
      )
      result = result.concat(findedProduct)
    }

    productVariations = getVariations(result)

    return productVariations
  }

  getVendorOutOfScopeIsOpen() {
    const {vendor, findCurrentDateSchedule} = this
    const now = new Date()
    const hour = now.getHours()
    let today = now.getDay() + 2
    today = today > 7 ? today % 7 : today

    const schedules = vendor.schedules.filter(sch => sch.weekday === today)
    const schedule = findCurrentDateSchedule(schedules, hour)
    const isOpen = Boolean(schedule && schedule.startHour)

    return isOpen
  }
  findCurrentDateSchedule(schedules: Schedule[], hour: number) {
    let schedule: Schedule | undefined = undefined

    schedule = schedules.find(sch => {
      const start = Number(sch.startHour.slice(0, 2))
      const end = Number(sch.stopHour.slice(0, 2))
      return start <= hour && hour < end
    })

    return schedule
  }
  static getMenusWithVariations(menus: MenuCategory[]) {
    const {getVariations} = this
    const newMenus: MenuCategory[] = []

    for (let index = 0; index < menus.length; index++) {
      const products = menus[index].products
      const productVariations = getVariations(products)

      newMenus[index] = {
        ...menus[index],
        productVariations: productVariations,
      }
    }

    return newMenus
  }
  static getVariations(products: Product[]) {
    const hasKeys: HasKeys = {}
    const productVariations: ProductVariation[] = []

    for (let index = 0; index < products.length; index++) {
      const product = products[index]
      if (product.productId) {
        if (!hasKeys[product.productId]) {
          hasKeys[product.productId] = true

          const findedProducts = products.filter(
            item => item.productId === product.productId
          )

          productVariations.push({
            id: String(product.id),
            products: findedProducts,
          })
        }
      } else {
        productVariations.push({id: String(product.id), products: [product]})
      }
    }

    return productVariations
  }
  static filterSearchCaegories(menus: MenuCategory[]) {
    const searchCategories = menus.filter(
      menu =>
        menu.categoryId !== POPULAR_CATEGORY_ID &&
        menu.categoryId !== DISCOUNTS_CATEGORY_ID &&
        menu.categoryId !== PREVIOUS_PURCHASES_ID
    )

    return searchCategories
  }
}

export const vendorBaseKeys: (keyof VendorBase)[] = [
  'id',
  'vendorCode',
  'code',
  'vendorType',
  'vendorTypeTitle',
  'title',
  'logo',
  'address',
  'deliveryFee',
  'delivery_fee',
  'isOpen',
  'is_open',
  'status',
  'deliver',
  'preOrderEnabled',
  'is_preorder_enabled',
  'isZFExpress',
  'is_express',
  'newTypeTitle',
  'childType',
]

export enum VENDOR_TYPES {
  SUPERMARKET_TEST = 'SUPERMARKET_TEST',
  CONFECTIONERY = 'CONFECTIONERY',
  SUPERMARKET = 'SUPERMARKET',
  FRUIT_JUICE = 'FRUIT_JUICE',
  RESTAURANT = 'RESTAURANT',
  COSMETIC = 'COSMETIC',
  PROTEIN = 'PROTEIN',
  DIGITAL = 'DIGITAL',
  BAKERY = 'BAKERY',
  MAKEUP = 'MAKEUP',
  FRUIT = 'FRUIT',
  OTHER = 'OTHER',
  CAFE = 'CAFE',
  NUTS = 'NUTS',
  BOOK = 'BOOK',
}
