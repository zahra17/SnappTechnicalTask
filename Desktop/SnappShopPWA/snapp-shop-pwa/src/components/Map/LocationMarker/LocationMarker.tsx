import React, {useEffect} from 'react'
import styled from 'styled-components'
import {FlexBox, UserPin} from '@sf/design-system'
import {Map} from 'leaflet'
import {usePinnedLocationContext} from '@contexts/Map/PinnedLocation'
import {useMapSearchBoxContext} from '@contexts/Map/Searchbox'
import debounce from 'lodash/debounce'
import {useMap} from 'react-leaflet'
import {getAddressDetail} from './helper'

const UserPinWrapper = styled(FlexBox)`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 400;
  transform: translate(-50%, -50%);
`

const LocationMarker: React.FC<{forwardedRef: React.RefObject<Map>}> = ({
  forwardedRef,
}) => {
  const map = useMap()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  forwardedRef.current = map
  const {changeAddress} = usePinnedLocationContext()
  const {isFocus} = useMapSearchBoxContext()
  useEffect(() => {
    if (isFocus) map.dragging.disable()
    else map.dragging.enable()
  }, [isFocus])
  const mapDragEndHandler = async () => {
    const {lat, lng} = map.getCenter()
    const addressDetail = await getAddressDetail({lat: lat, lon: lng})
    if (addressDetail) {
      const pinnedDetails = {...addressDetail}
      changeAddress(pinnedDetails)
    }
  }

  useEffect(() => {
    mapDragEndHandler()
  }, [])
  const mapMouseDownHandler = () => {
    map.dragging.enable()
  }
  useEffect(() => {
    const debounceMapDragEndHandler = debounce(mapDragEndHandler, 50)
    map.addEventListener('dragend', debounceMapDragEndHandler)

    const deboundeMapMouseDownHandler = debounce(mapMouseDownHandler, 50)
    map.addEventListener('mousedown', deboundeMapMouseDownHandler)

    const clear = () => {
      map.removeEventListener('dragend', debounceMapDragEndHandler)
      map.removeEventListener('mousedown', deboundeMapMouseDownHandler)
    }
    return clear
  }, [])

  return (
    <UserPinWrapper>
      <UserPin />
    </UserPinWrapper>
  )
}
LocationMarker.displayName = 'LocationMarker'
export default LocationMarker
