export interface Discount {
  maxDiscount: number
  type: 'percent'
  value: number
}
export interface ExtraProducts {
  creator: 'BACKEND'
  deleted: boolean
  id: null | number
  order: null
  price: number
  quantity: number
  title: string
}

export interface Schedule {
  allDay: boolean
  startHour: string
  stopHour: string
  type: 'ACTIVE'
  weekday: number
}
export interface Coupon {
  active: boolean
  condition: string
  date_from: string
  date_to: string
  descriptions: string
  id: number
  is_auto_selected: boolean
  is_batch: boolean
  is_earned: boolean
  is_exclusive: boolean
  is_near_to_earn: boolean
  is_selected: boolean
  is_user_based: boolean
  near_message: string
  priority: number
  reward: string
  time_from_1: string
  time_from_2: string
  time_to_1: string
  time_to_2: string
  title: string
  reward_packet: {
    basketDiscount: null | Discount
    deliveryDiscount: null | Discount
    extraProducts: null | ExtraProducts[]
    packaging: null | {price: number; totalCount: number}
    packagingDiscount: null
    taxDiscount: null
  }

  schedules: Schedule[]
}
