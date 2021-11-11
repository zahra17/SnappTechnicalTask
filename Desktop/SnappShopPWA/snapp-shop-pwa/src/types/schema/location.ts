import {Address} from './address'

export type LatLong = {
  lat: number
  long: number
}

export interface LatLng {
  lat: number
  lng: number
}

export enum Modes {
  Auto = 'Auto',
  Address = 'Address',
  Area = 'Area',
}

export enum MapTypes {
  edit = 'edit',
  show = 'show',
}

export interface Location {
  activeAddress?: Address['id']
  activeLocation: LatLong
  deviceLocation?: null
  searchLoading?: boolean
  areaAddress?: string
  mode: Modes
}

export interface LocationOptionType {
  name: string
  pageTitle: string | null
  mapType: MapTypes | null
  footer: {
    title: string
    ghost: boolean
    action: any
    disabled: boolean
  } | null
}

export interface MapOptionType {
  name: MapTypes
  searchable: boolean
  mapDetails: any
  footerActions: any
}

export interface SuccessLocationResponse {
  address: Address
  userAddresses: Address[]
  status: boolean
}
export interface ErrorResponse {
  error: {code: number; message: string}
  status: boolean
}

export interface CookyLocation {
  id: number | string
  latitude: number | string
  longitude: number | string
  mode?: Modes
  address?: string
}

export type CookiesRecord = Record<string, string | number | CookyLocation>

export function isCookyLocation(
  arg: string | number | CookyLocation
): arg is CookyLocation {
  return arg ? 'mode' in (arg as CookyLocation) : false
}

export interface Suggestion {
  id: string
  location: LatLong
  name: string
  description: string
}

export interface CityLocation {
  id?: string
  code?: string
  title?: string
  latitude?: string
  longitude?: string
  active?: string
  display_rank?: string
}

export interface SearchPlace {
  all_tags: string[]
  area_length: number
  description: string
  distance: number
  location: {
    latitude: string
    longitude: string
  }
  name: string
  place_id: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
  type: string
}

export type SearchPlaceResponse = [
  {status: boolean; message: string; data: SearchPlace[]}
]

export interface ReverseAddressItem {
  distance: number | unknown
  name: string
  type: string
}

export type ReverseAddressResponse = [
  {status: boolean; message: string; data: ReverseAddressItem[]}
]

export interface AddressDetails extends Address {
  cityId: string | number
  autoAddress?: Array<ReverseAddressItem>
  detail?: string
  qText?: string
}
