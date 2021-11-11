import React from 'react'
import styled from 'styled-components'
import {MapContainer, TileLayer} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import MapConfig from './config.json'

interface MapProps {
  center: Array<number>
  zoom: number
  height: string
  children: React.FunctionComponent
  zoomControl?: boolean
  hideSign?: boolean
}

const Layout = styled.section`
  position: relative;

  .signature {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 400;
    padding: 0 0 4px 16px;
    color: var(--gray1-color);
    direction: ltr;
    user-select: none;
  }

  .leaflet-control-attribution {
    display: none;
  }

  .leaflet-div-icon {
    background-color: transparent;
    border: unset;
  }

  .leaflet-top {
    top: unset;
    bottom: 8px;
  }
`

const SFMap: React.FC<MapProps> = (props: MapProps) => {
  const {
    center = MapConfig.baseCenter,
    zoom = MapConfig.baseZoom,
    height = MapConfig.baseHeight,
    children,
    hideSign,
    zoomControl = true,
    ...others
  } = props

  // ref
  // const ref: any = useRef()

  const format = navigator.userAgent.includes('Chrome') ? 'webp' : 'png'

  const raster = {
    // url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    url: `https://raster.snappmaps.ir/styles/snapp-style/{z}/{x}/{y}{r}.${format}`,
    format: `image/${format}`,
    attribution: '&amp;copy Snapp',
  }

  // console.log('****** MAP props:', props)

  return (
    <Layout>
      <MapContainer
        center={[Number(center[0]), Number(center[1])]}
        className='mapContainer'
        style={{height: height}}
        zoom={zoom}
        zoomControl={zoomControl}
        {...others}
      >
        <TileLayer {...raster} />
        {children}
        {!hideSign && (
          <div className='signature'>
            ©&nbsp;Snapp&nbsp;-&nbsp;©&nbsp;OpenStreetMap
          </div>
        )}
      </MapContainer>
    </Layout>
  )
}

export default SFMap
