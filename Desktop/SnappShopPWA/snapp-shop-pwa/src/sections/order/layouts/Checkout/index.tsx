import React, {FC} from 'react'
import {useRouter} from 'next/router'
import styled from 'styled-components'
import {StyledLayout} from '@root/Layout'
import {useTranslation} from 'react-i18next'
import {useRudderStack} from '@contexts/RudderStack'
import {eventTypes} from '@schema/rudderStack'
import {
  ChevronRightIcon,
  FlexBox,
  SnappShopIcon as TypeMarkIcon,
  Text,
  Grid,
  Button,
} from '@sf/design-system'
import {Footer} from '@root/Layout/Footer'

const Checkout = styled(StyledLayout)`
  min-height: 75vh;
  padding-top: ${({theme}) => theme.spacing[4]} !important;
`
const Header = styled(FlexBox)`
  width: 100%;
  height: auto;
  padding-bottom: ${({theme}) => theme.spacing[4]};
`
const Logo = styled(TypeMarkIcon)`
  cursor: pointer;
  fill: ${({theme}) => theme.accent.main};
`

const CheckoutLayout: FC = ({children, ...props}) => {
  const router = useRouter()

  const {t} = useTranslation()
  const rudderStack = useRudderStack()
  const goHome = () => router.push('/')

  const goBack = () => {
    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: 'Checkout Step back',
    })
    router.back()
  }

  return (
    <>
      <Checkout {...props}>
        <Header justify='center'>
          <Logo
            role='button'
            tabIndex={0}
            width='81'
            height='41'
            onClick={goHome}
          />
        </Header>
        <Grid container spacing={4}>
          <Grid item xs={1}></Grid>
          <Grid item xs={10}>
            <Button
              size='body'
              appearance='naked'
              colorName='carbon'
              onClick={goBack}
            >
              <ChevronRightIcon height={11} />
              <Text scale='body'>{t('basket.back')}</Text>
            </Button>
          </Grid>
        </Grid>
        {children}
      </Checkout>
      <Footer />
    </>
  )
}

export default CheckoutLayout
