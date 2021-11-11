import {useState, useEffect, Dispatch, SetStateAction} from 'react'

export function useSetTimer(
  waitingTime: number
): [number, Dispatch<SetStateAction<number>>] {
  let timer: number
  const [remainedTime, setRemainedTime] = useState(waitingTime)

  useEffect(() => {
    if (remainedTime > 0) {
      timer = window.setInterval(() => {
        setRemainedTime(time => time - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [remainedTime])

  return [remainedTime, setRemainedTime]
}
