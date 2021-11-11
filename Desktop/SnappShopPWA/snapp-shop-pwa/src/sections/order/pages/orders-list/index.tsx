import React, {useState, useEffect, useRef} from 'react'
import styled from 'styled-components'
import {useSelector} from 'react-redux'
import cookies from 'next-cookies'
import {rem} from 'polished'
import {useTranslation} from 'react-i18next'
import {FlexBox, Text, Spinner, Modal, NotFound} from '@sf/design-system'

import {isAPIResponse} from '@api'
import ProtectRoute from '@root/Guard'
import {DefaultLayout} from '@root/Layout'
import {Cookies, SimplePageComponent as SPC} from '@root/types'

import {useScrollEnd} from '@hooks/useScrollEnd'
import {useBodyColor} from '@hooks/useBodyColor'

import requests from '~order/endpoints'
import {
  listData,
  listResponse,
  isPrevOrderErrorResponse,
  OrderError,
  previousOrder,
  Product,
  Price,
  Reorders,
} from '~order/types'
import {orderSideEffects} from '~order/helpers'

import {useReorder} from '@hooks/useBasket'
import {ModalHeader} from '@components/ModalTools'
import PrevOrder from '~order/components/PrevOrder'
import BillInfo from '~order/components/BillInfo'
import ChooseAddressModal from '~order/components/ChooseAddressModal'
import {PROFILE_STATES} from '~search/components/Profile/SideNavBar'
import ProfileLayout from '~search/layout/profile-layout'
import {selectActiveAddressId} from '~growth/redux/location'

const PAGE_SIZE = 5

const Page = styled(DefaultLayout)`
  display: flex;
  justify-content: center;
  min-height: 80vh;
  padding-top: ${rem(60)};
`
const MainContainer = styled(ProfileLayout)`
  min-height: 80vh;
`
const Title = styled(FlexBox)`
  padding: ${rem(16)};
`
const Loading = styled.div`
  padding: ${({theme}) => theme.spacing[4]};
`
const NoOrder = styled(FlexBox)`
  margin-top: ${({theme}) => theme.spacing[8]};

  > {
    &:first-child {
      padding: ${({theme}) => theme.spacing[4]};
    }

    &:last-child {
      margin: ${({theme}) => `${theme.spacing[2]} 0`};
    }
  }
`

const fetchOrdersList = async (
  page: number,
  size: number,
  cookies?: Cookies
): Promise<{info?: listData; error?: OrderError}> => {
  try {
    const response = await requests.getOrdersList<listResponse>({
      params: {page, size, split_page: 1},
      cookies,
    })
    if (isAPIResponse(response)) {
      if (!isPrevOrderErrorResponse(response.data))
        return {info: response.data?.data}
      else return {error: response.data}
    }
    throw 'err'
  } catch (error) {
    return {
      error: {
        error: {code: -1, message: 'order:network-error'},
        status: false,
      },
    }
  }
}

const OrdersListPage: SPC<
  {info?: listData; error?: OrderError} | undefined
