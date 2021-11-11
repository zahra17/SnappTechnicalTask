import React, {useEffect, useState} from 'react'
import styled, {useTheme} from 'styled-components'
import {useRouter} from 'next/router'
import {useTranslation} from 'react-i18next'
import {orderSideEffects} from '~order/helpers'
import Link from 'next/link'
import {SimplePageComponent} from '@root/types'
import {rem} from 'polished'

import {
  Button,
  Price,
  PaymentSuccess,
  Text,
  FlexBox,
  Grid,
  PaymentFailed,
  SnappShopIcon as TypeMarkIcon,
} from '@sf/design-system'
import {PaymentTypeName} from '@schema/basket'

const Container = styled(FlexBox)`
  padding: ${({theme}) => theme.spacing[2]};
`
const Spacer = styled.div`
  width: 100%;
  height: ${rem(60)};
`
const DetailContainer = styled.div`
  width: 100%;
  margin: ${rem(24)} 0;
  border-radius: ${rem(8)};
  box-shadow: ${({theme}) => theme.shadows.medium};

  > {
    &:first-child {
      border-bottom: ${rem(1)} solid ${({theme}) => theme.carbon.alphaLight};
    }
  }
`
const Detail = styled(FlexBox)`
  width: 100%;
  padding: ${rem(18)} 0;

  > {
    &:first-child {
      flex: 1;
      padding-right: ${({theme}) => theme.spacing[2]};
    }

    &:last-child {
      padding-left: ${({theme}) => theme.spacing[2]};
    }
  }
`
const OrderInvoice: SimplePageComponent = () => {
  const {t} = useTranslation()
  const router = useRouter()
  const theme = useTheme()
  const status = !router.pathname.includes('failed')
  const amount = router.query?.paymentAmount as string
  const paymentType = router.query['payment_type'] // as PaymentTypeName
  const orderCode = router.query.orderCode
  const [type, setType] = useState('')
  const [title, setTitle] = useState('')
  useEffect(() => {
    if (paymentType) {
      if (paymentType === 'ORDER' || paymentType === '') setType('bankGate')
      if (paymentType === 'cash') setType('cash')
      if (paymentType === 'debit') setType('apPay')
      if (paymentType === 'credit') setType('creditPay')
    } else {
      setType('bankGate')
    }
    if (status) {
      if (paymentType === 'cash') setTitle('order:orderInvoice.cashSuccess')
      else setTitle('order:orderInvoice.success')
    } else {
      setTitle('order:orderInvoice.onlineFailed')
    }
  }, [])
  useEffect(() => {
    let timeout: any
    if (status) {
      timeout = setTimeout(() => {
        router.push(`/follow-order/${orderCode}`)
      }, 8000)
    }

    return () => clearTimeout(timeout)
  }, [])
  return (
    <Grid container>
      <Grid item xs={4} />
      <Grid item xs={4}>
        <Container alignItems='center' direction='column'>
          <Link href={'/'}>
            <TypeMarkIcon fill={theme.accent.main} />
          </Link>
          <Spacer />
          <Spacer />
          {status ? <PaymentSuccess /> : <PaymentFailed />}
          <Spacer />
          <Text
            as='span'
            scale='large'
            weight='bold'
            height='fit-content'
            align='center'
            margin='0 0 24px'
          >
            {t(title)}
          </Text>
          {!status && (
            <Text scale='body' colorName='carbon' align='center'>
              {t('order:orderInvoice.detailFailed')}
            </Text>
          )}
          {status ? (
            <DetailContainer>
              <Detail>
                <Text as='span' scale='body'>
                  {t('order:orderInvoice.amountSuccess')}
                </Text>
                <Price
                  scale='body'
                  value={amount ? +amount : 0}
                  weight='bold'
                />
              </Detail>
              <Detail>
                <Text as='span' scale='body'>
                  {t('order:orderInvoice.type')}
                </Text>
                <Text as='span' scale='body' weight='bold'>
                  {t(`order:orderInvoice.${type}`)}
                </Text>
              </Detail>
            </DetailContainer>
          ) : (
            <DetailContainer>
              <Detail>
                <Text as='span' scale='body'>
                  {t('order:orderInvoice.trackId')}
                </Text>
                <Text scale='body' weight='bold' numeric={false}>
                  {orderCode}
                </Text>
              </Detail>
              <Detail>
                <Text as='span' scale='body'>
                  {t('order:orderInvoice.amountFailed')}
                </Text>
                <Price
                  scale='body'
                  value={amount ? +amount : 0}
                  weight='bold'
                />
              </Detail>
            </DetailContainer>
          )}

          {!status && (
            <Button
              block
              onClick={() => {
                router.push('/')
              }}
            >
              {t('order:orderInvoice.returnHome')}
            </Button>
          )}
          {status && (
            <Text scale='caption' colorName='carbon' colorWeight='light'>
              {t('order:orderInvoice.redirecting')}
            </Text>
          )}
        </Container>
      </Grid>
      <Grid item xs={4} />
    </Grid>
  )
}
OrderInvoice.getInitialProps = async ctx => {
  orderSideEffects(ctx)
}
export default OrderInvoice
