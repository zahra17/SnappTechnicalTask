import React, {createContext, useContext, useState, useEffect} from 'react'
import {
  appName,
  eventTypes,
  RudderStackEvent,
  RudderStackState,
} from '@schema/rudderStack'

const initialRudderStackState: RudderStackState = {
  isInitialized: false,
  eventTrigger: () => {},
}

export const RudderStackContext = createContext<RudderStackState>(
  initialRudderStackState
)
const RudderStackProvider: React.FC = ({children}) => {
  const [rudderStackState, setRudderStackState] = useState(
    initialRudderStackState
  )
  const [isInitialized, setIsInitialized] = useState(false)
  const [rudderAnalytics, setRudderAnalytics] = useState<any>(null)
  useEffect(() => {
    const novaKey = process.env.NOVA_WRITE_KEY
    const novaURL = process.env.NOVA_DATA_PLANE_URL
    if (!novaKey || !novaURL || isInitialized) return
    import('rudder-sdk-js').then(rudderanalytics => {
      function rudderInitialize() {
        rudderanalytics.load(novaKey!, novaURL!, {integrations: {All: true}})
      }
      rudderInitialize()
      setIsInitialized(true)
      setRudderAnalytics(rudderanalytics)
    })
  }, [])
  useEffect(() => {
    const eventTrigger = (event: RudderStackEvent) => {
      if (!isInitialized) return

      switch (event.type) {
        case eventTypes.track:
          rudderAnalytics.track(
            event.eventName,
            {...event.payload},
            {
              context: {
                app: {
                  name: appName.new_desktop,
                  namespace: process.env.NODE_ENV,
                  build: process.env.APP_VERSION,
                  version: process.env.APP_VERSION,
                },
              },
            }
          )
          break
        case eventTypes.identify:
          rudderAnalytics.identify(
            event.eventName,
            {...event.payload},
            {
              context: {
                app: {
                  name: appName.new_desktop,
                  namespace: process.env.NODE_ENV,
                  build: process.env.APP_VERSION,
                  version: process.env.APP_VERSION,
                },
              },
            }
          )
          break
        case eventTypes.pageView:
          rudderAnalytics.page(
            event.page_category,
            event.page_name,
            {...event.payload},
            {
              context: {
                app: {
                  name: appName.new_desktop,
                  namespace: process.env.NODE_ENV,
                  build: process.env.APP_VERSION,
                  version: process.env.APP_VERSION,
                },
              },
            }
          )
          rudderAnalytics.track(event.eventName, {...event.payload})
          break
        default:
          break
      }
    }
    setRudderStackState({
      isInitialized: isInitialized,
      eventTrigger,
    })
    return
  }, [rudderAnalytics])

  return (
    <RudderStackContext.Provider value={rudderStackState}>
      {children}
    </RudderStackContext.Provider>
  )
}

export function useRudderStack() {
  return useContext(RudderStackContext)
}

export default RudderStackProvider
