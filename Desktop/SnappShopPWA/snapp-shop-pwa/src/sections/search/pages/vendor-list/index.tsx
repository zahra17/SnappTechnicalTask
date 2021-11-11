import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {useRouter} from 'next/router'
import {useTranslation} from 'react-i18next'
import styled from 'styled-components'
import {rem} from 'polished'
import {useSelector} from 'react-redux'
import {
  useQueryParams,
  ArrayParam,
  DelimitedNumericArrayParam,
  QueryParamConfig,
  decodeQueryParams,
  StringParam,
  NumberParam,
} from 'use-query-params'

import {CTX, SimplePageComponent} from '@root/types'

import {
  FlexBox,
  Grid,
  Select,
  Spinner,
  VendorIcon,
  Button,
  Text,
  GridValues,
  Breakpoints,
} from '@sf/design-system'

import searchSideEffects from '~search/helpers'
import {FilterKinds} from '~search/components/FilterKinds'
import {VendorCard} from '~search/components/VendorCard'
import {
  fetchList,
  fetchMore,
  selectSlice,
  selectAllList,
  FetchParams,
} from '~search/redux/vendorsList'
import {selectIsModalOpen, selectLocation} from '~growth/redux/location'
import {Filter, Tag} from '~search/types'
import {useScrollEnd} from '@hooks/useScrollEnd'
import useResizeObserver from '@hooks/useResizeObserver'
import {useScroll} from '@hooks/useScrollDirection'
import {DefaultLayout} from '@root/Layout'
import NoResult from '@components/NoResult'
import {useAppDispatch} from '@redux'
import {useRudderStack} from '@contexts/RudderStack'
import {eventTypes} from '@schema/rudderStack'
import {VendorModel} from '@schema/vendor'
import {useRudderStackVendorList} from '@hooks/useRudderStackVendorList/useRudderStackVendorList'
import {selectAppData} from '@slices/core'
import {CustomHead} from '@components/CustomHead'
import {selectActiveService} from '~search/redux/services'
import {SEOSchema} from '@schema/seo'
import {SUPER_TYPES} from '~search/utils'
import {Categories, CategoriesProps} from '~search/components/Categories'
import FiltersSection from '~search/components/FiltersSection'
import {SidesProps} from '~menu/components/Zooket/Page'
import {CITY_CODES, getCityTitle, getName} from '@utils'
import {useVendorListSeoTitle} from '@components/CustomHead/hooks/useVendorListSeoTitle'
import {useHeadingTitleContext} from '@contexts/HeadingTitle'
import {usePinnedLocationContext} from '@contexts/Map/PinnedLocation'
import {SuperType} from '@schema/vendorListTypes'
import useSelectedCity from '@hooks/useSelectedCity'
import CustomError from '~search/components/CustomError'
import {Anchor} from '@components/Anchor'
/*
 Active category filters param serialization config for storing active categoris in the URL
*/

const FILTERS_SECTIONS = {
  GENERAL: 'general',
  PRICING: 'pricing',
}
export type CategoryQueryType = {
  value: number | null | undefined
  sub: number[] | null | undefined
} | null

const CategoryParam: QueryParamConfig<Tag, CategoryQueryType> = {
  encode: category =>
    category
      ? `${category.value}${
          category.sub?.length ? `->${category.sub.join('-')}` : ''
        }`
      : undefined,
  decode: category => {
    const splitted = String(category).split('->')
    const [value, sub = ''] = splitted
    return {
      value: Number(value),
      sub: sub.length ? sub.split('-').map(Number) : [],
    }
  },
}
const ParamConfig = {
  category: CategoryParam,
  services: ArrayParam,
  filters: ArrayParam,
  sort: ArrayParam,
  superType: DelimitedNumericArrayParam,
  query: StringParam,
  page: NumberParam,
  extraFilter: StringParam,
  section: StringParam,
}

// Styled elements
const Page = styled(DefaultLayout)`
  min-height: 80vh;
  padding: ${({theme}) => theme.spacing[3]};
`

const Filters = styled(FlexBox)`
  margin-bottom: ${({theme}) => theme.spacing[4]};
`
const Loading = styled.div`
  padding: ${({theme}) => theme.spacing[4]};
`

