import React, {useRef, useState} from 'react'
import styled from 'styled-components'
import {SimplePageComponent} from '@root/types'
import searchSideEffects from '~search/helpers'
import {
  actions,
  getHomeData,
  selectAllSections,
  selectHomeSclie,
} from '~search/redux/home'
import {useSelector} from 'react-redux'

import {useAppDispatch} from '@redux'
import {SearchLayout} from '~search/layout'

import {HomeSections} from '~search/components/Home/HomeSections'
import {selectLocation} from '~growth/redux/location'
import {Spinner, Toast} from '@sf/design-system'
import {Footer} from '@root/Layout/Footer'
import {useTranslation} from 'react-i18next'
import {useRouter} from 'next/router'

import {CustomHead} from '@components/CustomHead'
import {PageTypes} from '@schema/seo'
import {useRudderStack} from '@contexts/RudderStack'
import {eventTypes} from '@schema/rudderStack'
import {LatLong} from '@schema/location'
import {HOME_SECTION_TYPE} from '~search/types'
import {SHOP_OPTIONS} from '~search/utils/constants'

const Page = styled(SearchLayout)`
  min-height: 100vh;
  padding: ${({theme}) => theme.spacing[5]};

  > div > * {
    margin-bottom: ${({theme}) => theme.spacing[4]};
  }

  > div > :first-child {
    margin-bottom: ${({theme}) => theme.spacing[8]};
  }
`
const Loading = styled.div`
  padding: ${({theme}) => theme.spacing[4]};
`
const Home: SimplePageComponent<{serverActiveLocation: LatLong}> = ({
  serverActiveLocation,
}) => {
  const {t} = useTranslation()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const {cacheKey, isLoading} = useSelector(selectHomeSclie)
  const {activeLocation} = useSelector(selectLocation)
  const [paymentStatus, setPaymentStatus] = useState('')
  const newCacheKey = `lat=${+activeLocation.lat}&long=${+activeLocation.long}`
  const sections = useSelector(selectAllSections)
  console.log({sections})
  if (
    sections.length > 1 &&
    !sections.find(item => item.type === HOME_SECTION_TYPE.SHOP_DELIVERY)
  ) {
    sections.splice(1, 0, {
      type: HOME_SECTION_TYPE.SHOP_DELIVERY,
      id: 0,
      front_id: 'shop_delivery_options',
      data: SHOP_OPTIONS,
    })
  }

  /*if (response.data.data?.result?.length > 1) {
          response.data.data.result.splice(1, 0, {
            type: HOME_SECTION_TYPE.SHOP_DELIVERY,
            id: 0,
            front_id: 'shop_delivery_options',
            data: SHOP_OPTIONS,
          })
        }*/

  React.useEffect(() => {
    if (router.query['reset-scroll'] && window) {
      window.scroll(0, 0)
    }
    dispatch(actions.viewHome())
    if (!sections.length || newCacheKey !== cacheKey) {
      window.scroll(0, 0)
      dispatch(
        getHomeData({
          lat: +activeLocation.lat,
          long: +activeLocation.long,
          cacheKey: newCacheKey,
        })
      )
    }
  }, [activeLocation.lat, activeLocation.long])

  React.useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search)
    const payment_status = urlSearchParams.get('payment_status')
    if (payment_status === 'unsuccessful') {
      setPaymentStatus(t('search:home.payment-status-unsuccessfull'))
    }
  }, [])
  const rudderStack = useRudderStack()
  React.useEffect(() => {
    rudderStack.eventTrigger({
      type: eventTypes.pageView,
      page_category: 'Home',
      page_name: 'Home',
    })
  }, [rudderStack])
  return (
    <div>
      <CustomHead
        title={t('search:home.title')}
        description={t('seo.description.home')}
        url={router.pathname}
        image={`${t('seo.base_url')}/static/images/favicon/favicon-96x96.png`}
        page={PageTypes.HOME_PAGE}
        canonical={router.asPath}
      />
      <Toast
        top={250}
        message={paymentStatus}
        status='alert'
        onCloseToast={() => setPaymentStatus('')}
      />
      <Page>
        {!isLoading ? (
          <div>
            <HomeSections sections={sections} isLoading={isLoading} />
          </div>
        ) : (
          <Loading>
            <Spinner />
          </Loading>
        )}
      </Page>
      {/*<Cities />*/}
      <Footer />
    </div>
  )
}

Home.getInitialProps = async ctx => {
  searchSideEffects(ctx)
  const {store, isServer} = ctx
  const {
    activeLocation: {latitude, longitude} = {latitude: -1, longitude: -1},
  } = ctx
  if (isServer) {
    const newCacheKey = `lat=${+latitude}&long=${+longitude}`
    await store.dispatch(
      getHomeData({
        lat: +latitude,
        long: +longitude,
        cacheKey: newCacheKey,
      })
    )
  }
  return {
    serverActiveLocation: {lat: Number(latitude), long: Number(longitude)},
  }
}

export default Home
