import React, {useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import {useRouter} from 'next/router'
import cookies from 'next-cookies'
import {rem} from 'polished'
import {useTranslation} from 'react-i18next'
import {useDispatch, useSelector} from 'react-redux'
import {
  Button,
  Grid,
  Text,
  Spinner,
  CircleInfo,
  ChevronDownIcon,
  FlexBox,
} from '@sf/design-system'
import {RateCommentBadge} from '@components/RateCommentBadge'
import {VendorStateBadge} from '@components/VendorStateBadge'
import {CTX, SimplePageComponent} from '@root/types'
import {
  selectCategories,
  fetchZooketDetail,
  fetchZooketProducts,
  getVendorComments,
  selectSlice,
  clearCache,
  getZooketProductDetails,
} from '~menu/redux/zooket'
import {
  selectLocation,
  showModal as showModalAction,
} from '~growth/redux/location'

import menuSideEffects from '~menu/helpers'
import {VendorLogo} from '@components/VendorLogo'
import {DiscountBadge} from '@components/DiscountBadge'
import {DeliveryBadge} from '@components/DeliveryBadge'
import {VendorMessageModal} from '@components/VendorMessageModal'
import {getVendorCodeFromQuery, VendorModel} from '@schema/vendor'

import {useCustomEvent} from '@hooks/useCustomEvent'
import {useVendorMessage} from '@hooks/useVendorMessage'

import {useScrollEnd} from '@hooks/useScrollEnd'
import {SEARCH_PLACE_HOLDER_EVENT} from '~search/components/SearchModal'
import {VendorDetail} from '~menu/components/VendorDetail'
import {CommentsSort, SortType} from '~menu/types'
import {ZooketSections} from '~menu/components/Zooket/Sections'
import {ZooketCategories} from '~menu/components/Zooket/Categories'
import {useBodyColor} from '@hooks/useBodyColor'
import {useBasketProduct, useVendorBasket} from '@hooks/useBasket'
import Basket from '~order/components/Basket'
import {
  useQueryParams,
  DelimitedNumericArrayParam,
  decodeQueryParams,
  StringParam,
  NumberParam,
} from 'use-query-params'
import {initialBasketInServer} from '@slices/baskets'
import {DefaultLayout} from '@root/Layout'
import useResizeObserver from '@hooks/useResizeObserver'
import {useScroll} from '@hooks/useScrollDirection'
import {ProductDetails} from '~menu/components/Zooket/ProductDetails'
import {Product} from '@schema/product'
import {ProductCard} from '~menu/components/ProductCard'
import {withProductContext} from '@contexts/Product'
import {CustomHead} from '@components/CustomHead'
import {basketIdStorage} from '@utils'
import {useSelectProduct} from '@hooks/useSelectProduct'
import {useBreadcrumb} from '@contexts/Breadcrumb'
import {useRudderStack} from '@contexts/RudderStack'
import {eventTypes} from '@schema/rudderStack'
import {useOpenAddressModal} from '~growth/hooks/useOpenAddressModal'
import {PageTypes, SEOSchema} from '@schema/seo'
import {useVendorSeoTitle} from '@components/CustomHead/hooks/useVendorSeotitle'

export interface ActiveCategory {
  value: number
  sub: number
}
export interface SidesProps {
  resizeObserver?: {
    width: number
    height: number
    windowWidth: number
    windowHeight: number
  }
}
const Page = styled(DefaultLayout)`
  min-height: 100vh;
  padding: ${({theme}) => theme.spacing[2]};
  padding-top: ${rem(68)};
`
const SideNav = styled(FlexBox).attrs({as: 'nav'})`
  /* height: calc(100vh - 180px - 152px); */
  min-height: ${rem(150)};
  /* overflow-y: auto; */

  > * {
    margin-bottom: ${rem(8)};
  }
`
const VendorInfo = styled.section`
  > * {
    display: flex;
    align-items: center;
    margin-bottom: ${rem(24)};

    &:last-child {
      flex-wrap: wrap;
      /* justify-content: space-between; */

      > *:last-child {
        @media (max-width: 1201px) {
          margin-top: ${rem(10)};
        }
      }
    }
  }
`
const VendorRate = styled(FlexBox)`
  > *:last-child {
    margin-top: ${rem(14)};
  }
`

//functionality: sticky and scroll if height is less than window's height
const Sides = styled.div<SidesProps>`
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

const Header = styled.header`
  > *:first-child {
    margin-left: ${rem(12)};
  }

  > *:last-child {
    overflow: hidden;
  }
`
const DeliveryInfo = styled(DeliveryBadge)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${({theme}) => theme.carbon.alphaLight};
  border-radius: ${rem(8)};
  box-shadow: none;
`
const Loading = styled.div`
  padding: ${({theme}) => theme.spacing[4]};
`
const VendorDiscountBadge = styled(DiscountBadge)`
  /* position: absolute; */
  top: ${rem(-8)};
  right: ${rem(-8)};
`

const ParamConfig = {
  cat_ids: DelimitedNumericArrayParam,
  query: StringParam,
  productId: NumberParam,
}

// Vendor page component
const ZooketPage: SimplePageComponent = () => {
  useOpenAddressModal()
  useBodyColor('main')
  const router = useRouter()

  const [query, setQuery] = useQueryParams(ParamConfig)
  const cat_ids = query.cat_ids || []

  const {t} = useTranslation()
  const dispatch = useDispatch()
  const {
    vendor,
    vendorComments,
    sections,
    productSections,
    cacheInfo,
    isLoading,
    pagination,
    locationCacheKey,
  } = useSelector(selectSlice)

  const categories = useSelector(selectCategories)
  const {activeLocation: {lat = -1, long = -1} = {}} = useSelector(
    selectLocation
  )
  const location = useSelector(selectLocation)
  const {dispatchEvent} = useCustomEvent({typeArg: SEARCH_PLACE_HOLDER_EVENT})
  const [vendorMessageIsOpen, setVendorMessageIsOpen] = useVendorMessage({
    vendor,
    isLoading,
  })
  const [isOpen, setIsOpen] = useState(false)
  const [sortType, setSortType] = useState<SortType>('score')
  const [productDetail, setProductDetail] = useState<{
    isOpenModal: boolean
    product: Product | null
  }>({
    isOpenModal: false,
    product: null,
  })

  const resizeObserver = useResizeObserver()
  // for tracking if user has reached to the end of the page for fetching more data
  const [isEnd, setIsEnd] = useScrollEnd({
    // node: listNode,
    threshold: 0.5,
  })

  const {handleProductAction} = useBasketProduct()

  const breadcrumb = useBreadcrumb()
  const rudderStack = useRudderStack()

  const commentsCurrentPage = useRef(1)

  const vendorModel = new VendorModel(vendor!)
  const hasVendorstateBadge = vendorModel.hasVendorStateBadge()

  const {vendorCode, isOldUrl} = getVendorCodeFromQuery(router.query)

  const newLocationCacheKey = `lat=${lat}&long=${long}`

  const isAddressEmptyWithOutOfScope =
    vendorModel.getVendorState() === VendorModel.VendorStates.OUTOFSCOPE &&
    location.areaAddress === ''

  const seoVendorTitle = useVendorSeoTitle(vendor)
  const metaData: SEOSchema = {
    title: vendor ? seoVendorTitle : null,
    description: vendor
      ? t('seo.descriptions.vendors', {
          vendorName: vendor.title,
        })
      : null,
    image: vendor ? vendor.logo : '',
    url: `${t('seo.base_url')}/${router.asPath}`,
    page: PageTypes.VENDOR_DETAIL,
    canonical: null,
  }

  useVendorBasket({vendor, basketType: ['normal']}, vendorCode as string)

  useSelectProduct({
    vendor,
    isLoading,
    sections,
    setProductDetail,
  })

  // Redirect old supermarket address to new format
  useEffect(() => {
    if (isOldUrl && vendor) {
      const pathname: string = vendorModel.getVendorLink()
      const search = '?vendorType=shop'
      router.replace({pathname, search})
    }
  }, [isOldUrl, vendor])

  useEffect(() => {
    dispatch(clearCache())

    if (vendor && vendor.vendorCode === vendorCode) {
      // setup basket
      // clearVendorBasket = setVendorBasket({vendor, basketType: ['normal']})
      if (vendor && vendor.vendorCode === vendorCode) {
        if (query?.query) {
          dispatchEvent(t(query.query))
        } else {
          dispatchEvent(
            t('search-placholder', {
              text: vendor.title,
            })
          )
        }
      }
    } else {
      dispatchEvent(
        t('search-placholder', {
          text: '',
        })
      )
    }

    async function getData() {
      await dispatch(
        fetchZooketDetail({
          vendorCode,
          lat,
          long,
          locationCacheKey: newLocationCacheKey,
        })
      )
      await dispatch(
        getVendorComments({
          vendorCode: String(vendorCode),
          page: 0,
          sortType: sortType,
        })
      )
    }
    if ((vendor?.vendorCode !== vendorCode || !vendor) && !isLoading) {
      getData()
    }
  }, [vendor?.vendorCode, vendorCode, query.productId])

  useEffect(() => {
    let menu_category_id = -1
    async function getData() {
      await dispatch(
        fetchZooketProducts({
          vendorCode,
          menu_category_id,
          fetch_categories: 1,
          page: 0,
        })
      )
    }
    if (cat_ids) {
      menu_category_id = Number(cat_ids[cat_ids.length - 1])
      if (
        menu_category_id &&
        vendorCode &&
        cacheInfo.menu_category_id !== menu_category_id &&
        !isLoading
      ) {
        window.scroll(0, 0)
        getData()
      }
    }
  }, [cat_ids, cacheInfo])

  useEffect(() => {
    const menu_category_id = -1
    query?.query &&
      dispatch(
        fetchZooketProducts({
          vendorCode,
          page: 0,
          query: query.query,
        })
      )
    if (vendor && vendor.vendorCode === vendorCode) {
      if (query?.query) {
        if (query?.query) {
          dispatchEvent(t(query.query))
        }
      } else {
        dispatchEvent(
          t('search-placholder', {
            text: vendor.title,
          })
        )
      }
    }
  }, [query])

  useEffect(() => {
    if (isLoading || locationCacheKey === newLocationCacheKey) return
    dispatch(
      fetchZooketDetail({
        vendorCode,
        lat,
        long,
        locationCacheKey: newLocationCacheKey,
      })
    )
  }, [lat, long])

  // Pagination effect
  useEffect(() => {
    const {size, page, total} = pagination
    const menu_category_id = Number(cat_ids[cat_ids.length - 1])
    if (isEnd && (page + 1) * size < total && !isLoading && menu_category_id) {
      dispatch(
        fetchZooketProducts({
          vendorCode,
          menu_category_id,
          fetch_categories: 1,
          page: page + 1,
        })
      )
    }

    if (isEnd && (page + 1) * size < total && !isLoading && query?.query) {
      dispatch(
        fetchZooketProducts({
          vendorCode,
          query: query.query,
          page: page + 1,
        })
      )
    }
  }, [isEnd])
  useEffect(() => {
    if (!isLoading) {
      setIsEnd(false)
    }
  }, [isLoading])

  useEffect(() => {
    rudderStack.eventTrigger({
      type: eventTypes.pageView,
      page_category: vendor?.superTypeAlias ?? vendor?.vendorType,
      page_name: vendor?.title,
    })
  }, [rudderStack])

  useEffect(() => {
    breadcrumb.changeBreadcrumbState({
      serviceAliasType: vendor?.vendorType,
      isVendorDetail: true,
      vendorTitle: vendor?.title,
    })
  }, [vendor])

  function getMoreComments() {
    const {comments = [], count = -1} = vendorComments
    if (comments.length && comments.length < count) {
      dispatch(
        getVendorComments({
          vendorCode: String(vendorCode),
          page: commentsCurrentPage.current++,
          sortType: sortType,
        })
      )
    }
  }
  function handleSort(sort: CommentsSort['params'][number]) {
    setSortType(sort.key)

    dispatch(
      getVendorComments({
        vendorCode: String(vendorCode),
        page: 0,
        sortType: sort.key,
      })
    )
  }
  function toggleCommentsModal() {
    setIsOpen(!isOpen)
  }
  async function handleSelectProduct(product: Product) {
    setProductDetail(state => {
      return {isOpenModal: !state.isOpenModal, product}
    })
  }
  function toggleProductDetailModal() {
    setProductDetail(state => {
      return {...state, isOpenModal: !state.isOpenModal}
    })
  }
  function toggleVendorMessageModal() {
    setVendorMessageIsOpen(!vendorMessageIsOpen)
  }

  function clearSearch() {
    setQuery(
      {
        cat_ids: null,
        query: '',
      },
      'replaceIn'
    )
  }

  function addProduct(product: Product) {
    if (lat && long) {
      handleProductAction({...product, toppings: []}, 'add')
    } else {
      dispatch(showModalAction(true))
    }
  }

  function removeProduct(product: Product) {
    handleProductAction({...product, toppings: []}, 'remove')
  }

  return (
    <>
      <CustomHead {...metaData} />
      <Page>
        {(isLoading && !vendor) || vendor?.vendorCode !== vendorCode ? (
          <Loading>
            <Spinner />
          </Loading>
        ) : (
          <Grid container spacing={4}>
            <Grid item xs={3} as='aside'>
              <Sides>
                <VendorInfo>
                  <Header>
                    <VendorLogo
                      src={vendor?.logo}
                      alt={vendor?.title}
                    ></VendorLogo>
                    <VendorRate direction='column'>
                      <FlexBox
                        direction='row'
                        alignItems='center'
                        justify='space-between'
                      >
                        <RateCommentBadge
                          rating={Number(vendor?.rating) / 2}
                          commentsCount={Number(vendor?.textCommentCount)}
                        />
                        <VendorDiscountBadge
                          discount={vendor?.discountValueForView}
                        />
                      </FlexBox>

                      <Text scale='large' as='h1' ellipsis weight='bold'>
                        {vendor?.title}
                      </Text>
                    </VendorRate>
                  </Header>
                  <div>
                    {hasVendorstateBadge && (
                      <VendorStateBadge vendorModel={vendorModel} />
                    )}
                    <Button
                      dir='rtl'
                      colorName='accent2'
                      appearance='outline'
                      float
                      block
                      onClick={() =>
                        vendorComments.comments && setIsOpen(!isOpen)
                      }
                    >
                      <CircleInfo />
                      <Text scale='body' colorName='inherit'>
                        {t('menu:comments-and-info')}
                      </Text>
                    </Button>
                  </div>
                </VendorInfo>
                <SideNav direction='column'>
                  {categories !== null && (
                    <ZooketCategories
                      isLoading={isLoading}
                      categories={categories}
                      activeCategories={cat_ids}
                      isSearchActive={query.query !== ''}
                      handleChange={categories => {
                        setQuery(
                          {
                            cat_ids: categories,
                            query: '',
                          },
                          'replaceIn'
                        )
                      }}
                    />
                  )}
                </SideNav>
              </Sides>
            </Grid>
            <Grid item xs={6} as='section'>
              {categories !== null && (
                <ZooketSections
                  clearSearch={clearSearch}
                  searchQuery={query?.query ?? ''}
                  categories={categories}
                  handleBredCrumb={categories => {
                    setQuery(
                      {
                        cat_ids: categories,
                        query: '',
                      },
                      'replaceIn'
                    )
                  }}
                  activeCategories={cat_ids}
                  sections={
                    cat_ids[cat_ids.length - 1] || query.query
                      ? productSections
                      : sections
                  }
                  renderProducts={products =>
                    products.map(product => (
                      <Grid xs={6} item key={product.id}>
                        <ProductCard
                          handleSelectProduct={() =>
                            handleSelectProduct(product)
                          }
                          products={[product]}
                          vendorCode={vendorCode}
                          vendorStates={vendorModel.getVendorState()}
                          cursor='pointer'
                          addProduct={product => addProduct(product)}
                          removeProduct={product => removeProduct(product)}
                        />
                      </Grid>
                    ))
                  }
                  moreText={t('more-text')}
                />
              )}
              {isLoading && isEnd && (
                <Loading>
                  <Spinner />
                </Loading>
              )}
            </Grid>

            <Grid item xs={3} as='aside'>
              <Sides ref={resizeObserver.ref} resizeObserver={resizeObserver}>
                {vendor?.deliveryFee !== undefined &&
                  vendor.deliveryFee !== undefined && (
                    <DeliveryInfo vendorModel={vendorModel}>
                      {vendorModel.getVendorState() ===
                        VendorModel.VendorStates.OUTOFSCOPE && (
                        <FlexBox
                          alignItems='center'
                          justify='space-between'
                          onClick={() => dispatch(showModalAction(true))}
                        >
                          <Text
                            scale='caption'
                            colorName='accent2'
                            weight='bold'
                          >
                            {t('order:checkout.change-address')}
                          </Text>
                          &nbsp;
                          <ChevronDownIcon fill='var(--sf-accent2-main)' />
                        </FlexBox>
                      )}
                    </DeliveryInfo>
                  )}
                <Basket />
              </Sides>
            </Grid>

            <ProductDetails
              isOpenModal={productDetail.isOpenModal}
              handleClose={toggleProductDetailModal}
              vendorStates={vendorModel.getVendorState()}
              vendorCode={vendor?.vendorCode || null}
              product={productDetail.product}
            />
          </Grid>
        )}
        <VendorDetail
          isOpen={isOpen}
          vendorModel={vendorModel}
          vendorComments={vendorComments!}
          getMoreComments={getMoreComments}
          onSort={handleSort}
          handleClose={toggleCommentsModal}
        />
        {!isLoading && !isAddressEmptyWithOutOfScope && (
          <VendorMessageModal
            vendorMessageIsOpen={vendorMessageIsOpen}
            vendorMessage={vendor?.vendorStateText}
            handleClose={toggleVendorMessageModal}
          />
        )}
      </Page>
    </>
  )
}

ZooketPage.getInitialProps = async (ctx: CTX) => {
  const {
    store,
    isServer,
    query,
    activeLocation: {latitude = -1, longitude = -1} = {},
  } = ctx
  menuSideEffects(ctx)

  if (isServer) {
    const {vendorCode} = getVendorCodeFromQuery(query)

    // fetch zooket details
    const newLocationCacheKey = `lat=${latitude}&long=${longitude}`
    const q = decodeQueryParams(ParamConfig, query)
    await store.dispatch(
      fetchZooketDetail({
        vendorCode,
        lat: latitude,
        long: longitude,
        locationCacheKey: newLocationCacheKey,
      })
    )

    await store.dispatch(getVendorComments({page: 0, vendorCode}))

    if (q.cat_ids) {
      await store.dispatch(
        fetchZooketProducts({
          vendorCode,
          menu_category_id: Number(q.cat_ids[q.cat_ids.length - 1]),
          fetch_categories: 1,
        })
      )
    }

    // fetch basket
    const allCookies = cookies(ctx)
    const basketId = basketIdStorage.extract(vendorCode, allCookies)
    const {vendor} = selectSlice(store.getState())
    if (basketId && vendor) {
      await store.dispatch(initialBasketInServer(vendor, basketId))
    }
  }
}

export default withProductContext(ZooketPage)
