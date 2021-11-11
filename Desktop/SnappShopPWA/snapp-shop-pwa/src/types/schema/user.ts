import {Address} from './address'

export interface User {
  addresses: Address[]
  birthday: string
  cellphone: string
  credit: number
  email: string
  emailSubscribed: boolean | null
  firstname: string
  hasPassword: boolean
  id: number
  lastname: string
  levelName: string
  levelNumber: number
  memberships: unknown[]
  point: number
  profilePicture: string
  smsSubscribed: boolean | null
  updateChannels: string[]
  username: string
  vendorsList: unknown[]
  vipDeliveryDiscount: number
  vipDiscount: number
  vipDiscountPlans: unknown[]
}
