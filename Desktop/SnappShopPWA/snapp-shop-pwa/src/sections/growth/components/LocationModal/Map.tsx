import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {rem} from 'polished'
import styled from 'styled-components'
import {EditIcon, Text, Button} from '@sf/design-system'
import {usePosition} from '@hooks/usePossition'
import {useCities} from '~growth/hooks/useCities'
import {MapTypes, MapOptionType, LatLng, CityLocation} from '@schema/location'
import {LatLong} from '@schema/location'
import {Map as MapType} from 'leaflet'

// Components
import Search from './Search'
import Map from '@components/Map'
import mapConfig from '@components/Map/config.json'
import Cities from '~growth/components/LocationModal/Search/Cities'
import {useRudderStack} from '@contexts/RudderStack'
import {eventTypes} from '@schema/rudderStack'
import LocationMarker from '@components/Map/LocationMarker'
import {getAddressDetail} from '@components/Map/LocationMarker/helper'
import {usePinnedLocationContext} from '@contexts/Map/PinnedLocation'
import useSelectedCity from '@hooks/useSelectedCity'

interface AddressMapProps {
  type: MapTypes
  step: string
  defaultQText: string
  changeStep: (step: string) => void
  activeId: number | string | null
  activeLatitude: string | number
  activeLongitude: string | number
  cityId: string
  setAddressDetails: any
  setIsOpenCities: (state: boolean) => void
  isOpenCities: boolean
  forwardedRef: React.RefObject<MapType>
}
interface pageOption {
  [key: string]: MapOptionType
}

const FooterAction = styled(Button)`
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  z-index: 450;
  height: 40px;
  padding-right: ${rem(11)};
  padding-left: 0.8rem;
  background-color: #fff;
  border: 1px solid rgba(0, 209, 112, 0.08);
  box-shadow: 0 4px 16px -8px rgba(0, 0, 0, 0.1);
  user-select: none;

  &:hover,
  &:focus,
  &:active {
    background-color: #fff;
  }
`

const AddressMap: React.FC<AddressMapProps> = ({forwardedRef, ...props}) => {
  const {
    type,
    step,
    defaultQText,
    changeStep,
    activeId,
    activeLatitude,
    activeLongitude,
    cityId,
    setAddressDetails,
    setIsOpenCities,
    isOpenCities,
  } = props

  const [center, setCenter] = useState([
    activeLatitude || mapConfig.baseCenter[0],
    activeLongitude || mapConfig.baseCenter[1],
  ])
  const {t} = useTranslation()
  const {latitude, longitude, error}: any = usePosition()
  const cities = useCities()
  const [defaultInputValue, setDefaultInputValue] = useState(defaultQText)
  const {changeAddress} = usePinnedLocationContext()
  const [currentCity, setCurrentCity] = useState<CityLocation | undefined>(
    cities[0]
  )
  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(function (position) {
  //     console.log('Latitude is :', position.coords.latitude)
  //     console.log('Longitude is :', position.coords.longitude)
  //   })
  // }, [])

  useEffect(() => {
    setCenter([
      activeLatitude || mapConfig.baseCenter[0],
      activeLongitude || mapConfig.baseCenter[1],
    ])
  }, [type])

  function setCurrentLocation() {
    console.log('current location:', latitude, longitude, error)
  }
  const rudderStack = useRudderStack()
  function handleChangeMarker(data: LatLng) {
    if (type === 'show') return
    setAddressDetails((obj: any) => ({
      ...obj,
      latitude: data.lat,
      longitude: data.lng,
    }))
    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: 'Address pin edit',
    })
  }

  const options: pageOption = {
    edit: {
      name: MapTypes.edit,
      searchable: true,
      mapDetails: {
        height: '50vh',
        dragging: true,
      },
      footerActions: null,
      // footerActions: {
      //   title: t('location.map.currentPosition'),
      //   icon: <LocationIcon />,
      //   action: setCurrentLocation,
      // },
    },
    show: {
      name: MapTypes.show,
      searchable: false,
      mapDetails: {
        height: '10rem',
        dragging: false,
      },
      footerActions:
        step === 'editAddressDetails'
          ? null
          : {
              title: t('location.map.editPosition'),
              icon: <EditIcon fill='var(--sf-accent2-main)' />,
              action: () => changeStep(activeId ? 'editAddress' : 'newAddress'),
            },
    },
  }

  function setMapLocation(
    latLong: LatLong,
    justCenter: boolean,
    qText: string
  ) {
    if (justCenter) {
      setAddressDetails((obj: any) => ({
        ...obj,
        latitude: latLong.lat,
        longitude: latLong.long,
        qText: qText,
      }))
    }
    setCenter([latLong.lat, latLong.long])
  }

  async function handleSelectCity(city: CityLocation) {
    setIsOpenCities(false)
    const addressDetail = await getAddressDetail({
      lat: Number(city.latitude),
      lon: Number(city.longitude),
    })
    setAddressDetails((obj: any) => ({
      ...obj,
      cityId: city.id,
      qText: '',
    }))
    setCenter([Number(city.latitude), Number(city.longitude)])
    setCurrentCity(city)
  }
  useEffect(() => {
    const addressDetail = localStorage.getItem('addressDetails')
    if (!addressDetail) return
    const {lat, long} = JSON.parse(addressDetail) || {lat: 32, long: 52}
    setCenter([lat, long])
  }, [])

  const {selectedCity} = useSelectedCity({cityId})
  useEffect(() => {
    if (selectedCity) setCurrentCity(selectedCity)
  }, [selectedCity])
  return (
    <>
      <Map {...options[type].mapDetails} center={center}>
        {options[type].searchable && (
          <Search
            setMapLocation={setMapLocation}
            defaultQText={defaultInputValue}
            setIsOpenCities={setIsOpenCities}
            selectedCity={currentCity}
          />
        )}
        <LocationMarker forwardedRef={forwardedRef} />

        {options[type].footerActions && (
          <FooterAction
            appearance='naked'
            float
            colorName='accent2'
            onClick={options[type].footerActions.action}
          >
            {options[type].footerActions.icon}
            <Text scale='body' weight='bold' colorName='accent2'>
              {options[type].footerActions.title}
            </Text>
          </FooterAction>
        )}
      </Map>

      <Cities
        isOpenCities={isOpenCities}
        setIsOpenCities={setIsOpenCities}
        handleSelectCity={handleSelectCity}
      />
    </>
  )
}

export default AddressMap
