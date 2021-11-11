export interface Address {
  id: number | string
  address: string
  city?: City
  label: string
  phone?: string
  latitude: string | number
  longitude: string | number
  isCompany?: boolean
  companyDiscount?: number
  isConfirmed?: boolean
}

export interface City {
  id: number
  title: string
}
