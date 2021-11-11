import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import Link from 'next/link'
import {useTranslation} from 'react-i18next'
import {selectUser} from '@slices/core'
import {selectPubSubToken} from '~order/redux/pendingOrders'
import {isAPIResponse} from '@api'
import useMQTT from '@hooks/useMQTT'
import requests from '~order/endpoints'
import styled from 'styled-components'
import {Cookies, SimplePageComponent as SPC} from '@root/types'

import OrderStatus from '~order/components/OrderStatus'
import BillInfo from '~order/components/BillInfo'
import {ModalHeader} from '@components/ModalTools'
import {
  ErrorProp,
  Info,
  isOrderErrorResponse,
  OrderStatusResponse,
  PendingOrder,
} from '~order/types'
import {
  FlexBox,
  Text,
  TimeIcon,
  PinOutlineIcon,
  CalendarIcon,
  Grid,
  Button,
  Modal,
  Spinner,
} from '@sf/design-system'
import {rem} from 'polished'
import {PRIMARY_STATE, SECONDARY_STATE} from '~order/constants'

const Header = styled(FlexBox)`
  width: 100%;
  margin: ${({theme}) => theme.spacing[2]} 0;
`
const DateTimeIcons = styled.div`
  margin-left: ${rem(4)};
  vertical-align: middle;

  > * {
    width: ${rem(14)};
    height: ${rem(14)};
    fill: ${({theme}) => theme.inactive.light};
    fill-opacity: 1;
  }
`
const DateTimeText = styled(Text)`
  margin-left: ${({theme}) => theme.spacing[1]};
`
const VendorLogo = styled.img`
  width: ${({theme}) => theme.spacing[7]};
  height: ${({theme}) => theme.spacing[7]};
  margin-right: ${({theme}) => theme.spacing[2]};
  overflow: hidden;
  border-radius: ${rem(4)};
  cursor: pointer;
`
const BillContainer = styled(Grid)`
  padding-left: ${({theme}) => theme.spacing[1]};
`
const FollowUpContainer = styled(Grid)`
  padding-right: ${({theme}) => theme.spacing[1]};
`
const BillModal = styled(Modal)`
  min-width: ${rem(400)};
`
const DateTimeContainer = styled(FlexBox)`
  margin-top: ${rem(10)};
  margin-right: ${({theme}) => theme.spacing[2]};
`
const VendorName = styled(Text)`
  margin-right: ${({theme}) => theme.spacing[2]};
`
const SpinnerContainer = styled.div`
  margin-top: ${rem(100)};
`
const ButtonsContainer = styled(Grid)`
  margin: ${({theme}) => theme.spacing[2]} 0;
  padding: 0 ${({theme}) => theme.spacing[2]};
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
const PendingOrdersCard: SPC<{pendingOrder: PendingOrder}> = ({
  pendingOrder,
}) => {
  const [info, setInfo] = useState<Info | undefined>(undefined)
  const [error, setError] = useState<ErrorProp | undefined>(undefined)
  const [isOpen, setIsOpen] = useState(false)

  const {t} = useTranslation()

  const fetchOrder = async () => {
    const result = await fetchOrderState(pendingOrder?.code as string)
    setInfo(result?.info)
    setError(result?.error)
  }
  useEffect(() => {
    fetchOrder()
  }, [])

  return (
    <>
      <Header>
        <Link
          href={`/${pendingOrder.superTypeAlias.toLowerCase()}/menu/${
            pendingOrder.vendorCode
          }`}
        >
          <FlexBox>
            <VendorLogo
              src={pendingOrder?.vendorLogo}
              alt='vendor-logo-pendingOrder'
            />
          </FlexBox>
        </Link>
        <FlexBox direction='column' style={{alignSelf: 'center'}}>
          <Link
            href={`/${pendingOrder.superTypeAlias.toLowerCase()}/menu/${
              pendingOrder.vendorCode
            }`}
          >
            <VendorName scale='body' weight='bold' colorName='carbon'>
              {pendingOrder?.vendor}
            </VendorName>
          </Link>
          {info && (
            <DateTimeContainer direction='row' alignItems='center' wrap='wrap'>
              <DateTimeIcons>
                <CalendarIcon />
              </DateTimeIcons>
              <DateTimeText
                scale='caption'
                as='span'
                colorName='carbon'
                colorWeight='light'
              >
                {info.order && info.order.jalaliStartedAt}
              </DateTimeText>
              <DateTimeIcons>
                <TimeIcon />
              </DateTimeIcons>
              <DateTimeText
                scale='caption'
                as='span'
                colorName='carbon'
                colorWeight='light'
              >
                {pendingOrder.createdAt}
                {/*{formatTime(new Date(pendingOrder?.startedAt))}*/}
              </DateTimeText>
              <DateTimeIcons>
                <PinOutlineIcon />
              </DateTimeIcons>
              <DateTimeText
                numeric={false}
                scale='caption'
                as='span'
                colorName='carbon'
                colorWeight='light'
              >
                {pendingOrder?.addressLabel}
              </DateTimeText>
            </DateTimeContainer>
          )}
        </FlexBox>
      </Header>
      {info ? (
        <>
          <OrderStatusContainer
            info={info}
            error={error}
            pendingOrder={pendingOrder}
          />
          <ButtonsContainer container>
            <BillContainer item xs={6}>
              <Button
                block
                colorName='carbon'
                appearance='ghost'
                onClick={() => setIsOpen(true)}
              >
                {t('order:reorderModal.seeBill')}
              </Button>
            </BillContainer>
            <FollowUpContainer item xs={6}>
              <Link href={`/follow-order/${pendingOrder.code}`}>
                <Button block>{t('order:reorderModal.followOrder')}</Button>
              </Link>
            </FollowUpContainer>
          </ButtonsContainer>
        </>
      ) : (
        <SpinnerContainer>
          <Spinner />
        </SpinnerContainer>
      )}
      {info && (
        <BillModal
          isOpen={isOpen}
          onClose={() => setIsOpen(!isOpen)}
          animation='slideDown'
          backdropColor='var(--modal-backdrop)'
          hasBackdrop={true}
          id='pendingOrderBillModal'
        >
          <ModalHeader onClose={() => setIsOpen(false)} />
          <BillInfo
            description={info?.order.description}
            products={info?.products}
            prices={info?.prices}
            isOpenedAsModal
            vendorName={info.vendor.name}
          />
        </BillModal>
      )}
    </>
  )
}

export const OrderStatusContainer: SPC<{
  info?: Info
  error?: ErrorProp
  pendingOrder: PendingOrder
}> = ({info, error, pendingOrder}) => {
  const [orderInfo, setOrderInfo] = useState(info)
  const [orderError, setOrderError] = useState(error)
  const subToken = useSelector(selectPubSubToken)
  const fetchOrder = async () => {
    const result = await fetchOrderState(pendingOrder.code as string)
    setOrderInfo(result.info)
    setOrderError(result.error)
  }
  const getNewState = () => {
    fetchOrder()
  }

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
        onExpire: () => {},
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
  const token = subToken
  const {code: orderCode, primaryState} = pendingOrder
  useMQTT(getNewState, {
    primaryState,
    username,
    orderCode,
    token,
  })
  return (
    <>
      {orderInfo && (
        <OrderStatus
          counterConfig={counterConfig}
          newTypeTitle={orderInfo.vendor.newTypeTitle}
          primaryState={orderInfo.primaryState}
          secondaryState={orderInfo.secondaryState}
          isExpress={orderInfo.expedition.isExpress}
          isDelay={orderInfo?.order.isDelay}
          isBase={true}
          preOrder={orderInfo?.order?.preOrder}
        />
      )}
    </>
  )
}

export default PendingOrdersCard
