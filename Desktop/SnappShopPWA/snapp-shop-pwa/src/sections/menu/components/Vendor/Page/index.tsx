import React, {useContext, useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import {useRouter} from 'next/router'
import {rem} from 'polished'
import {useTranslation} from 'react-i18next'
import {useSelector} from 'react-redux'
import {
  selectLocation,
  showModal as showModalAction,
} from '~growth/redux/location'
import cookies from 'next-cookies'

import {
  Button,
  Grid,
  Text,
  CircleInfo,
  Spinner,
  ChevronDownIcon,
  FlexBox,
} from '@sf/design-system'
import {RateCommentBadge} from '@components/RateCommentBadge'
import {VendorStateBadge} from '@components/VendorStateBadge'
import {CTX, SimplePageComponent} from '@root/types'
import {useAppDispatch} from '@redux'
import {initialBasketInServer} from '@slices/baskets'
import {
  fetchDetailsStatic,
  getVendorComments,
  selectCategories,
  selectVendor,
  selectComments,
  fetchDetailsDynamic,
  selectSlice,
  clearCache,
  selectSearchCategories,
} from '~menu/redux/vendor'

import menuSideEffects from '~menu/helpers'
import {Categories} from '~menu/components/Vendor/Categories'
import {CategorySections} from '~menu/components/Vendor/CategorySections'
import {VendorLogo} from '@components/VendorLogo'
import {DiscountBadge} from '@components/DiscountBadge'
import {DeliveryBadge} from '@components/DeliveryBadge'
import {VendorMessageModal} from '@components/VendorMessageModal'
import {getVendorCodeFromQuery, VendorModel, VENDOR_TYPES} from '@schema/vendor'
import {Product, ProductVariation, ToppingBase} from '@schema/product'
import {useCustomEvent} from '@hooks/useCustomEvent'
import {SEARCH_PLACE_HOLDER_EVENT} from '~search/components/SearchModal'
import {VendorDetail} from '~menu/components/VendorDetail'
import Basket from '~order/components/Basket'
import {useBasketProduct, useVendorBasket} from '@hooks/useBasket'
import {useVendorMessage} from '@hooks/useVendorMessage'
import useBasket from '@hooks/useBasket'
import {DefaultLayout} from '@root/Layout'
import useResizeObserver from '@hooks/useResizeObserver'
import {useScroll} from '@hooks/useScrollDirection'
import {
  CommentsSort,
  SortType,
  isVendorStaticErrorResponse,
  PromiseAnyAction,
} from '~menu/types'
import {ProductDetails} from '~menu/components/Vendor/ProductDetails'
import {ProductCard} from '~menu/components/ProductCard'

import ToppingModal from '~menu/components/ToppingModal'
import {ProductContext, withProductContext} from '@contexts/Product'
import {basketIdStorage} from '@utils'
import {useBodyColor} from '@hooks/useBodyColor'
import {useBreadcrumb} from '@contexts/Breadcrumb'
import {useRudderStack} from '@contexts/RudderStack'
import {eventTypes} from '@schema/rudderStack'
import {useOpenAddressModal} from '~growth/hooks/useOpenAddressModal'

import {useQueryParams, StringParam, NumberParam} from 'use-query-params'
import {useSelectVendorProducts} from '@hooks/useSelectVendorProducts'
import {PageTypes, SEOSchema} from '@schema/seo'
import {useVendorSeoTitle} from '@components/CustomHead/hooks/useVendorSeotitle'
import {CustomHead} from '@components/CustomHead'

interface SidesProps {
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
const SideNav = styled(FlexBox).attrs({dir: 'ltr', as: 'nav'})`
  height: calc(100vh - 180px - 152px);
  min-height: ${rem(150)};
  overflow-y: auto;

  > * {
    margin-bottom: ${rem(16)};
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
  width: ${rem(202)};

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

// Vendor page component
const VendorPage: SimplePageComponent = () => {
  useOpenAddressModal()
  useBodyColor('main')
  const router = useRouter()
  const {t} = useTranslation()
  const dispatch = useAppDispatch()
  const resizeObserver = useResizeObserver()

  const vendor = useSelector(selectVendor)
  const vendorComments = useSelector(selectComments)
  const categories = useSelector(selectCategories)
  const searchCategories = useSelector(selectSearchCategories)
  const {isLoading, locationCacheKey} = useSelector(selectSlice)
  const {activeLocation: {lat = -1, long = -1} = {}} = useSelector(
    selectLocation
  )
  const {dispatchEvent} = useCustomEvent({typeArg: SEARCH_PLACE_HOLDER_EVENT})
  const [isOpen, setIsOpen] = useState(false)

  const [searchResult, setSearchResult] = useState<ProductVariation[]>([])
  const [vendorMesageIsOpen, setVendorMesageIsOpen] = useVendorMessage({
    vendor,
    isLoading,
  })
  const commentsCurrentPage = useRef(1)
  const [sortType, setSortType] = useState<SortType>('score')
  const [productDetail, setProductDetail] = useState<{
    isOpenModal: boolean
    products: Product[]
  }>({
    isOpenModal: false,
    products: [],
  })
  const ParamConfig = {
    query: StringParam,
    productId: NumberParam,
  }

  const querySearch = router.query.query

  const [query, setQuery] = useQueryParams(ParamConfig)
  const breadcrumb = useBreadcrumb()
  const rudderStack = useRudderStack()
  const location = useSelector(selectLocation)

  const promise = useRef<PromiseAnyAction | null>(null)

  const vendorModel = new VendorModel(vendor!)
  const newLocationCacheKey = `lat=${lat}&long=${long}`
  const hasVendorstateBadge = vendorModel.hasVendorStateBadge()
  const isAddressEmptyWithOutOfScope =
    vendorModel.getVendorState() === VendorModel.VendorStates.OUTOFSCOPE &&
    location.areaAddress === ''

  const {basket} = useBasket()
  const {handleProductAction} = useBasketProduct()
  const {setContextState} = useContext(ProductContext)

  const {vendorCode, isOldUrl} = getVendorCodeFromQuery(router.query)

  const seoVendorTitle = useVendorSeoTitle(vendor)
  let canonicalLink = null
  if (isOldUrl && vendor) {
    canonicalLink = vendorModel.getVendorLink(true)
  }
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
    canonical: canonicalLink,
  }

  useVendorBasket({vendor, basketType: ['normal']}, vendorCode as string)

  useSelectVendorProducts({
    vendor,
    isLoading,
    categories,
    setProductDetail,
  })

  useEffect(() => {
    dispatch(clearCache())

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
    } else {
      dispatchEvent(
        t('search-placholder', {
          text: '',
        })
      )
    }
  }, [vendor?.vendorCode, vendorCode, query.query, query.productId])

  useEffect(() => {
    async function getData() {
      const {payload} = await dispatch(fetchDetailsStatic({vendorCode}))
      if (isVendorStaticErrorResponse(payload) && payload!.code === 301) {
        const {service} = router.query
        const pathname = `/${service}/menu/${vendorCode}`
        const search = '?vendorType=shop'
        router.replace({pathname, search})
      }
      promise.current = dispatch(
        fetchDetailsDynamic({
          vendorCode,
          lat,
          long,
          locationCacheKey: newLocationCacheKey,
        })
      )
    }

    if ((vendor?.vendorCode !== vendorCode || !vendor) && !isLoading) {
      getData()
    }
    if (vendorComments.count == undefined) {
      dispatch(
        getVendorComments({
          vendorCode: String(vendorCode),
          page: 0,
          sortType: sortType,
        })
      )
    }
  }, [vendor, vendorCode])

  useEffect(() => {
    if (isLoading || newLocationCacheKey === locationCacheKey) return
    dispatch(
      fetchDetailsDynamic({
        vendorCode,
        lat,
        long,
        locationCacheKey: newLocationCacheKey,
      })
    )

    return () => {
      promise.current?.abort()
    }
  }, [lat, long])

  useEffect(() => {
    const result = VendorModel.searchVendorMenu(searchCategories, querySearch)
    setSearchResult(result)
  }, [query.query])

  useEffect(() => {
    breadcrumb.changeBreadcrumbState({
      serviceAliasType: vendor?.superTypeAlias ?? vendor?.vendorType,
      isVendorDetail: true,
      vendorTitle: vendor?.title,
    })
  }, [vendor])

  useEffect(() => {
    rudderStack.eventTrigger({
      type: eventTypes.pageView,
      page_category: vendor?.superTypeAlias ?? vendor?.vendorType,
      page_name: vendor?.title,
    })
  }, [rudderStack])

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
  function toggleVendorMessageModal() {
    setVendorMesageIsOpen(!vendorMesageIsOpen)
  }

  function handleSelectProduct(products: Product[]) {
    setProductDetail(state => {
      return {isOpenModal: !state.isOpenModal, products: products}
    })
  }

  function toggleProductDetailModal() {
    setProductDetail(state => {
      return {...state, isOpenModal: !state.isOpenModal}
    })
  }

  function handleClearQuery() {
    if (query?.query) {
      setQuery(
        {
          query: '',
        },
        'replaceIn'
      )
    }
  }

  function addProduct(product: Product) {
    if (lat && long) {
      if (product?.productToppings?.length) {
        setContextState!({activeProduct: product, isToppingModalOpen: true})
      } else {
        handleProductAction({...product, toppings: []}, 'add')
      }
    } else {
      dispatch(showModalAction(true))
    }
  }

  function removeProduct(product: Product, toppings: ToppingBase[]) {
    handleProductAction({...product, toppings}, 'remove')
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

                      <Text
                        scale='large'
                        as='h1'
                        ellipsis
                        weight='bold'
                        data-test='vendor-title'
                      >
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
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      <CircleInfo />
                      <Text scale='body' colorName='inherit'>
                        {t('menu:comments-and-info')}
                      </Text>
                    </Button>
                  </div>
                </VendorInfo>
                <SideNav direction='column' onClick={handleClearQuery}>
                  <Categories categories={categories} />
                </SideNav>
              </Sides>
            </Grid>
            <Grid item xs={6} as='section'>
              <CategorySections
                queryParam={query}
                handleClearQuery={handleClearQuery}
                categories={categories}
                searchRes={searchResult}
                renderProducts={(productVariations, categoryId) =>
                  productVariations.map(productVariation => (
                    <Grid
                      xs={6}
                      item
                      key={categoryId + String(productVariation.id)}
                      onClick={() =>
                        handleSelectProduct(productVariation.products)
                      }
                    >
                      <ProductCard
                        vendorCode={vendorCode}
                        products={productVariation.products}
                        vendorStates={vendorModel.getVendorState()}
                        cursor='pointer'
                        addProduct={product => addProduct(product)}
                        removeProduct={(product, toppings) =>
                          removeProduct(product, toppings)
                        }
                      />
                    </Grid>
                  ))
                }
              ></CategorySections>
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
              isOpen={productDetail.isOpenModal}
              handleClose={toggleProductDetailModal}
              vendorStates={vendorModel.getVendorState()}
              products={productDetail.products}
              vendorTypeTitle={vendor?.newTypeTitle}
              addProduct={product => addProduct(product)}
              removeProduct={(product, toppings) =>
                removeProduct(product, toppings)
              }
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

        <ToppingModal />
        {!isLoading &&
          (!basket || !basket.products?.length) &&
          !isAddressEmptyWithOutOfScope &&
          vendor?.vendorStateText !== '' && (
            <VendorMessageModal
              vendorMessageIsOpen={vendorMesageIsOpen}
              vendorMessage={vendor?.vendorStateText}
              handleClose={toggleVendorMessageModal}
            />
          )}
      </Page>
    </>
  )
}

VendorPage.getInitialProps = async (ctx: CTX) => {
  menuSideEffects(ctx)
  const {
    res,
    store,
    isServer,
    query,
    activeLocation: {latitude = -1, longitude = -1} = {},
  } = ctx
  if (isServer) {
    // fetch vendor details
    const newLocationCacheKey = `lat=${latitude}&long=${longitude}`

    const {vendorCode} = getVendorCodeFromQuery(query)

    const {payload} = await store.dispatch(
      fetchDetailsStatic({vendorCode, lat: latitude, long: longitude})
    )

    if (isVendorStaticErrorResponse(payload) && payload!.code === 301) {
      const {service} = query
      const pathname = `/${service}/menu/${vendorCode}`
      const search = '?vendorType=shop'
      res!.writeHead(301, {Location: `${pathname}${search}`}).end()
    }

    await store.dispatch(
      fetchDetailsDynamic({
        vendorCode,
        lat: latitude,
        long: longitude,
        locationCacheKey: newLocationCacheKey,
      })
    )
    await store.dispatch(getVendorComments({page: 0, vendorCode}))

    // fetch basket
    const allCookies = cookies(ctx)
    const basketId = basketIdStorage.extract(vendorCode, allCookies)
    const vendor = selectVendor(store.getState())
    if (basketId && vendor) {
      await store.dispatch(initialBasketInServer(vendor, basketId))
    }
  }
}

export default withProductContext(VendorPage)