const StickySide = styled.div<SidesProps>`
  position: sticky;
  top: ${({resizeObserver}) => {
    const {scrollDirection} = useScroll()
    if (scrollDirection === 'up') {
      return rem(72 + 16)
    } else {
      return resizeObserver &&
        resizeObserver.windowHeight - resizeObserver.height <= 70 // "70" is kind of accuracy
        ? rem(resizeObserver.windowHeight - resizeObserver.height - 72 + 16)
        : rem(72 + 16)
    }
  }};
  transition: top 350ms; /* speed of movement */
`

const FiltersLayout = styled(FlexBox)`
  padding: ${({theme}) => theme.spacing[2]};
  border: 1px solid ${({theme}) => theme.carbon.alphaLight};
  border-radius: ${rem(12)};
  box-shadow: ${({theme}) => theme.shadows.small};
`
const SideNav = styled(FlexBox).attrs({as: 'nav'})`
  min-height: ${rem(150)};

  > * {
    margin-bottom: ${rem(8)};
  }
`

// Request page size
const PAGE_SIZE = 20
const MAX_PAGE = 3
// Page Component
const VendorsList: SimplePageComponent<{
  metaSEOData?: SEOSchema
  error?: number
}> = p => {
  const {metaSEOData, error} = p
  const router = useRouter()
  const {isCitySubmited, redirectURL, newRoute} = usePinnedLocationContext()
  const [hasError, setHasError] = useState<boolean>(false)
  const isModalOpen: boolean = useSelector(selectIsModalOpen)
  const {selectedCity} = useSelectedCity({})
  const {t} = useTranslation()
  const dispatch = useAppDispatch()
  const resizeObserver = useResizeObserver()

  // for tracking if user has reached to the end of the page for fetching more data
  const [isEnd, setIsEnd] = useScrollEnd({
    // node: listNode,
    threshold: 0.8,
  })
  const listRef = useRef<HTMLDivElement | null>(null)
  // Query params state
  const [query, setQuery] = useQueryParams(ParamConfig)
  const {activeLocation: {lat = -1, long = -1} = {}} = useSelector(
    selectLocation
  )

  // Data/States from store
  const {
    isLoading,
    count,
    extra_sections: {
      filters = {top: {data: [] as Filter[]}, sections: []},
      categories = {data: [] as Tag[]},
    } = {},
    cacheKey,
  } = useSelector(selectSlice) || {}
  const list = useSelector(selectAllList)
  const newCacheKey = `${router.asPath}&lat=${+lat}&long=${+long}`

  // Transform filters data for representation
  const {categoriesArray, options} = useMemo(
    () => ({
      options: (filters.top.data || []).map(f => ({
        value: f.value,
        label: f.title,
      })),
      categoriesArray: categories.data.map(c => {
        return {
          ...c,
          selected: query.category?.value === c.value,
          sub: c.sub?.map(s => {
            return {
              ...s,
              selected: Boolean(query.category?.sub?.includes(s.value)),
            }
          }),
        } as Tag
      }),
    }),
    [query, filters]
  )
  const isCacheMode = cacheKey === newCacheKey
  const isServiceCached =
    getServiceFromCacheKey(cacheKey) === getServiceFromCacheKey(router.asPath)
  const isAllCityVendorList = router.query && router.query.service === 'all'
  const near = router && router.asPath ? router.asPath.includes('near') : false
  const hasLatLong =
    !(
      isAllCityVendorList ||
      (!near && router.query?.cityName) ||
      (router.query?.service &&
        !router.query?.cityName &&
        !router.query.chainName)
    ) || router.query?.query
  const requestParams: FetchParams = {
    page: isCacheMode ? query.page || 0 : 0,
    page_size: PAGE_SIZE,
    filters: {
      filters: query.filters,
      sortings: query.sort,
      superType: query.superType,
      services: query.services,
    },
    category: query.category?.value ? query.category : null,
    query: query.query ? String(query.query) : '',
    sp_alias: isAllCityVendorList
      ? null
      : router.query?.service
      ? String(router.query.service)
      : null,
    city_name: router.query?.cityName ? String(router.query.cityName) : null,
    area_name: router.query?.areaName ? String(router.query.areaName) : null,
    chain_name: router.query?.chainName ? String(router.query.chainName) : null,
    superType: query.superType ? `[${String(query.superType)}]` : '',
    vc: router.query?.vc ? String(router.query.vc) : null,
    lat: hasLatLong ? +lat : null,
    long: hasLatLong ? +long : null,
    cacheKey: newCacheKey,
    'extra-filter': query.extraFilter || '',
    section: query.section,
  }

  useEffect(() => {
    if (Number(query.page) != 0) {
      setQuery(
        {
          page: 0,
          superType: query.superType,
        },
        'replaceIn'
      )
      return
    }

    const {cityName, service} = router.query

    if (cityName) {
      const code = Object.keys(CITY_CODES).find(
        code =>
          code?.toLocaleLowerCase() === String(cityName).toLocaleLowerCase()
      )
      if (!code) setHasError(true)
    }
    if (service && service !== 'all') {
      const service_title = Object.keys(SuperType).find(
        name => name?.toLowerCase() === String(service).toLowerCase()
      )
      if (!service_title) setHasError(true)
    }
  }, [])

  // Set isEnd to false after fetching new data
  useEffect(() => {
    if (!isLoading) {
      setIsEnd(false)
    }
  }, [isLoading])

  // Fetch data on mount and on query update
  useEffect(() => {
    // Ignore request if it's has been fetched
    const cachedParams = new URLSearchParams(cacheKey)
    if (
      (isCacheMode || query.page !== 0) &&
      count !== -1 &&
      Number(cachedParams.get('lat')) === Number(lat)
    ) {
      return
    } else {
      setQuery(
        {
          page: 0,
          superType: query.superType,
          query: query.query,
        },
        'replaceIn'
      )
      window.scroll(0, 0)
      const promise = dispatch(fetchList(requestParams))
      return () => {
        promise.abort()
      }
    }
  }, [query, lat, long, router.asPath])

  // Fetch more data when isEnd true //
  useEffect(() => {
    if (Number(query.page) + 1 < 4 && isEnd) {
      handleMoreClick()
    }
  }, [isEnd])

  const handleMoreClick = () => {
    const newPage = Number(query.page) + 1

    if (newPage * PAGE_SIZE < count && !isLoading) {
      const params = {...requestParams, page: newPage}
      setQuery(
        {
          page: newPage,
          superType: query.superType,
          query: query.query,
        },
        'replaceIn'
      )

      dispatch(fetchMore(params))
    }
  }

  const hasResult = Boolean(list.length)
  useRudderStackVendorList({
    query: {
      superType: query.superType,
      sort: query.sort,
      services: query.services,
    },
    list,
    categoriesArray,
    filters,
  })
  const rudderStack = useRudderStack()
  useEffect(() => {
    rudderStack.eventTrigger({
      type: eventTypes.pageView,
      page_category: 'Vendor List',
      page_name: router.query.superType
        ? superTypes[Number(router.query.superType)]
        : router.query.service,
    })
  }, [rudderStack])
  const {superTypes} = useSelector(selectAppData) || {
    superTypes: {},
  }
  const activeService = useSelector(selectActiveService)(
    Number(router.query.superType)
  )

  const [metaData, setMetaData] = useState<SEOSchema>()
  const meta = useVendorListSeoTitle({
    ...router.query,
    superType:
      router.query.superType ||
      Object(SuperType)[String(router.query.service).toUpperCase()],
    canonical: router.asPath,
    image: activeService && activeService.icon[0] ? activeService.icon[0] : '',
  })
  useEffect(() => {
    const itemListElement = list.map((item: any, index: number) => {
      const vendorModel = new VendorModel(item)
      return Object({
        '@type': 'ListItem',
        position: ++index,
        name: item.title,
        item: Object(vendorModel.getLink())?.pathname,
      })
    })
    const json = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: itemListElement,
    })
    meta.vendorItems = json
    setMetaData(meta)
  }, [])

  const {service, areaName, cityName, chainName} = router.query
  const {changeTitle} = useHeadingTitleContext()

  useEffect(() => {
    const type = Object(SuperType)[String(service).toUpperCase()]
    const cityPersianTitle = getCityTitle((cityName || '') as string)
    changeTitle(type, cityPersianTitle, areaName, null, service, chainName)
  }, [])

  useEffect(() => {
    if (hasError) changeTitle()
  }, [hasError])

  useEffect(() => {
    const itemListElement = list.map((item: any, index: number) => {
      const vendorModel = new VendorModel(item)
      return Object({
        '@type': 'ListItem',
        position: ++index,
        name: item.title,
        item: Object(vendorModel.getLink())?.pathname,
      })
    })
    const json = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement,
    })
    meta.vendorItems = json
    setMetaData(meta)
  }, [list])

  const redirectURLCallback = useCallback(() => {
    redirectURL({
      selectedCity: selectedCity || null,
      query: {
        page: query.page,
        service: router.query.service && String(router.query.service),
        superType: router.query.superType,
        filters: query.filters,
        category: query.category?.value ? query.category : null,
        cityName: router.query.cityName && String(router.query.cityName),
        extraFilter: query.extraFilter,
        asPath: router.asPath,
        section: query.section,
        cuisine: router.query?.cuisine,
        chainName: router.query?.chainName,
      },
      isNewAddress: isCitySubmited,
    })
  }, [lat, long])
  useEffect(() => {
    redirectURLCallback()
  }, [redirectURLCallback])

  const setNewRouteCallback = useCallback(() => {
    if (newRoute && !isModalOpen) {
      router.replace(newRoute)
    }
  }, [newRoute, isModalOpen])
  useEffect(() => {
    setNewRouteCallback()
  }, [setNewRouteCallback])

  const handleCategoriesChange: CategoriesProps['onChange'] = ({
    tag,
    subTags,
  }) => {
    setQuery(
      {
        category: tag
          ? {
              value: tag.value,
              sub: subTags.map(s => s.value),
            }
          : undefined,
        superType: query.superType,
        page: 0,
      },
      'replaceIn'
    )
  }

  const gridProps: Record<keyof Breakpoints, GridValues> = !query.query
    ? {xs: 6, sm: 6, md: 6, lg: 4, xl: 4}
    : {xs: 4, sm: 4, md: 4, lg: 3, xl: 3}

  return (
    <Page>
      {error ? (
        <CustomError />
      ) : (
        <>
          {metaData && <CustomHead {...metaData} />}
          {Boolean(options.length) && (
            <Filters
              justify='space-between'
              alignItems='center'
              key={router.asPath}
            >
              <div />
              <Select
                instanceId='sort'
                value={options.filter(f => f.value === String(query.sort))}
                placeholder={t('search:list.sort')}
                options={options}
                isClearable
                onChange={(e: any) => {
                  setQuery(
                    {
                      sort: e ? e.value : undefined,
                      superType: query.superType,
                      page: 0,
                    },
                    'replaceIn'
                  )
                }}
              />
            </Filters>
          )}

          <Grid container spacing={4} ref={listRef}>
            {Boolean(!query.query) && (
              <Grid item lg={3} xs={4} as='aside'>
                <StickySide
                  ref={resizeObserver.ref}
                  resizeObserver={resizeObserver}
                >
                  <SideNav direction='column'>
                    {Boolean(categories.data.length && isServiceCached) && (
                      <FiltersLayout direction='column'>
                        <Categories
                          // key={router.asPath}
                          categories={categoriesArray}
                          onChange={handleCategoriesChange}
                          activeCategories={query.category}
                        />
                      </FiltersLayout>
                    )}
                    {isServiceCached &&
                      filters.sections.map(section => {
                        const {data, section_name, section_name_fa} = section
                        switch (section_name) {
                          case FILTERS_SECTIONS.GENERAL:
                            return (
                              <FiltersLayout key={section_name}>
                                <FilterKinds
                                  filtersQuery={query.filters}
                                  filters={data}
                                  handleChange={filters => {
                                    setQuery(
                                      {
                                        filters: Object.values(filters),
                                        superType: query.superType,
                                        page: 0,
                                      },
                                      'replaceIn'
                                    )
                                  }}
                                />
                              </FiltersLayout>
                            )
                          case FILTERS_SECTIONS.PRICING:
                            return (
                              <FiltersLayout
                                key={section_name}
                                direction='column'
                              >
                                <Text scale='caption'>{section_name_fa}</Text>
                                <FiltersSection
                                  filtersQuery={query.filters}
                                  filters={data}
                                  handleChange={filters => {
                                    setQuery(
                                      {
                                        filters: Object.values(filters),
                                        superType: query.superType,
                                        page: 0,
                                      },
                                      'replaceIn'
                                    )
                                  }}
                                />
                              </FiltersLayout>
                            )
                          default:
                            return null
                        }
                      })}
                  </SideNav>
                </StickySide>
              </Grid>
            )}
            <Grid item lg={query.query ? 12 : 9} xs={query.query ? 12 : 8}>
              {hasResult && isServiceCached ? (
                <Grid container spacing={3}>
                  {list.map((item, idx) => (
                    <Grid item {...gridProps} key={idx}>
                      <VendorCard
                        vendor={item}
                        isLoading={!isEnd && isLoading}
                        position={idx}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                Boolean(!isLoading && isCacheMode) && (
                  <NoResult>
                    <VendorIcon width='3rem' height='3rem' />
                  </NoResult>
                )
              )}
              <Loading>{isLoading && <Spinner />}</Loading>
              {Number(query.page) >= MAX_PAGE &&
                !isLoading &&
                (Number(query.page) + 1) * PAGE_SIZE < count && (
                  <FlexBox justify='center'>
                    <Anchor>
                      <Button
                        float
                        onClick={handleMoreClick}
                        appearance='outline'
                      >
                        <Text scale='body' as='span' colorName='accent'>
                          {t('show-more')}
                        </Text>
                      </Button>
                    </Anchor>
                  </FlexBox>
                )}
            </Grid>
          </Grid>
        </>
      )}
    </Page>
  )
}

VendorsList.getInitialProps = async (ctx: CTX) => {
  searchSideEffects(ctx)
  const {
    store,
    isServer,
    query,
    activeLocation: {latitude = -1, longitude = -1} = {},
    asPath = '',
    res,
  } = ctx

  if (isServer) {
    if (query.cityName) {
      const code = Object.keys(CITY_CODES).find(
        code =>
          code?.toLocaleLowerCase() ===
          String(query.cityName).toLocaleLowerCase()
      )
      if (!code && res) {
        res.statusCode = 404
        return {error: 404}
      }
    }
    const q = decodeQueryParams(ParamConfig, query)
    const isAllCityVendorList = query && query.service === 'all'
    const isNear = asPath && asPath.includes('near')
    const hasLatLong =
      !(
        isAllCityVendorList ||
        (!isNear && query?.cityName) ||
        (query?.service && !query?.cityName && !query.chainName)
      ) || query.query
    const params: FetchParams = {
      page: q.page || 0,
      page_size: PAGE_SIZE,
      category: q.category?.value ? q.category : null,
      query: q.query ? String(q.query) : '',
      filters: {
        sortings: q.sort,
        superType: q.superType,
        filters: q.filters,
        services: q.services,
      },
      sp_alias: isAllCityVendorList
        ? null
        : query?.service
        ? String(query.service)
        : null,
      city_name: query?.cityName ? String(query.cityName) : null,
      area_name: query?.areaName ? String(query.areaName) : null,
      chain_name: query?.chainName ? String(query.chainName) : null,
      superType: `[${String(query.superType)}]`,
      vc: query?.vc ? String(query.vc) : null,
      lat: hasLatLong ? +latitude : null,
      long: hasLatLong ? +longitude : null,
      cacheKey: `${asPath}&lat=${+latitude}&long=${+longitude}`,
      'extra-filter': q.extraFilter || '',
      section: q.section,
    }
    const result = await store.dispatch(fetchList(params))
    if (result.payload && result.payload === '404') {
      if (res) res.statusCode = 404
      return {error: 404}
    }
  }
  return {}
}

const getServiceFromCacheKey = (asPath: string) => asPath.split('?')[0].slice(1)

export default VendorsList
