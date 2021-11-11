import React from 'react'
import {useRouter} from 'next/router'
import {useTranslation} from 'react-i18next'
import styled from 'styled-components'
import {rem} from 'polished'
import {useDispatch, useSelector} from 'react-redux'
import {Grid, Spinner, VendorIcon} from '@sf/design-system'
import {SECTION_TYPE} from '~search/types'
import {SimplePageComponent} from '@root/types'
import {ResultSection} from '~search/components/ResultSection'
import {VendorCard} from '~search/components/VendorCard'
import {SearchProductCard} from '~search/components/SearchProductCard'

import searchSideEffects from '~search/helpers'
import {searchQuery, selectSlice} from '~search/redux/search'
import {selectLocation} from '~growth/redux/location'
import {DefaultLayout} from '@root/Layout'
import NoResult from '@components/NoResult'
import {CustomHead} from '@components/CustomHead'
import {PageTypes, SEOSchema} from '@schema/seo'
import {useRudderStack} from '@contexts/RudderStack'
import {eventTypes} from '@schema/rudderStack'

// Styled elements
const Page = styled(DefaultLayout)`
  min-height: 80vh;
  padding: ${({theme}) => theme.spacing[3]};
  padding-top: ${rem(68)};

  > * {
    margin-bottom: ${rem(60)};
  }
`
const ProductContainers = styled(Grid)`
  section {
    border: ${rem(1)} solid ${({theme}) => theme.surface.dark};
    border-radius: ${rem(12)};
    box-shadow: ${({theme}) => theme.shadows.small};
  }
`
const Loading = styled.div`
  padding: ${({theme}) => theme.spacing[4]};
`

const Search: SimplePageComponent = () => {
  const {t} = useTranslation()
  const {query} = useRouter()
  const dispatch = useDispatch()
  const {results, isLoading, cacheInfo, hasResult} = useSelector(selectSlice)
  const {activeLocation} = useSelector(selectLocation)
  const superTypeParam = `[${String(query.superType)}]`

  const isCacheMode =
    cacheInfo.query === query.query &&
    cacheInfo.superType === superTypeParam &&
    cacheInfo.lat == activeLocation.lat &&
    cacheInfo.long == activeLocation.long

  React.useEffect(() => {
    if (!isCacheMode && query.query) {
      window.scroll(0, 0)
      dispatch(
        searchQuery({
          query: String(query.query),
          superType: superTypeParam,
          lat: activeLocation.lat,
          long: activeLocation.long,
        })
      )
    }
  }, [query.query, activeLocation.lat, activeLocation.long])
  const metaData: SEOSchema = {
    title: query.query
      ? t('seo.title', {
          text: `${t('seo.pre_search_title')} ${query.query}` || t('snappfood'),
        })
      : null,
    description: query.query
      ? t('seo.descriptions.search', {searchText: query.query})
      : null,
    image: '',
    url: '',
    page: PageTypes.SEARCH,
    noIndex: true,
  }

  const rudderStack = useRudderStack()
  React.useEffect(() => {
    rudderStack.eventTrigger({
      type: eventTypes.pageView,
      page_category: 'search',
      page_name: String(query.query),
    })
  }, [rudderStack])
  const products = results.find(result => result.type === SECTION_TYPE.PRODUCTS)
  const vendors = results.find(result => result.type === SECTION_TYPE.VENDORS)
  return (
    <Page>
      <CustomHead {...metaData} />
      {isCacheMode &&
        results.map(result => {
          const key = result.type + String(query.query)
          const superTypeParam =
            query.superType && `&superType=${query.superType}`
          const searchParams = `?query=${query.query}${
            superTypeParam || ''
          }&page=0`
          switch (result.type) {
            case SECTION_TYPE.PRODUCTS: {
              const {items} = result
              return (
                <ResultSection
                  key={key}
                  heading={t('search:search.products-title', {
                    term: query.query,
                  })}
                  moreText={t('search:search.products-more')}
                  moreLink={`/products${searchParams}`}
                  hasMoreItems={(products && products.total > 8) || false}
                >
                  <ProductContainers container spacing={3}>
                    {items.map((item, idx) => (
                      <Grid item xs={4} sm={4} md={4} lg={3} key={idx}>
                        <SearchProductCard
                          key={idx}
                          product={item}
                          isLoading={isLoading}
                        />
                      </Grid>
                    ))}
                  </ProductContainers>
                </ResultSection>
              )
            }
            case SECTION_TYPE.VENDORS: {
              const {items} = result
              return (
                <ResultSection
                  key={key}
                  heading={t('search:search.vendors-title', {
                    term: query.query,
                  })}
                  moreText={t('search:search.vendors-more')}
                  moreLink={`/service/search-vendors${searchParams}`}
                  hasMoreItems={(vendors && vendors.total > 4) || false}
                >
                  <Grid container spacing={3}>
                    {items.map((item, idx) => (
                      <Grid item xs={4} sm={4} md={4} lg={3} key={idx}>
                        <VendorCard
                          vendor={item}
                          isLoading={isLoading}
                          position={idx}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </ResultSection>
              )
            }
            default:
              break
          }
        })}
      {!isLoading && !hasResult && isCacheMode && (
        <NoResult
          searchMessage={t('no-result-query-with-link', {query: query.query})}
        >
          <VendorIcon style={{width: '3rem', height: '3rem'}} />
        </NoResult>
      )}
      <Loading>{isLoading && <Spinner />}</Loading>
    </Page>
  )
}

Search.getInitialProps = async ctx => {
  searchSideEffects(ctx)
  const {store, isServer, query, activeLocation} = ctx
  if (isServer && query.query) {
    await store.dispatch(
      searchQuery({
        query: String(query.query),
        superType: `[${String(query.superType)}]`,
        lat: Number(activeLocation.latitude),
        long: Number(activeLocation.longitude),
      })
    )
  }
  return {}
}

export default Search
