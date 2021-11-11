import React, {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {selectUser, updateAddress} from '@slices/core'
import styled from 'styled-components'
import Footer from './Footer'
import Map from './Map'
import {Map as MapType} from 'leaflet'
import AddressList from './AddressList'
import {
  Modal,
  Text,
  Input,
  FlexBox,
  CircleErrorFillIcon,
} from '@sf/design-system'
import {
  setActive as setActiveAction,
  showModal as showModalAction,
  selectLocation,
  selectIsModalOpen,
  selectActiveAddress,
} from '~growth/redux/location'
import {selectPendingOrder} from '~order/redux/pendingOrders'

import useFormatAddress from '@hooks/useFormatAddress'
import useLocationType from './useLocationType'

// types
import {Address} from '@schema/address'
import {
  Modes,
  AddressDetails,
  LocationOptionType,
  SuccessLocationResponse,
  ReverseAddressResponse,
  ReverseAddressItem,
} from '@schema/location'

// api
import {isAPIResponse} from '@api'
import requests from '~growth/endpoints'
import {ModalHeader} from '@components/ModalTools'
import {useToast} from '@contexts/Toast'
import {useRudderStack} from '@contexts/RudderStack'
import {eventTypes} from '@schema/rudderStack'
import {formatAddress} from 'src/utils/address'
import PinnedLocationProvider, {
  PinnedLocation,
  PinnedLocationContext,
  usePinnedLocationContext,
} from '@contexts/Map/PinnedLocation'
import SearchBoxProvider from '@contexts/Map/Searchbox'
import {selectBaskets} from '@slices/baskets'
import {useRouter} from 'next/router'
import {UrlObject} from 'url'
import {getCityCodeById, getCityTitle, getCookie, setCookie} from '@utils'
import useSelectedCity from '@hooks/useSelectedCity'

const TopMessage = styled(FlexBox)`
  margin-bottom: 0.5rem;
  padding: 0.2rem 1rem 1rem;

  p:first-child {
    margin-bottom: 0.5rem;
  }
`

const AddressDetail = styled.section`
  max-height: 42vh;
  padding: 1rem;
  overflow-y: auto;

  section {
    margin-bottom: 2rem;

    div {
      margin-top: 6px;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
`
enum ErrorMessageType {
  ADDRESS_DETAIL,
}
interface ErrorMessage {
  type?: ErrorMessageType
  message?: string
}

const initialAddressDetails: AddressDetails = {
  address: '',
  detail: '',
  label: '',
  phone: '',
  latitude: '',
  longitude: '',
  cityId: '',
  id: '',
  qText: '',
}

const AddressModal: React.FC = () => {
  const {
    address,
    changeCitySubmitedState,
    city,
    redirectURL,
  } = usePinnedLocationContext()
  const {showToast} = useToast()
  const mapRef = useRef<MapType>(null)
  const isFirstRender = useRef(true)
  const router = useRouter()
  const {basketCode} = router.query
  const isCheckout = !!basketCode
  // local states
  const [step, setStep] = useState('guest')
  const [addressDetails, setAddressDetails] = useState(initialAddressDetails)
  const [apiState, setApiState] = useState({isLoading: false, error: ''})
  const [isOpenCities, setIsOpenCities] = useState(false)
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>({})
  const getPinPosition = () => mapRef.current?.getCenter() || {lat: -1, lng: -1}
  // redux states
  const baskets = useSelector(selectBaskets)
  const userData = useSelector(selectUser)
  const location = useSelector(selectLocation)
  const activeAddress = useSelector(selectActiveAddress)
  const isModalOpen: boolean = useSelector(selectIsModalOpen)
  const addressListData = userData?.addresses ?? []
  const pendingOrder = useSelector(selectPendingOrder)
  const {t} = useTranslation()
  const {areaName, addressText: addressFormatted} = useMemo(() => {
    return formatAddress(addressDetails.autoAddress)
  }, [addressDetails.autoAddress])

  const autoAddressRef = useRef<HTMLInputElement>(null)

  // dispatch
  const dispatch = useDispatch()

  // Show toast on error
  useEffect(() => {
    const {error} = apiState
    if (error) {
      showToast({
        message: error,
        status: 'alert',
      })
      setTimeout(() => {
        setApiState({
          isLoading: false,
          error: '',
        })
      }, 1500)
    }
  }, [apiState])
  // Did Mount
  useEffect(() => {
    setStep(userData ? 'list' : 'guest')
    return () => {
      setStep(userData ? 'list' : 'guest')
    }
  }, [userData, isModalOpen])

  useEffect(() => {
    // success api
    if (!apiState.isLoading && !apiState.error) {
      if (step === 'newAddressDetails' || step === 'editAddressDetails') {
        setStep('list')
      }
      setAddressDetails(initialAddressDetails)
    }
  }, [apiState.isLoading])

  useEffect(() => {
    // set guest Area
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const position = getPinPosition()
    if (
      Number(position.lat) === Number(location?.activeLocation?.lat) &&
      Number(position.lng) === Number(location?.activeLocation?.long)
    ) {
      localStorage.setItem(
        'addressDetails',
        JSON.stringify({
          lat: String(addressDetails.latitude),
          long: String(addressDetails.longitude),
          address: `${areaName}، ${addressFormatted}`,
          mode: Modes.Area,
        })
      )
      return
    }
    if (step === 'guest') {
      dispatch(
        setActiveAction({
          id: '',
          latitude: String(position.lat),
          longitude: String(position.lng),
          address: `${areaName}، ${addressFormatted}`,
          mode: Modes.Area,
        })
      )
    }
  }, [addressDetails.autoAddress])

  useEffect(() => {
    if (autoAddressRef.current) autoAddressRef.current.value = addressFormatted
  }, [addressFormatted])
  useEffect(() => {
    if (userData) {
      localStorage.removeItem('addressDetails')
      setAddressDetails(initialAddressDetails)
    }
  }, [userData])
  function setActiveAddress(addressId: number | string) {
    if (isCheckout) {
      rudderStack.eventTrigger({
        type: eventTypes.track,
        eventName: 'Checkout logged-in Address Select new select',
        payload: {
          address_id: +addressId,
        },
      })
    }
    const fullAddress = userData?.addresses.find(
      (item: Address) => item.id == addressId
    )
    if (!fullAddress) return
    dispatch(
      setActiveAction({
        id: addressId,
        latitude: fullAddress.latitude,
        longitude: fullAddress.longitude,
        mode: Modes.Address,
      })
    )
    setTimeout(() => {
      dispatch(showModalAction(false))
    }, 300)
  }

  async function getDetailsOfMap(
    lat: Address['latitude'],
    lon: Address['longitude'],
    callback: () => void
  ) {
    try {
      const response = await requests.mapReversAddress<ReverseAddressResponse>({
        params: {lat, lon},
      })
      if (isAPIResponse(response)) {
        const [{status, data}] = response.data
        if (status) {
          setAddressDetails(details => ({...details, autoAddress: data}))
          callback()
        } else throw 'err'
      } else throw 'err'
    } catch (error) {
      console.log(error)
    }
  }

  async function selectNewArea(
    e?: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e?.preventDefault()
    const position = getPinPosition()
    setAddressDetails(details => ({
      ...details,
      latitude: position.lat,
      longitude: position.lng,
    }))
    await getDetailsOfMap(position.lat, position.lng, () =>
      setStep(addressDetails.id ? 'editAddressDetails' : 'newAddressDetails')
    )
  }

  async function selectGuestArea(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const position = getPinPosition()
    setAddressDetails(details => ({
      ...details,
      latitude: position.lat,
      longitude: position.lng,
    }))
    await getDetailsOfMap(position.lat, position.lng, () =>
      dispatch(showModalAction(false))
    )
  }

  function canChangeAddress(addressId: string) {
    const address = addressListData.find(item => item.id == addressId)
    const sameAddressWithActiveOrder = pendingOrder?.find(
      p => p.userAddress == address?.address
    )
    if (
      sameAddressWithActiveOrder ||
      Object.values(baskets || {}).some(
        basket => basket?.addressId == addressId
      )
    ) {
      showToast({
        message: t('core:location.activeOrderAddressMessage'),
        status: 'alert',
      })
      return false
    }

    return true
  }
  function goToEdit(addressId: string): void {
    if (isCheckout) {
      rudderStack.eventTrigger({
        type: eventTypes.track,
        eventName: 'Checkout logged-in Address Select edit',
        payload: {
          address_id: +addressId,
        },
      })
    }
    if (canChangeAddress(addressId)) {
      const data = addressListData.find(item => item.id == addressId)
      if (!data) return
      setAddressDetails({
        id: data.id,
        label: data.label,
        address: data.address,
        phone: data.phone,
        latitude: data.latitude,
        longitude: data.longitude,
        cityId: data?.city?.id || '1',
      })
      setStep('editAddressDetails')
    }
  }

  async function goToRemove(addressId: string): Promise<void> {
    if (isCheckout) {
      rudderStack.eventTrigger({
        type: eventTypes.track,
        eventName: 'Checkout logged-in Address Select delete',
        payload: {
          address_id: +addressId,
        },
      })
    }
    if (canChangeAddress(addressId)) {
      if (apiState.isLoading) return
      const res = confirm('آیا مایل به حذف آدرس هستید؟')
      if (res) {
        setApiState({isLoading: true, error: ''})
        const response = await requests.deleteAddress<{
          data: SuccessLocationResponse
          error: {message: string}
        }>({
          urlParams: {version: 'v2'},
          params: {addressId},
        })
        if (isAPIResponse(response)) {
          if (response.data.data) {
            setApiState({isLoading: false, error: ''})
            dispatch(updateAddress(response.data.data.userAddresses))
            if (addressId == activeAddress?.id) {
              response.data.data.userAddresses.length &&
                setActiveAddress(
                  String(response.data.data.userAddresses[0]?.id)
                )
            }
          } else {
            setApiState({isLoading: false, error: response.data.error.message})
          }
        } else {
          setApiState({isLoading: false, error: 'خطای سرور'})
        }
      }
    }
  }

  async function submitNewAddress(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault()
    if (apiState.isLoading) return
    if (isCheckout) {
      rudderStack.eventTrigger({
        type: eventTypes.track,
        eventName: 'Address create new submit',
      })
    }
    const addressData = {
      city_id: addressDetails.cityId || 1,
      phone: addressDetails.phone || userData?.cellphone.replaceAll(' ', ''),
      label: addressDetails.label,
      address: `${areaName} ${autoAddressRef.current?.value} ${addressDetails.address}`,
      latitude: addressDetails.latitude,
      longitude: addressDetails.longitude,
    }
    setApiState({isLoading: true, error: ''})
    const response = await requests.newAddress<{data: SuccessLocationResponse}>(
      {
        urlParams: {version: 'v2'},
        params: addressData,
      }
    )
    if (isAPIResponse(response)) {
      dispatch(updateAddress(response.data.data.userAddresses))
      dispatch(
        setActiveAction({
          id: String(response.data.data.address.id),
          latitude: response.data.data.address.latitude,
          longitude: response.data.data.address.longitude,
          mode: Modes.Address,
        })
      )
      dispatch(showModalAction(false))
      setApiState({isLoading: false, error: ''})
    } else {
      setApiState({isLoading: false, error: 'error'})
    }
  }

  async function submitEditAddress(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault()
    if (apiState.isLoading) return
    const addressData = {
      addressId: addressDetails.id,
      phone: addressDetails.phone || userData?.cellphone.replaceAll(' ', ''),
      label: addressDetails.label,
      address: addressDetails.address,
      cityId: addressDetails.cityId,
      latitude: addressDetails.latitude,
      longitude: addressDetails.longitude,
    }

    setApiState({isLoading: true, error: ''})
    const response = await requests.editAddress<{
      data: SuccessLocationResponse
    }>({
      urlParams: {version: 'v2'},
      params: addressData,
    })
    if (isAPIResponse(response)) {
      dispatch(updateAddress(response.data.data.userAddresses))
      setApiState({isLoading: false, error: ''})
    } else {
      setApiState({isLoading: false, error: 'error'})
    }
  }

  const pageOption: LocationOptionType = useLocationType(
    step,
    addressDetails.latitude,
    addressListData.length,
    selectGuestArea,
    submitNewAddress,
    selectNewArea,
    submitEditAddress
  )

  function handleChangeDetails(e: React.ChangeEvent<HTMLInputElement>) {
    setAddressDetails(data => ({
      ...data,
      [e.target.name]: e.target.value,
    }))
  }

  function handleCloseModal() {
    if (isOpenCities) return
    setAddressDetails(initialAddressDetails)
    dispatch(showModalAction(!isModalOpen))
  }
  const rudderStack = useRudderStack()
  useEffect(() => {
    if (pageOption.name === 'guest' && isModalOpen) {
      rudderStack.eventTrigger({
        type: eventTypes.track,
        eventName: 'Home not logged-in Address Select',
        payload: {},
      })
    } else if (pageOption.name === 'list' && isModalOpen) {
      rudderStack.eventTrigger({
        type: eventTypes.track,
        eventName: 'Header address select',
        payload: {},
      })
    }
  }, [rudderStack, isModalOpen])
  const onCloseModal = () => {
    dispatch(showModalAction(false))
    if (isCheckout) {
      rudderStack.eventTrigger({
        type: eventTypes.track,
        eventName: 'Checkout logged-in Address Select close',
      })
    } else if (pageOption.name === 'guest') {
      rudderStack.eventTrigger({
        type: eventTypes.track,
        eventName: 'Address Select Close',
      })
    } else if (pageOption.name === 'list') {
      rudderStack.eventTrigger({
        type: eventTypes.track,
        eventName: 'Home logged-in Address Select close',
      })
    }
  }

  const [pinnedAddressDetails, setPinnedAddressDetails] = useState<string>('')
  useEffect(() => {
    if (address) setPinnedAddressDetails(address)
  }, [address])

  const handleChangeStep = (e: string) => {
    if (isCheckout) {
      rudderStack.eventTrigger({
        type: eventTypes.track,
        eventName: 'Address pin edit',
      })
    }
    setStep(e)
  }
  const addressDetailRef = useRef<HTMLInputElement>(null)

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.stopPropagation()
    e.preventDefault()
    if (
      !addressDetailRef ||
      (addressDetailRef.current && addressDetailRef.current.value.trim() === '')
    ) {
      setErrorMessage({
        type: ErrorMessageType.ADDRESS_DETAIL,
        message: t('search:error.detail_address_required'),
      })
      return false
    }
    pageOption.footer?.action(e)
    if (pageOption.name === 'newAddress') {
      rudderStack.eventTrigger({
        type: eventTypes.track,
        eventName: 'Address create new submit',
        payload: {
          lat: Number(addressDetails.latitude),
          lon: Number(addressDetails.longitude),
        },
      })
    } else {
      rudderStack.eventTrigger({
        type: eventTypes.track,
        eventName: 'Address Select Submit',
        payload: {
          lat: Number(addressDetails.latitude),
          lon: Number(addressDetails.longitude),
        },
      })
    }
    if (pinnedAddressDetails !== '') {
      const savedAddress = {
        ...JSON.parse(pinnedAddressDetails),
        cityId: JSON.parse(address)?.cityId,
      }

      localStorage.setItem('addressDetails', JSON.stringify(savedAddress))
      changeCitySubmitedState(true)
    }
  }

  return (
    <SearchBoxProvider>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        animation={'slideDown'}
        style={{width: '640px'}}
        backdropColor='var(--modal-backdrop)'
        disableCloseOnClickOutside
      >
        <ModalHeader title={pageOption.pageTitle} onClose={onCloseModal} />

        {!pageOption.pageTitle && (
          <TopMessage direction='column'>
            <Text scale='xlarge' weight='bold' colorName='carbon'>
              {t('core:location.selectAddress')}
            </Text>
            <Text scale='body' colorName='carbon' colorWeight='light'>
              {t('core:location.selectAddressDescription')}
            </Text>
          </TopMessage>
        )}

        {pageOption.name === 'list' && (
          <AddressList
            data={addressListData}
            changeStep={setStep}
            setActiveAddress={setActiveAddress}
            activeAddress={activeAddress}
            goToEdit={goToEdit}
            goToRemove={goToRemove}
            isCheckout={isCheckout}
          />
        )}

        {pageOption.mapType && (
          <Map
            type={pageOption.mapType}
            defaultQText={addressDetails.qText || ''}
            step={step}
            changeStep={handleChangeStep}
            activeId={addressDetails.id}
            activeLatitude={addressDetails.latitude}
            activeLongitude={addressDetails.longitude}
            cityId={String(addressDetails.cityId)}
            setAddressDetails={setAddressDetails}
            setIsOpenCities={setIsOpenCities}
            isOpenCities={isOpenCities}
            forwardedRef={mapRef}
          />
        )}

        <form onSubmit={onFormSubmit}>
          {['editAddressDetails', 'newAddressDetails'].includes(
            pageOption.name
          ) && (
            <AddressDetail>
              {pageOption.name === 'newAddressDetails' && (
                <section>
                  <Text
                    scale='caption'
                    weight='bold'
                    colorName='carbon'
                    colorWeight='light'
                  >
                    {t('core:location.form.selectAddress')}
                  </Text>
                  <Input
                    type='text'
                    name='autoAddress'
                    defaultValue={addressFormatted}
                    ref={autoAddressRef}
                    readOnly={true}
                    // editable={false}
                    // onChange={handleChangeDetails}
                    placeholder=' '
                  />
                </section>
              )}

              <section>
                <Text
                  scale='caption'
                  weight='bold'
                  colorName='carbon'
                  colorWeight='light'
                >
                  {t('core:location.form.addressDetail')}
                </Text>
                <Input
                  name='address'
                  defaultValue={addressDetails.address}
                  onChange={handleChangeDetails}
                  placeholder={t('core:location.form.addressDetailHolder')}
                  ref={addressDetailRef}
                  err={errorMessage.type === ErrorMessageType.ADDRESS_DETAIL}
                />
                {errorMessage.type === ErrorMessageType.ADDRESS_DETAIL && (
                  <FlexBox alignItems='center'>
                    <CircleErrorFillIcon width={12} />
                    &nbsp;
                    <Text scale='tiny' colorName='alert'>
                      {errorMessage.message}
                    </Text>
                  </FlexBox>
                )}
              </section>
              <section>
                <Text
                  scale='caption'
                  weight='bold'
                  colorName='carbon'
                  colorWeight='light'
                >
                  {t('core:location.form.addressLabel')}
                </Text>
                <Input
                  name='label'
                  defaultValue={String(addressDetails.label)}
                  onChange={handleChangeDetails}
                  placeholder=' '
                />
              </section>
              <section>
                <Text
                  scale='caption'
                  weight='bold'
                  colorName='carbon'
                  colorWeight='light'
                >
                  {t('core:location.form.phone')} (
                  {t('core:location.form.optional')})
                </Text>
                <Input
                  type='tel'
                  name='phone'
                  defaultValue={
                    addressDetails.phone?.replaceAll(' ', '') ||
                    userData?.cellphone.replaceAll(' ', '')
                  }
                  onChange={handleChangeDetails}
                  placeholder=' '
                />
                <Text
                  scale='caption'
                  weight='normal'
                  colorName='carbon'
                  colorWeight='light'
                >
                  {t('core:location.form.phoneHelp')}
                </Text>
              </section>
            </AddressDetail>
          )}

          {pageOption.footer && (
            <Footer
              title={pageOption.footer.title}
              isLoading={apiState.isLoading}
            />
          )}
        </form>
      </Modal>
    </SearchBoxProvider>
  )
}
export default AddressModal
