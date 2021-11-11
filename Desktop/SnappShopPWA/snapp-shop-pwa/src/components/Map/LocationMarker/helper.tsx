import requests from '~growth/endpoints'
import {ReverseAddressResponse} from '@schema/location'
import {isAPIResponse} from '@api'
import {formatAddress} from 'src/utils/address'

export interface MapData {
  lat: number
  lon: number
}
export const getAddressDetail = async (data: MapData) => {
  const {lat = -1, lon = -1} = data
  if (lat && lon) {
    try {
      const response = await requests.mapReversAddress<ReverseAddressResponse>({
        params: {lat, lon},
      })
      if (isAPIResponse(response)) {
        const [{status, data}] = response.data
        if (status) {
          const formatedAddress = formatAddress(data)
          return {
            lat,
            lon,
            address: formatedAddress.addressText || formatedAddress.areaName,
            cityName: formatedAddress.cityName,
            countyName: formatedAddress.countyName,
            provinceName: formatedAddress.provinceName,
          }
        } else return false
      } else return false
    } catch (error) {
      console.log(error)
      return false
    }
  }
}
