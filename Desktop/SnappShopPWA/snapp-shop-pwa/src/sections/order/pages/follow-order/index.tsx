import React, {useEffect, useState, useRef} from 'react'
import {useAppDispatch} from '@redux'
import {useRouter} from 'next/router'
import {useSelector} from 'react-redux'
import styled from 'styled-components'
import {useTranslation} from 'react-i18next'
import cookies from 'next-cookies'
import {rem} from 'polished'
import {FlexBox, Grid, Spinner, Text} from '@sf/design-system'
import {isAPIResponse} from '@api'
import {Cookies} from '@root/types'
import {SimplePageComponent as SPC} from '@root/types'
import {Img} from '@components/Img'
import OrderStatus from '~order/components/OrderStatus'
import BillInfo from '~order/components/BillInfo'
import Map from '@components/Map'
import {formatTime} from '@utils'
import {orderSideEffects} from '~order/helpers'
import requests from '~order/endpoints'
import Marker from '@components/Map/Marker'
import {
  isOrderErrorResponse,
  ErrorProp,
  Info,
  OrderStatusResponse,
} from '~order/types'
import {DefaultLayout} from '@root/Layout'
import {PRIMARY_STATE, SECONDARY_STATE} from '~order/constants'
import BikerInfo from '~order/components/BikerInfo'
import DeliveryButton from '~order/components/DeliveryButtons'
import CustomPin from '@components/CustomPin'
import useMQTT from '@hooks/useMQTT'
import {selectUser} from '@slices/core'
import {getPendingOrders} from '~order/redux/pendingOrders'

const pinBikerIconUrl = '/static/images/biker-pin.svg'
const pinCustomerIconUrl = '/static/images/destination_pin.svg'

const Page = styled(DefaultLayout)`
  min-height: 80vh;
  padding-top: ${rem(60)};

  > * {
    width: 100%;
  }
`
const Header = styled(FlexBox)`
  box-sizing: border-box;
  height: ${rem(80)};
  padding: 0 ${({theme}) => theme.spacing[2]};
  border-bottom: ${rem(1)} solid ${({theme}) => theme.carbon.alphaMedium};
`
const Titles = styled(FlexBox)`
  > * {
    max-width: 25vw;
    margin: ${rem(3)} ${({theme}) => theme.spacing[2]};
  }
`
const Container = styled(FlexBox)`
  margin-bottom: ${({theme}) => theme.spacing[3]};
  border: ${rem(1)} solid ${({theme}) => theme.carbon.alphaLight};
  border-radius: ${rem(8)};
`
const MapContainer = styled(FlexBox)`
  height: ${rem(495)};
  margin-top: ${({theme}) => theme.spacing[1]};
  overflow: hidden;
  border-radius: 0 0 ${rem(8)} ${rem(8)};

  > {
    &:first-child {
      width: 100%;
    }
  }
`
const fetchOrderState = async (
  orderCode: string,
  cookies?: Cookies
): Promise<{info?: Info; error?: ErrorProp}> => {
  try {
    const response = await requests.getOrderStatus<OrderStatusResponse>({
      params: {orderCode},
      cookies,
    })
    if (isAPIResponse(response)) {
      if (!isOrderErrorResponse(response.data)) {
        return {info: response.data}
      } else {
        return {error: response.data.error}
      }
    }
    throw 'err'
  } catch (error) {
    return {
      error: {code: -1, message: 'order:network-error'},
    }
  }
}

interface BikerType {
  cellphone: string
  lat: string
  long: string
  name: string
  photo: string
  status: boolean
}

