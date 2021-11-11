import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useRouter} from 'next/router'
import {useTranslation} from 'react-i18next'
import styled from 'styled-components'
import {rem} from 'polished'

import {Grid, Spinner, Text, bks} from '@sf/design-system'
import {SimplePageComponent} from '@root/types'

import {
  searchProducts,
  selectAllProducts,
  selectSlice,
} from '~search/redux/products'
import {selectLocation} from '~growth/redux/location'
import {SearchProductCard} from '~search/components/SearchProductCard'
import {useScrollEnd} from '@hooks/useScrollEnd'
import searchSideEffects from '~search/helpers'
import {DefaultLayout} from '@root/Layout'
import {CustomHead} from '@components/CustomHead'
import {PageTypes, SEOSchema} from '@schema/seo'
import {useRudderStack} from '@contexts/RudderStack'
import {eventTypes} from '@schema/rudderStack'

// Styled elements
const Page = styled(DefaultLayout)`
  min-height: 80vh;
  padding: ${({theme}) => theme.spacing[3]};
  padding-top: ${rem(68)};
`
const List = styled(Grid)`
  --border-style: ${rem(1)} solid ${({theme}) => theme.surface.dark};
  border: var(--border-style);

  > * {
    border-bottom: var(--border-style);

    ${bks.up('lg')} {
      &:not(:nth-child(4n)) {
        border-left: var(--border-style);
      }
    }

    ${bks.down('md')} {
      &:not(:nth-child(3n)) {
        border-left: var(--border-style);
      }
    }
  }
`
const Loading = styled.div`
  padding: ${({theme}) => theme.spacing[4]};
`
const PAGE_SIZE = 20

const Products: SimplePageComponent = () => {
  const {t} = useTranslation()
  const router = useRouter()
  const {query} = router.query
  const dispatch = useDispatch()
  const products = useSelector(selectAllProducts)
  const {count, isLoading, cacheInfo} = useSelector(selectSlice)
  const {activeLocation} = useSelector(selectLocation)

  const reqParams = {
    query: query ? String(query) : '',
    page: Number(router.query.page) || 0,
    page_size: PAGE_SIZE,
    size: PAGE_SIZE,
    superType:
      router.query.superType && router.query.superType
        ? `[${router.query.superType}]`
        : '',
    lat: activeLocation.lat,
    long: activeLocation.long,
    'extra-filter': router.query['extra-filter'],
    product_list: router.query.product_list,
  }
  const isCacheMode =
    cacheInfo['extra-filter'] === reqParams['extra-filter'] &&
    cacheInfo.query === reqParams.query &&
    cacheInfo.lat === activeLocation.lat &&
    cacheInfo.long === activeLocation.long
  const [isEnd, setIsEnd] = useScrollEnd({
    threshold: 0.8,
  })

  useEffect(() => {
    if (!isLoading) {
      setIsEnd(false)
    }
  }, [isLoading])

  useEffect(() => {
    if (isCacheMode) {
      return
    } else if (!isLoading) {
      window.scroll(0, 0)
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          page: 0,
        },
      })
      dispatch(searchProducts({...reqParams, page: 0}))
    }
  }, [query, cacheInfo, activeLocation.lat, activeLocation.long])

  useEffect(() => {
    const page = Number(router.query.page) || 0
    const newPage = Number(page) + 1
    if (isEnd && newPage * PAGE_SIZE < count && !isLoading) {
      const params = {...reqParams, page: newPage}
      dispatch(searchProducts(params))

      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            page: newPage,
          },
        },
        undefined,
        {scroll: false}
      )
    }
  }, [isEnd])

  const hasResult = Boolean(products.length)
  const metaData: SEOSchema = {
    title: router.query.query
      ? t('seo.title', {
          text: `${t('seo.pre_title')} ${router.query.query}` || t('snappfood'),
        })
      : null,
    description: router.query.query
      ? t('seo.description.products', {
          productName: router.query.query,
        })
      : null,
    image: '',
    url: `${t('seo.baseURL')}/${router.asPath}`,
    page: PageTypes.PRODUCTS,
  }
  const rudderStack = useRudderStack()
  useEffect(() => {
    rudderStack.eventTrigger({
      type: eventTypes.pageView,
      page_category: 'Products',
      page_name: router.query.query,
    })
  }, [rudderStack])

  return (
    <Page>
      <CustomHead {...metaData} />
      {hasResult && isCacheMode ? (
        <List container spacing={3}>
          {products.map((item, idx) => (
            <Grid item xs={4} sm={4} md={4} lg={3} key={idx}>
              <SearchProductCard product={item} isLoading={false} />
            </Grid>
          ))}
        </List>
      ) : (
        !isLoading &&
        isCacheMode && <Text scale='default'>{t('no-result')}</Text>
      )}
      <Loading>{isLoading && <Spinner />}</Loading>
    </Page>
  )
}

Products.getInitialProps = async ctx => {
  searchSideEffects(ctx)
  const {store, isServer, query, activeLocation} = ctx
  if (isServer) {
    await store.dispatch(
      searchProducts({
        query: String(query.query),
        page: Number(query.page) || 0,
        page_size: PAGE_SIZE,
        size: PAGE_SIZE,
        superType: `[${query.superType}]`,
        lat: activeLocation.latitude,
        long: activeLocation.longitude,
      })
    )
  }
  return {}
}

export default Products
