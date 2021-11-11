import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {selectLocation} from '~growth/redux/location'
import {setCookie, getCookie} from '@utils'

const LocationProvider: React.FC = ({children}) => {
  // const [, setFresh] = useState(0)
  const location = useSelector(selectLocation)

  useEffect(() => {
    const locationCooky = getCookie('location')
    if (
      !location.activeLocation?.lat ||
      (locationCooky.latitude == location.activeLocation?.lat &&
        locationCooky.location == location.activeLocation?.long)
    ) {
      return
    }
    setCookie('location', {
      id: location.activeAddress,
      latitude: location.activeLocation.lat,
      longitude: location.activeLocation.long,
      mode: location.mode,
    })
    // setFresh(1)
  }, [
    location.activeAddress,
    location.activeLocation.lat,
    location.activeLocation.long,
  ])

  return <> {children} </>
}

export default LocationProvider