const FollowOrderPage: SPC<{info?: Info; error?: ErrorProp} | undefined> = ({
  info,
  error,
}) => {
  const {t} = useTranslation()

  const [orderInfo, setOrderInfo] = useState(info)
  const [orderError, setOrderError] = useState(error)
  const router = useRouter()
  const bikerIntervalRef = useRef(0)
  const [bikerState, setBikerState] = useState<BikerType | undefined>(undefined)
  const dispatch = useAppDispatch()

  const fetchOrder = async () => {
    const result = await fetchOrderState(router.query.orderCode as string)
    setOrderInfo(result.info)
    setOrderError(result.error)
  }

  async function getBikerLocation(orderCode: string, bikerId: number) {
    try {
      const response = await requests.getBikerLocation<BikerType | undefined>({
        data: {orderCode, bikerId},
      })
      if (isAPIResponse(response)) {
        setBikerState(response.data)
        return response.data
      }
      throw {message: 'err'}
    } catch (err) {
      console.log('err in catch (getBikerLocation)', err)
    }
  }

  const getNewState = () => fetchOrder()

  // CSR Fetch order Information
  useEffect(() => {
    dispatch(getPendingOrders({}))
    if (!info) fetchOrder()
  }, [])

  // Handle biker
  useEffect(() => {
    if (!orderInfo?.order) return

    const {order, expedition, biker} = orderInfo

    const {isExpress} = expedition
    const {id, showBiker} = biker

    const removeBiker = () => {
      clearInterval(bikerIntervalRef.current)
      setBikerState(undefined)
    }

    if (isExpress && showBiker) {
      getBikerLocation(order.orderCode, id)

      clearInterval(bikerIntervalRef.current)
      // bikerIntervalRef.current = setInterval(() => {
      //   const now = new Date().getTime()
      //   const timeCondition = now - deliveredTime < 60 * 10 * 1000
      //   if (!timeCondition) removeBiker()
      //   getBikerLocation(order.orderCode, id)
      // }, 10000)
      getBikerLocation(order.orderCode, id)
    } else {
      removeBiker()
    }
  }, [orderInfo])

  const counterConfig = React.useMemo(() => {
    if (orderInfo) {
      const {primaryState, secondaryState} = orderInfo
      const {deliveredAt, isDelay} = orderInfo.order
      const {isExpress} = orderInfo.expedition

      const timerExpired =
        Number(new Date()) - Number(new Date(deliveredAt).getTime()) > 0
      const on_support = secondaryState === SECONDARY_STATE.DELAYED
      const newEstimate = isDelay && !timerExpired && !on_support && isExpress

      const bikerHasProblem =
        secondaryState === SECONDARY_STATE.BIKER_NEED_FOR_CALL

      const date = new Date(deliveredAt.replace(/(:?\d{2})$/, ':$1')) as Date
      if (Number.isNaN(date.valueOf())) console.log('problem in time')

      return {
        show:
          [PRIMARY_STATE.PREPARATION, PRIMARY_STATE.BIKER_IN_ROUTE].includes(
            primaryState
          ) &&
          (!bikerHasProblem || !isDelay) &&
          !(on_support && !isExpress) &&
          !timerExpired,
        deliveredAt: date.getTime(),
        newEstimate,
        onExpire: getNewState,
      }
    }
  }, [orderInfo]) ?? {
    show: false,
    deliveredAt: 0,
    newEstimate: false,
    onExpire: () => {},
  }

  const user = useSelector(selectUser)
  const {username} = user || {}
  const orderCode = router.query.orderCode as string
  const {primaryState, pub_sub_token: token} = orderInfo || {}

  useMQTT(getNewState, {
    primaryState,
    username,
    orderCode,
    token,
  })

  return (
    <Page>
      {orderInfo ? (
        <Grid container spacing={4}>
          <Grid item xs={1} />
          <Grid item xs={7}>
            <Container direction='column'>
              {/* Logo & name & address & & time */}
              <Header justify='space-between' alignItems='center'>
                <FlexBox alignItems='center'>
                  <Img
                    src={orderInfo.vendor.logo}
                    alt={'restaurant_logo'}
                    width='48'
                    height='48'
                  />
                  <Titles
                    direction='column'
                    justify='center'
                    alignItems='flex-start'
                  >
                    <Text as='span' scale='body' weight='bold' ellipsis>
                      {orderInfo.vendor.name}
                    </Text>
                    <Text as='span' scale='body' ellipsis>
                      {t('order:followOrder.customerAddress', {
                        label: orderInfo.customerAddress.label,
                        customerAddress: orderInfo.customerAddress.address,
                      })}
                    </Text>
                  </Titles>
                </FlexBox>
                <Text scale='body' as='span' colorWeight='light'>
                  {t('order:followOrder.time', {
                    day: orderInfo.order.jalaliStartedAt.replace('،', ''),
                    time: formatTime(new Date(orderInfo.order.startedAt)),
                  })}
                </Text>
              </Header>
              {/* order state (Text) & order state (Graph) */}
              <OrderStatus
                counterConfig={counterConfig}
                newTypeTitle={orderInfo.vendor.newTypeTitle}
                primaryState={orderInfo.primaryState}
                secondaryState={orderInfo.secondaryState}
                isExpress={orderInfo.expedition.isExpress}
                isDelay={orderInfo.order.isDelay}
                preOrder={orderInfo?.order?.preOrder}
              />
              {/* Biker's image & name & mobile */}
              {!!orderInfo.biker.cellphone && (
                <BikerInfo biker={orderInfo.biker} />
              )}
              {/* extra delivery info button */}
              {!Array.isArray(orderInfo.buttons) &&
              orderInfo.buttons.buttons.length ? (
                <DeliveryButton
                  buttons={orderInfo.buttons}
                  orderCode={orderInfo.order.orderCode}
                  fetchOrder={fetchOrder}
                />
              ) : (
                ''
              )}
              {/* location of vendor & customer & biker */}
              <MapContainer>
                {orderInfo.vendor && (
                  <Map
                    height='100%'
                    dragging={true}
                    center={[
                      orderInfo.vendor.latitude,
                      orderInfo.vendor.longitude,
                    ]}
                  >
                    {/***** VENDOR ****/}
                    <Marker
                      position={{
                        lat: orderInfo.vendor.latitude,
                        lng: orderInfo.vendor.longitude,
                      }}
                      divIcon={<CustomPin vendorName={orderInfo.vendor.name} />}
                    />
                    {/***** CUSTOMER ****/}
                    <Marker
                      position={{
                        lat: orderInfo.customerAddress.latitude,
                        lng: orderInfo.customerAddress.longitude,
                      }}
                      iconConfig={{
                        iconUrl: pinCustomerIconUrl,
                        iconRetinaUrl: pinCustomerIconUrl,
                        iconSize: [85, 75],
                        iconAnchor: [62, 64],
                      }}
                    />
                    {/***** BIKER ****/}
                    {bikerState &&
                      +bikerState.lat !== -1 &&
                      +bikerState.long !== -1 && (
                        <Marker
                          position={{
                            lat: bikerState.lat,
                            lng: bikerState.long,
                          }}
                          iconConfig={{
                            iconUrl: pinBikerIconUrl,
                            iconRetinaUrl: pinBikerIconUrl,
                            iconSize: [60, 75],
                            iconAnchor: [30, 35],
                          }}
                        />
                      )}
                  </Map>
                )}
              </MapContainer>
            </Container>
          </Grid>
          <Grid item xs={3}>
            <BillInfo
              description={orderInfo.order.description}
              products={orderInfo.products}
              prices={orderInfo.prices}
            />
          </Grid>
          <Grid item xs={1} />
        </Grid>
      ) : orderError && orderError.message !== 'order:network-error' ? (
        <FlexBox justify='center' alignItems='center'>
          {orderError.message}
        </FlexBox>
      ) : (
        <FlexBox justify='center' alignItems='center'>
          <Spinner />
        </FlexBox>
      )}
    </Page>
  )
}

FollowOrderPage.getInitialProps = async ctx => {
  const {isServer, query} = ctx
  orderSideEffects(ctx)

  // fetch orderStatus
  if (isServer) {
    const orderCode = query.orderCode as string

    if (orderCode) {
      const allCookies = cookies(ctx)
      const props = await fetchOrderState(orderCode, allCookies)
      return props
    }
  }
}

export default FollowOrderPage
