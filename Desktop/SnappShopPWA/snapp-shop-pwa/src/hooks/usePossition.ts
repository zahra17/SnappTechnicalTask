import {useState, useEffect} from 'react'

const defaultSettings = {
  enableHighAccuracy: false,
  timeout: Infinity,
  maximumAge: 0,
}

export const usePosition = (watch = false, settings = defaultSettings) => {
  const [position, setPosition] = useState({})
  const [error, setError] = useState(null)

  const onChange = ({coords, timestamp}: any) => {
    setPosition({
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracy: coords.accuracy,
      speed: coords.speed,
      timestamp,
    })
  }

  const onError = (error: any) => {
    setError(error.message)
  }

  // useEffect(() => {
  //   if (!navigator || !navigator.geolocation) {
  //     throw 'Geolocation is not supported'
  //     return
  //   }

  //   let watcher: any = null
  //   if (watch) {
  //     watcher = navigator.geolocation.watchPosition(onChange, onError, settings)
  //   } else {
  //     navigator.geolocation.getCurrentPosition(onChange, onError, settings)
  //   }

  //   return () => watcher && navigator.geolocation.clearWatch(watcher)
  // }, [settings.enableHighAccuracy, settings.timeout, settings.maximumAge])

  return {...position, error}
}
