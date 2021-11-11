import requests from '~growth/endpoints'
import {CityLocation} from '@schema/location'
import useJSON from '@hooks/useJson'

type JSON = CityLocation[] | undefined

export function useCities() {
  const citiesStorage = {key: 'cities', initialValue: undefined, version: 0}
  const cities = useJSON<JSON>(citiesStorage, requests.cities)

  return cities ?? []
}
