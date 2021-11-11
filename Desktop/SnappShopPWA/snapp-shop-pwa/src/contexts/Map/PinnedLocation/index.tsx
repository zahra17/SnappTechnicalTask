import {CityLocation, Modes} from '@schema/location'
import {createContext, useCallback, useContext, useState} from 'react'
import React from 'react'
import {useCities} from '~growth/hooks/useCities'
import {Address} from '@schema/address'
import {CategoryQueryType} from '~search/pages/vendor-list'
import {UrlObject} from 'url'
import {getCityInfo, getRoute} from './utils'
import {useSelector} from 'react-redux'
import {selectUser} from '@slices/core'
import {User} from '@schema/user'
import {selectActiveAddress} from '~growth/redux/location'
import {FetchParams} from '~search/redux/vendorsList'

export interface PinnedLocation {
  address: string
  lat: number
  lon: number
  cityId: string | null
  cityCode: string | null
  cityName: string
  countyName: string
  provinceName: string
  cityName_fa?: string | null
}

export interface RedirectURL {
  selectedCity?: CityLocation | null
  query: {
    page?: number | null
    service?: string | null
    superType?: string | string[] | null
    filters?: (string | null)[] | null
    category?: CategoryQueryType
    cityName?: string | null
    extraFilter?: string | null
    asPath: string
    section: string | null
    cuisine: string | null
    chainName: string | null
  }
  isNewAddress: boolean
}
export interface CityInfo {
  cityCode: string | null
  cityId: string | null
  cityName_fa?: string | null
}
interface PinnedLocationContextState {
  changeAddress: Function
  changeCity: Function
  changeCitySubmitedState: Function
  redirectURL: Function
  addressDetails: string
  address: string
  city: CityInfo
  isCitySubmited: boolean
  newRoute: UrlObject | null
}
const initialContext = {
  changeAddress: () => {},
  changeCity: () => {},
  changeCitySubmitedState: () => {},
  redirectURL: () => {},
  city: {
    cityCode: null,
    cityId: null,
    cityName_fa: null,
  },
  addressDetails: '',
  address: '',
  isCitySubmited: false,
  newRoute: null,
}

export const PinnedLocationContext = createContext<PinnedLocationContextState>(
  initialContext
)
const PinnedLocationProvider: React.FC = ({children}) => {
  const cities = useCities()
  const user: User | null = useSelector(selectUser)
  const activeAddress = useSelector(selectActiveAddress)
  const [newRoute, setNewRoute] = useState<UrlObject | null>(null)
  const [addressDetails, setAddressDetails] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [isCitySubmited, setIsCitySubmited] = useState<boolean>(false)

  const [city, setCity] = useState<CityInfo>({
    cityCode: null,
    cityId: null,
    cityName_fa: null,
  })
  const changeCity = (city: CityInfo) => {
    setCity(city)
  }
  const changeAddress = (data: PinnedLocation) => {
    const {cityId, cityCode, cityName_fa} = getCityInfo(data, cities)
    setAddress(
      JSON.stringify({
        lat: String(data.lat),
        long: String(data.lon),
        address: data.address,
        mode: Modes.Area,
        cityId,
        cityCode,
        cityName_fa,
      })
    )
    setAddressDetails(data.address)
    changeCity({cityId, cityCode, cityName_fa})
  }

  const changeCitySubmitedState = (state: boolean = false) => {
    setIsCitySubmited(state)
  }
  const redirectURL = useCallback(
    (prop: RedirectURL) => {
      const route = getRoute(prop, !!user, activeAddress)
      setNewRoute(route || null)
    },
    [!!user, activeAddress]
  )
  return (
    <PinnedLocationContext.Provider
      value={{
        changeAddress,
        changeCity,
        changeCitySubmitedState,
        redirectURL,
        addressDetails,
        address,
        city,
        isCitySubmited,
        newRoute,
      }}
    >
      {children}
    </PinnedLocationContext.Provider>
  )
}
export const usePinnedLocationContext = () => {
  return useContext(PinnedLocationContext)
}
export default PinnedLocationProvider