> = ({info}) => {
  const {t} = useTranslation()

  const handleReorder = useReorder()
  const activeAddress = useSelector(selectActiveAddressId)

  const [isEnd, setIsEnd] = useScrollEnd({
    threshold: 0.8,
    // node: node,
  })

  const modalInfo: {
    open: boolean
    order?: {products: Array<Product>; prices: Price}
    vendorTitle?: string
  } = {open: false}

  const orderRef = useRef<Reorders | previousOrder>()

  const [orderInfo, setOrderInfo] = useState(info)
  const [fetchingState, setFetchState] = useState('done')
  const [isLoading, setLoading] = useState(false)
  const [modalState, setModalState] = useState(modalInfo)
  const [isAddressOpen, setIsAddressOpen] = useState(false)

  useBodyColor('main')

  const fetchOrders = async (page: number, size: number) => {
    setLoading(true)
    const result = await fetchOrdersList(page, size)
    const currentOrders: Array<previousOrder> = orderInfo?.orders || []
    const orders: Array<previousOrder> = currentOrders.concat(
      result.info?.orders ?? []
    )
    if (result.info) {
      const newOrderInfo: listData = {
        ...result.info,
        orders,
      }
      setOrderInfo(newOrderInfo)
      setIsEnd(false)
    }

    setLoading(false)
  }

  const submitReorder = (reorder: Reorders | previousOrder) => {
    if (activeAddress == reorder.orderAddress.id) {
      handleReorder(reorder)
    } else {
      orderRef.current = reorder
      setIsAddressOpen(true)
    }
  }
  const onClickBill = (
    products: Product[],
    prices: Price,
    vendorTitle: string
  ) => {
    setModalState({
      open: true,
      order: {products, prices},
      vendorTitle,
    })
  }
  const submitCurrentAddress = () => {
    if (!orderRef.current) return
    handleReorder(orderRef.current, activeAddress)
    setIsAddressOpen(false)
    orderRef.current = undefined
  }
  const submitBasketAddress = () => {
    if (!orderRef.current) return
    handleReorder(orderRef.current, orderRef.current.orderAddress.id)
    setIsAddressOpen(false)
    orderRef.current = undefined
  }

  useEffect(() => {
    if (!orderInfo) {
      setFetchState('loading')
      fetchOrders(0, PAGE_SIZE)
    } else if (!orderInfo.orders.length) {
      setFetchState('no-order')
    } else {
      setFetchState('done')
    }
  }, [orderInfo])

  useEffect(() => {
    if (isEnd && orderInfo && orderInfo.orders.length < orderInfo.count) {
      const page = Math.floor(orderInfo.orders.length / orderInfo.pageSize)
      fetchOrders(page, PAGE_SIZE)
    }
  }, [isEnd])

  return (
    <React.Fragment>
      <Modal
        isOpen={Boolean(modalState.open && modalState.order)}
        onClose={() => setModalState({open: false})}
        animation={'slideDown'}
        style={{width: '640px', overflow: 'auto', position: 'sticky', top: 0}}
        backdropColor='var(--modal-backdrop)'
      >
        <ModalHeader title={''} onClose={() => setModalState({open: false})} />
        {modalState.order ? (
          <BillInfo
            products={modalState?.order?.products ?? []}
            prices={modalState.order.prices}
            isOpenedAsModal
            vendorName={modalState.vendorTitle}
          />
        ) : null}
      </Modal>
      <Page>
        <MainContainer defaultStep={PROFILE_STATES.ORDERS}>
          {/* <Grid container spacing={4}> */}

          <Title justify='flex-start' alignItems='center'>
            <Text
              scale='default'
              weight='bold'
              colorName='carbon'
              colorWeight='light'
            >
              {t('profile.side-bar.my-orders')}
            </Text>
          </Title>
          {fetchingState === 'done' ? (
            orderInfo?.orders?.map(order => (
              <PrevOrder
                key={order.orderCode}
                order={order}
                onClickBill={onClickBill}
                submitReorder={submitReorder}
              />
            ))
          ) : fetchingState === 'no-order' ? (
            <NoOrder alignItems='center' direction='column'>
              <NotFound />
              <Text scale='body' colorName='inactive' colorWeight='dark'>
                {t('profile.no_order')}
              </Text>
            </NoOrder>
          ) : null}
          <Loading>{isLoading && <Spinner />}</Loading>
        </MainContainer>
        {fetchingState === 'done' && (
          <ChooseAddressModal
            isAddressOpen={isAddressOpen}
            setIsAddressOpen={setIsAddressOpen}
            submitCurrentAddress={submitCurrentAddress}
            submitBasketAddress={submitBasketAddress}
          />
        )}
      </Page>
    </React.Fragment>
  )
}

OrdersListPage.getInitialProps = async ctx => {
  const {isServer} = ctx
  orderSideEffects(ctx)
  // fetch orders list
  if (isServer) {
    const allCookies = cookies(ctx)
    const props = await fetchOrdersList(0, PAGE_SIZE, allCookies)
    return props
  }
}

export default ProtectRoute(OrdersListPage)
