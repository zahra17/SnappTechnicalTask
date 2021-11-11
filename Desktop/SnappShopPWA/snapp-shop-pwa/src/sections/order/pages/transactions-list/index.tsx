import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import cookies from 'next-cookies'
import {rem} from 'polished'
import {useTranslation} from 'react-i18next'
import {FlexBox, Text, Spinner, NotFound} from '@sf/design-system'

import {isAPIResponse} from '@api'
import ProtectRoute from '@root/Guard'
import {DefaultLayout} from '@root/Layout'
import {Cookies, SimplePageComponent as SPC} from '@root/types'

import {useScrollEnd} from '@hooks/useScrollEnd'
import {useBodyColor} from '@hooks/useBodyColor'

import requests from '~order/endpoints'
import {
  transactionsListData,
  transactionsListResponse,
  payment,
  OrderError,
  FetchStates,
} from '~order/types'
import {orderSideEffects} from '~order/helpers'

import {PROFILE_STATES} from '~search/components/Profile/SideNavBar'
import ProfileLayout from '~search/layout/profile-layout'
import TransactionCard from '~order/components/TransactionCard'

const PAGE_SIZE = 10

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
const Caption = styled(FlexBox)`
  padding: ${({theme}) => theme.spacing[2]};
`
const Loading = styled.div`
  padding: ${({theme}) => theme.spacing[4]};
`
const NoTransaction = styled(FlexBox)`
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

const fetchTransactionsList = async (
  page: number,
  size: number,
  cookies?: Cookies
): Promise<{info?: transactionsListData; error?: OrderError}> => {
  try {
    const response = await requests.getTransactionsList<transactionsListResponse>(
      {
        params: {page, pageSize: size, wallet: 1},
        cookies,
      }
    )
    if (isAPIResponse(response)) {
      return {info: response.data?.data}
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

const TransactionsListPage: SPC<
  {info?: transactionsListData; error?: OrderError} | undefined
> = ({info}) => {
  const {t} = useTranslation()

  const [isEnd, setIsEnd] = useScrollEnd({
    threshold: 0.8,
    // node: node,
  })

  const [transactionInfo, setTransactionInfo] = useState(info)
  const [fetchingState, setFetchState] = useState(FetchStates.DONE)
  const [isLoading, setLoading] = useState(false)

  useBodyColor('main')

  const fetchTransactions = async (page: number, size: number) => {
    setLoading(true)
    const result = await fetchTransactionsList(page, size)
    const currentPayments: Array<payment> = transactionInfo?.payments || []
    const payments: Array<payment> = currentPayments.concat(
      result.info?.payments ?? []
    )
    if (!payments.length) setFetchState(FetchStates.NO_TRANSACTION)
    if (result.info) {
      const newOrderInfo: transactionsListData = {
        ...result.info,
        payments,
      }
      setTransactionInfo(newOrderInfo)
      setIsEnd(false)
    }

    setLoading(false)
  }

  useEffect(() => {
    if (!transactionInfo) {
      setFetchState(FetchStates.LOADING)
      fetchTransactions(0, PAGE_SIZE)
    } else if (!transactionInfo.payments.length) {
      setFetchState(FetchStates.NO_TRANSACTION)
    } else {
      setFetchState(FetchStates.DONE)
    }
  }, [transactionInfo])

  useEffect(() => {
    if (
      isEnd &&
      transactionInfo &&
      transactionInfo.payments.length < transactionInfo.count
    ) {
      const page = Math.floor(transactionInfo.payments.length / PAGE_SIZE)
      fetchTransactions(page, PAGE_SIZE)
    }
  }, [isEnd])

  return (
    <React.Fragment>
      <Page>
        <MainContainer defaultStep={PROFILE_STATES.TRANSACTIONS}>
          {/* <Grid container spacing={4}> */}

          <Title justify='flex-start' alignItems='center'>
            <Text
              scale='default'
              weight='bold'
              colorName='carbon'
              colorWeight='light'
            >
              {t('user_profile.transactions_list')}
            </Text>
          </Title>
          {fetchingState === FetchStates.DONE ? (
            <>
              <Caption>
                <Text scale='body'>
                  {t('user_profile.transactions_list_caption')}
                </Text>
              </Caption>
              {transactionInfo?.payments?.map(payment => (
                <TransactionCard
                  key={payment.updatedAt.date}
                  payment={payment}
                />
              ))}
            </>
          ) : fetchingState === FetchStates.NO_TRANSACTION ? (
            <NoTransaction alignItems='center' direction='column'>
              <NotFound />
              <Text scale='body' colorName='inactive' colorWeight='dark'>
                {t('profile.no_transaction')}
              </Text>
            </NoTransaction>
          ) : null}
          <Loading>{isLoading && <Spinner />}</Loading>
        </MainContainer>
      </Page>
    </React.Fragment>
  )
}

TransactionsListPage.getInitialProps = async ctx => {
  const {isServer} = ctx
  orderSideEffects(ctx)
  // fetch transactions list
  if (isServer) {
    const allCookies = cookies(ctx)
    const props = await fetchTransactionsList(0, PAGE_SIZE, allCookies)
    return props
  }
}

export default ProtectRoute(TransactionsListPage)
