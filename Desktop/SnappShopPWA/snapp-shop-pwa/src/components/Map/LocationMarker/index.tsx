import React from 'react'
import dynamic from 'next/dynamic'
import {Map} from 'leaflet'
const MarkerWithNoSSR = dynamic(
  import('@components/Map/LocationMarker/LocationMarker'),
  {
    ssr: false,
  }
)
const ClientLocationMarker: React.FC<{
  forwardedRef: React.RefObject<Map>
}> = ({forwardedRef, ...props}) => {
  return <MarkerWithNoSSR {...props} forwardedRef={forwardedRef} />
}
ClientLocationMarker.displayName = 'ClientLocationMarker'
export default ClientLocationMarker
