import {User} from './user'

export interface Campaign {
  url: string
  name: string
  icon: string
}
export interface AppConfig {
  app: {
    CURRENT_VERSION: string
    MIN_FORCE_VERSION: string
    UPDATE_URL: string
  }
}
export interface SuperType {
  alias: string
  background_color: string
  badge: null
  banner_image: null
  icon: string
  id: number
  is_shop: boolean
  jekIcon: string[]
  name: string
  primary_color: string
  pwaIcon: string[]
  secondary_color: string
  visible: boolean
}

export interface LoadData {
  GASampleRate: number
  KeplerBatchCount: number
  PSAHome: string
  PSAMode: boolean
  appseeEnable: boolean
  campaign: Campaign
  chatEnabled: true
  clientCacheTimeInMinutes: number
  config: AppConfig
  dynamicNotification: boolean
  forced_update: boolean
  googleMapMode: boolean
  has_pop_up: boolean
  isKeplerEnabled: boolean
  isLoyal: boolean
  isUserLoggedIn: boolean
  loadFlag: boolean
  locationPrecision: string
  maxAllowedCashAmount: number
  maximumDeliveryDistance: number
  new_update: boolean
  oauth2_status: {time: number; enabled: boolean}
  popup: {title: string; Id: number; updatedAt: string | null; items: unknown[]}
  pre_order_closed_alarm_count: number
  shareAppMessage: string
  show_increase_credit: boolean
  superTypes: Record<number, string>
  superTypesInfo: SuperType[]
  support_contact: string
  time: number
  user: User
}
