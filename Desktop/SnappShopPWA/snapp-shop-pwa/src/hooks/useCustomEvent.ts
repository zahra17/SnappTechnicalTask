import {useEffect} from 'react'

interface Args {
  typeArg: string
  listener?: (e: CustomEvent<unknown>) => void
}

export function useCustomEvent({typeArg, listener = () => {}}: Args) {
  useEffect(() => {
    window.addEventListener(typeArg, listener as EventListener)
    return () => {
      window.removeEventListener(typeArg, listener as EventListener)
    }
  }, [])

  return {
    dispatchEvent: (detail: unknown) => {
      const event = new CustomEvent(typeArg, {
        detail,
      })
      window.dispatchEvent(event)
    },
  }
}
