import {usePinnedLocationContext} from '@contexts/Map/PinnedLocation'
import {CityLocation} from '@schema/location'
import {CITY_CODES} from '@utils'
import {useEffect, useState} from 'react'
import {useCities} from '~growth/hooks/useCities'

const useSelectedCity = ({
  cityId = null,
}: {
  cityId?: string | number | null
}) => {
  const {city, isCitySubmited} = usePinnedLocationContext()
  const cities = useCities()
  const [selectedCity, setSelectedCity] = useState<CityLocation | null>(null)
  const getSelectedCity = (
    cityId?: string | number | null,
    savedCityId?: string | null
  ) => {
    if (!!cityId && cityId !== 'undefined')
      return cities.find(item => item.id === String(cityId)) || cities[0]
    else if (savedCityId)
      return cities.find(item => item.id === String(savedCityId)) || cities[0]
    else return cities[0]
  }
  useEffect(() => {
    if (!selectedCity || isCitySubmited) {
      const savedAddress = localStorage.getItem('addressDetails')
      const savedCityId = savedAddress && JSON.parse(savedAddress)?.cityId
      setSelectedCity(getSelectedCity(cityId, savedCityId))
    }
  }, [selectedCity, isCitySubmited])

  useEffect(() => {
    if (city.cityId && isCitySubmited) {
      setSelectedCity(getSelectedCity(city.cityId))
    }
  }, [city])
  return {selectedCity}
}

export default useSelectedCity
