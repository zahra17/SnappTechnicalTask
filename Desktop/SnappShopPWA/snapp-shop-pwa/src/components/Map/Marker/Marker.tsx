import React, {ReactElement, useEffect} from 'react'
import {Marker, useMapEvents} from 'react-leaflet'
import L from 'leaflet'
import {LatLng} from '@schema/location'
import ReactDOMServer from 'react-dom/server'
const pinIconUrl = '/static/images/pin.svg'

interface BaseLeafletIcon {
  iconUrl?: string
  iconRetinaUrl?: string
  html?: string
  iconAnchor?: [number, number]
  iconSize?: [number, number]
  className?: string
}
interface SFMarkerProps {
  position: LatLng
  iconConfig?: BaseLeafletIcon
  divIcon?: ReactElement
  onChange?: (data?: LatLng) => void
}

function SFMarker({
  position,
  iconConfig,
  divIcon,
  onChange = () => {},
}: SFMarkerProps) {
  useEffect(() => {
    const searchElm: HTMLElement | null = document.querySelector(
      '*[class^="Search__SearchBar"]'
    )
    if (searchElm) {
      L.DomEvent.disableClickPropagation(searchElm)
    }
  }, [])

  useMapEvents({
    click(e: any) {
      if (
        ['mapContainer', 'leaflet-marker-icon'].includes(
          e.originalEvent.srcElement.classList[0]
        )
      ) {
        typeof onChange === 'function' && onChange(e.latlng)
      }
    },
    dblclick(e: any) {
      console.log('dblclick', e)
    },
  })

  return (
    <Marker
      position={position}
      icon={divIcon ? selectHTMLIcon(divIcon) : selectIcon(iconConfig || {})}
    />
  )
}

function selectIcon(iconConfig: BaseLeafletIcon) {
  const {
    iconUrl = pinIconUrl,
    iconRetinaUrl = pinIconUrl,
    html = 'Icon text',
    iconAnchor = [25, 60],
    iconSize = [50, 75],
    className = 'leaflet-div-icon',
  } = iconConfig
  return new L.Icon({
    iconUrl,
    iconRetinaUrl,
    html,
    iconAnchor,
    iconSize: new L.Point(iconSize[0], iconSize[1]),
    className,
  })
}

function selectHTMLIcon(icon: React.ReactElement) {
  return L.divIcon({
    iconAnchor: [-10, 55],
    className: 'custom-icon',
    html: ReactDOMServer.renderToString(icon),
  })
}

export default React.memo(SFMarker)
