import {useState, useEffect, useRef} from 'react'

interface settings {
  expiry: number
  onExpire: Function
}

export default function useTimer(settings: settings) {
  const {expiry, onExpire} = settings || {}

  const [seconds, setSeconds] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [hours, setHours] = useState(0)

  const intervalRef = useRef<number | null>(null)

  function start() {
    if (!intervalRef.current) {
      calculateExpiryDate()
      intervalRef.current = window.setInterval(
        () => calculateExpiryDate(),
        1000
      )
    }
  }

  function reset() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setSeconds(0)
    setMinutes(0)
    setHours(0)
  }

  function calculateExpiryDate() {
    const now = new Date().getTime()
    const distance = expiry - now
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    )
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((distance % (1000 * 60)) / 1000)
    if (seconds < 0) {
      reset()
      onExpire()
    } else {
      setSeconds(seconds)
      setMinutes(minutes)
      setHours(hours)
    }
  }

  function addLeadingZeros(value: number): string {
    let strValue = String(value)
    while (strValue.length < 2) {
      strValue = '0' + strValue
    }
    return strValue
  }

  const formatTime = (value: number): string => addLeadingZeros(value)

  useEffect(() => {
    start()
    return reset
  }, [expiry])

  return {
    seconds: formatTime(seconds),
    minutes: formatTime(minutes),
    hours: formatTime(hours),
  }
}
