import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import dynamic from 'next/dynamic'
import {useAppDispatch} from '@redux'
import Link from 'next/link'
import styled from 'styled-components'
import {useTranslation} from 'react-i18next'
import {PendingOrder, Price, Product, Reorders} from '~order/types'
import {CTX, SimplePageComponent as SPC} from '@root/types'
import Reorder from '~order/components/Reorder'
import {getReorders, selectReorder} from '~order/redux/reorders'
import {getPendingOrders, selectPendingOrder} from '~order/redux/pendingOrders'
const PendingOrdersCard = dynamic(
  () => import('~order/components/PendingOrdersCard')
)

import {
  FlexBox,
  Text,
  Modal,
  Button,
  ReceiptIcon,
  PreorderIcon,
  RetryIcon,
  NotFound,
  Spinner,
  toPersian,
} from '@sf/design-system'
import {rem} from 'polished'

import {orderSideEffects} from '~order/helpers'

const OrderModal = styled(Modal)`
  position: absolute;
  left: 0;
  width: ${rem(368)};
  min-height: 100vh;
  padding: 0 ${({theme}) => theme.spacing[2]};
  overflow: auto;
  border-radius: 0;

  ::-webkit-scrollbar {
    width: 0;
  }
`
const ActiveOrderContainer = styled(FlexBox)`
  width: 100%;
  margin: ${rem(36)} 0 ${rem(52)};
`
const PendingOrdersContainer = styled(FlexBox)`
  width: 100%;
  height: ${rem(296)};
  margin-top: ${rem(12)};
  border: ${rem(1)} solid ${({theme}) => theme.carbon.alphaMedium};
  border-radius: ${rem(12)};
  box-shadow: ${({theme}) => theme.shadows.medium};

  > {
    &:last-child {
      border-bottom: 0;
    }
  }
`
const UserInfoContainer = styled(FlexBox)<{orderNumber: string}>`
  cursor: pointer;
  user-select: none;

  > * {
    margin-left: ${({theme}) => theme.spacing[1]};
  }

  &::before {
    position: relative;
    top: ${rem(-5)};
    right: ${rem(5)};
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${({theme}) => theme.spacing[2]};
    height: ${({theme}) => theme.spacing[2]};
    color: ${({theme}) => theme.surface.main};
    font-weight: ${({theme}) => theme.weight.bold};
    font-size: ${rem(12)};
    background-color: ${({theme}) => theme.accent.main};
    border-radius: 100%;
    content: ${({orderNumber}) =>
      orderNumber !== '0' ? `'${orderNumber}'` : false};
  }
`
const NoOrderContainer = styled.div`
  margin-top: 40vh;
  margin-right: auto;
  margin-left: auto;
  text-align: center;
`
const NoOrderCard = styled.div`
  margin-bottom: ${rem(60)};
`

export const Orders = () => {
  const dispatch = useAppDispatch()
  const reorders = useSelector(selectReorder)
  const pendingOrders = useSelector(selectPendingOrder)
  const [isOpen, setIsOpen] = useState(false)
  const {t} = useTranslation()

  const handleGetPreOrder = () => {
    if (!reorders || reorders.length < 1) {
      dispatch(getReorders({}))
    }
    dispatch(getPendingOrders({}))
    setIsOpen(true)
  }

  return (
    <>
      <UserInfoContainer
        orderNumber={
          pendingOrders?.length ? toPersian(pendingOrders.length) : '0'
        }
        id='profile-button'
        onClick={handleGetPreOrder}
      >
        <ReceiptIcon />
        <Text scale='body' weight='bold'>
          {t('order:reorderModal.orders')}
        </Text>
      </UserInfoContainer>
      <OrderModal
        isOpen={isOpen}
        onClose={() => setIsOpen(!isOpen)}
        animation='slideLeft'
        backdropColor='var(--modal-backdrop)'
      >
        {pendingOrders && pendingOrders.length > 0 && (
          <ActiveOrder pendingOrders={pendingOrders} />
        )}
        {reorders && reorders.length > 0 && (
          <Reorder reorders={reorders} setIsOpen={setIsOpen} />
        )}
        {(!reorders || !reorders.length) && (
          <NoOrderContainer>
            {!reorders ? (
              <Spinner />
            ) : !reorders.length ? (
              <React.Fragment>
                <NoOrderCard>
                  <NotFound />
                </NoOrderCard>
                <Text scale='body' colorName='inactive' colorWeight='dark'>
                  {t('order:reorderModal.noOrder')}
                </Text>
              </React.Fragment>
            ) : null}
          </NoOrderContainer>
        )}
      </OrderModal>
    </>
  )
}

export const ActiveOrder: SPC<{pendingOrders?: PendingOrder[]}> = ({
  pendingOrders,
}) => {
  const {t} = useTranslation()
  return (
    <ActiveOrderContainer direction='column'>
      <Text
        colorName='carbon'
        colorWeight='light'
        scale='caption'
        weight='bold'
      >
        {t('order:reorderModal.activeOrder')}
      </Text>

      {pendingOrders?.map((pendingOrder, index) => {
        return (
          <PendingOrdersContainer key={index} direction='column'>
            <PendingOrdersCard pendingOrder={pendingOrder} />
          </PendingOrdersContainer>
        )
      })}
    </ActiveOrderContainer>
  )
}

Orders.getInitialProps = async (ctx: CTX) => {
  orderSideEffects(ctx)
}
