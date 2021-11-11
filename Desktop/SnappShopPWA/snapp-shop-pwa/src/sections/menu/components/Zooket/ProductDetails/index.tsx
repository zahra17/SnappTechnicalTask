import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {useDispatch, useSelector} from 'react-redux'
import {useAppDispatch} from '@redux'
import {rem} from 'polished'
import {useTranslation} from 'react-i18next'
import {Product, ProductModel} from '@schema/product'
import {
  isProductDetailsType,
  ProductChildren,
  ZooketProductDetailsData,
} from '~menu/types'
import {VendorModel, VendorStates} from '@schema/vendor'
import {ModalHeader} from '@components/ModalTools'
import BasketAction from '@components/BasketAction'
import AddRemove from '@components/AddRemove'
import {ImageSlider} from '@components/ImageSlider'
import {useBasketProduct} from '@hooks/useBasket'
import {
  Modal,
  FlexBox,
  Text,
  Price,
  Spinner,
  Triangle,
  toPersian,
  ChevronDownIcon,
  colors,
} from '@sf/design-system'
import {
  useQueryParams,
  DelimitedNumericArrayParam,
  NumberParam,
} from 'use-query-params'

import {
  selectLocation,
  showModal as showModalAction,
} from '~growth/redux/location'
import {getZooketProductDetails, selectZooketVendor} from '~menu/redux/zooket'
import {Img} from '@components/Img'
import {DeliveryBadge} from '@components/DeliveryBadge'
import {VendorRateBadge} from '@components/VendorRateBadge'
import ProductTabs from './tab'
import {ProductAttributes} from './productAttributes'
import {multilineEllipsis} from '@utils'

interface Props {
  vendorStates: VendorStates
  vendorCode: string | null
  isOpenModal: boolean
  product: Product | null
  handleClose: () => void
}

const ActiveChilds = styled(FlexBox).attrs({
  direction: 'column',
})`
  position: absolute;
  top: calc(100% + 2px);
  right: 0;
  left: 0;
  z-index: 20;
  box-sizing: border-box;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: var(--white2);
  border: 1px solid var(--gray6-color);
  border-radius: 6px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.12);
`
const ActiveChildsItem = styled(FlexBox)`
  box-sizing: border-box;
  width: 100%;
  padding: ${rem(8)} ${rem(12)};
  cursor: pointer;
  user-select: none;

  &:first-child {
    padding-top: ${rem(18)};
  }

  &:last-child {
    padding-bottom: ${rem(18)};
  }
`
const BrandTitle = styled(Text)`
  margin-top: 8px;
  color: var(--gray5-color);
`
const ContentContainer = styled(FlexBox)`
  box-sizing: border-box;
  width: calc(100% - 32px);
  margin: ${rem(16)};
  margin-bottom: ${rem(36)};
  border: 1px solid var(--gray7-color);
  border-radius: 6px;
`

const ShiftCard = styled(FlexBox)`
  width: ${rem(720)};
  max-height: calc(90vh - 2rem);
  overflow-y: scroll;
`

const ProductDetailsHeader = styled(FlexBox)`
  padding: ${({theme}) => theme.spacing[2]};
  padding-top: 0;
`
const Details = styled(FlexBox)`
  width: ${rem(384)};
`

const ProductTitle = styled(FlexBox)`
  margin-bottom: ${({theme}) => theme.spacing[2]};
`

const Loading = styled.div`
  height: ${rem(310)};
`

const SelectActiveChilds = styled(FlexBox)`
  position: relative;
  width: 198px;
  max-width: 100%;
  margin-bottom: ${rem(36)};
  border-style: none;
`
const SelectInputWrapper = styled(FlexBox)`
  width: 100%;
  height: 48px;
  border: 1px solid var(--gray6-color);
  border-radius: 6px;
  outline: none;
  cursor: pointer;

  .value-container {
    margin-right: ${rem(16)};
  }

  svg {
    margin-left: ${rem(18)};
    transform: scale(1.4, 1.6);
  }
`
const SelectInput = styled(FlexBox)`
  width: 100%;
  padding-right: 0;
  font-size: ${rem(14)};
  background-color: var(--white);
  border-style: none;
  user-select: none;
`
const ShowMoreDescription = styled(FlexBox).attrs({
  alignItems: 'center',
  justify: 'flex-end',
})`
  margin: ${rem(24)};
  cursor: pointer;

  svg {
    margin-right: ${rem(6)};
  }
`
const PropertyIcon = styled(Img)`
  width: 16px;
  height: 16px;
  margin-left: ${rem(8)};
  border: 1px solid var(--black);
  border-radius: 50%;
  user-select: none;
`

const TitleAndDelivery = styled(FlexBox)`
  margin-right: ${rem(12)};
`

const VendorDetail = styled(FlexBox)`
  margin: ${rem(6)} ${rem(14)};
  padding: ${rem(12)};
  border: 1px solid var(--gray7-color);
  border-radius: 6px;
`

const ParamConfig = {
  cat_ids: DelimitedNumericArrayParam,
  productId: NumberParam,
}

interface ProductPrice {
  price: number
  discount: number
  discountRatio: number
}

interface ProductProperty {
  image: string
  title: string
}
export const ProductDetails: React.FC<Props> = ({
  isOpenModal,
  product,
  vendorStates,
  vendorCode,
  handleClose = () => {},
}) => {
  if (!product || !vendorCode) return null

  const [
    productDetails,
    setProductDetails,
  ] = useState<ZooketProductDetailsData | null>(null)

  const {t} = useTranslation()
  const dispatch = useDispatch()
  const appDispatch = useAppDispatch()
  const {count, handleProductAction} = useBasketProduct(product.id)
  const [queryParam, setQuery] = useQueryParams(ParamConfig)
  const location = useSelector(selectLocation)
  const productModel = new ProductModel(product)
  const [property, setProperty] = useState<ProductProperty | null>(null)
  const [isSelectPropertyOpen, setIsSelectPropertyOpen] = useState<boolean>(
    false
  )
  const [{price, discount, discountRatio}, setPrice] = useState<ProductPrice>({
    price: product.price,
    discount: product.discount,
    discountRatio: product.discountRatio,
  })
  const vendor = useSelector(selectZooketVendor)
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const vendorModel = vendor && new VendorModel(vendor)

  // for handling show more button of product description
  const [showMoreDescription, setShowMoreDescription] = useState<boolean>(false)

  useEffect(() => {
    if (!productDetails && isOpenModal) {
      getProductDetails(product.id, vendorCode)
    }
  }, [isOpenModal])

  const addProduct = () => {
    if (location.activeLocation?.lat && location.activeLocation?.long) {
      handleProductAction({...product, toppings: []}, 'add')
    } else {
      dispatch(showModalAction(true))
    }
  }

  const removeProduct = () => {
    handleProductAction({...product, toppings: []}, 'remove')
  }

  async function getProductDetails(
    productVariationId: number,
    vendorCode: string
  ) {
    const {payload} = await appDispatch(
      getZooketProductDetails({
        productVariationId: String(productVariationId),
        vendorCode,
      })
    )

    if (isProductDetailsType(payload)) {
      setProductDetails(payload)
    }
  }

  const handleCloseModal = () => {
    setProductDetails(null)
    handleClose()
    if (queryParam.productId) {
      setQuery({productId: null}, 'replaceIn')
    }
  }

  const isDisabledAddButton = productModel.isDisableProduct(count, vendorStates)
  const isDisabledUntil = productModel.isDisabledUntil()
  const isStuckOver = productModel.isStuckOver(count)

  useEffect(() => {
    if (productDetails?.children?.childProducts?.length || 0 > 0) {
      const {
        price,
        discount,
        discountRatio,
        propertyIcon,
        propertyTitle,
      } = productDetails?.children?.childProducts[0] || {
        price: 0,
        discount: 0,
        discountRatio: 0,
        propertyIcon: '',
        propertyTitle: '',
      }
      setProperty({
        image: propertyIcon,
        title: propertyTitle,
      })

      setPrice({
        price,
        discount,
        discountRatio,
      })
    }
  }, [productDetails])

  const onSelectInputClicked = () => {
    setIsSelectPropertyOpen(!isSelectPropertyOpen)
  }

  const onActiveChildItemsClick = (item: ProductChildren) => {
    const {price, discount, discountRatio, propertyTitle, propertyIcon} = item

    setProperty({
      image: propertyIcon,
      title: propertyTitle,
    })
    setPrice({
      price,
      discount,
      discountRatio,
    })
    setIsSelectPropertyOpen(false)
  }

  const onShowMoreDescriptionClick = () => {
    setShowMoreDescription(true)
  }

  return (
    <Modal
      isOpen={isOpenModal}
      onClose={handleCloseModal}
      animation='slideUp'
      backdropColor='var(--modal-backdrop)'
    >
      <ModalHeader onClose={handleCloseModal} />
      <ShiftCard direction='column'>
        {productDetails?.details ? (
          <>
            <ProductDetailsHeader justify='space-between'>
              <ImageSlider
                width={280}
                height={280}
                images={product.images}
                alt={product.title}
              />

              <Details direction='column' justify='flex-start'>
                <ProductTitle justify='center' direction='column'>
                  <Text scale='caption' weight='normal'>
                    {product.title}
                  </Text>
                  <BrandTitle scale='caption' weight='normal' as='span'>
                    {productDetails.brand.title}
                  </BrandTitle>
                </ProductTitle>

                {productDetails.children?.childProducts?.length > 0 && (
                  <SelectActiveChilds>
                    <SelectInputWrapper
                      justify='space-between'
                      alignItems='center'
                      onClick={onSelectInputClicked}
                    >
                      <FlexBox alignItems='center' className='value-container'>
                        {property && (
                          <>
                            <PropertyIcon src={property.image} />
                            <SelectInput>
                              {toPersian(property.title)}
                            </SelectInput>
                          </>
                        )}
                      </FlexBox>
                      <Triangle />
                    </SelectInputWrapper>

                    {isSelectPropertyOpen && (
                      <ActiveChilds>
                        {productDetails?.children?.childProducts.map(item => (
                          <ActiveChildsItem
                            key={item.id}
                            onClick={() => onActiveChildItemsClick(item)}
                          >
                            <PropertyIcon src={item.propertyIcon} />
                            <Text scale='body' weight='normal'>
                              {item.propertyTitle}
                            </Text>
                          </ActiveChildsItem>
                        ))}
                      </ActiveChilds>
                    )}
                  </SelectActiveChilds>
                )}

                <BasketAction>
                  <Price
                    discountBadgeColor='accent'
                    unavailable={
                      (isStuckOver || isDisabledUntil) &&
                      count !== product.stock
                    }
                    value={price - discount}
                    oldPrice={discount && price}
                    discount={discountRatio}
                  />
                  <AddRemove
                    stock={(product.stock ?? 0) - (count ?? 0)}
                    appearance='solid'
                    round
                    count={count ?? 0}
                    onClickAdd={addProduct}
                    onClickRemove={removeProduct}
                    disableAdd={isDisabledAddButton}
                  />
                </BasketAction>
              </Details>
            </ProductDetailsHeader>

            {vendor && (
              <VendorDetail justify='space-between' alignItems='center'>
                <FlexBox alignItems='center'>
                  <Img width='32' height='32' src={vendor.logo} />
                  <TitleAndDelivery direction='column'>
                    <Text scale='body' width='bold'>
                      {vendor.title}
                    </Text>
                    <DeliveryBadge
                      vendorModel={vendorModel!}
                      style={{paddingRight: '0', boxShadow: 'none'}}
                    />
                  </TitleAndDelivery>
                </FlexBox>
                <FlexBox alignItems='center'>
                  <VendorRateBadge
                    rate={vendor.rating ? vendor.rating / 2 : 0}
                    hasBorder={true}
                  />
                  {vendor.voteCount && (
                    <Text
                      scale='caption'
                      weight='normal'
                      color='var(----gray5-color)'
                    >
                      ({`${toPersian(vendor.voteCount)} ${t('score')}`})
                    </Text>
                  )}
                </FlexBox>
              </VendorDetail>
            )}
            {(productDetails.attributes.length > 0 ||
              productDetails.details?.description) && (
              <>
                <ProductTabs
                  activeIndex={activeTabIndex}
                  hasProductAttributes={productDetails.attributes.length > 0}
                  hasProductDetail={!!productDetails.details.description}
                  activeIndexLength={
                    productDetails.attributes.length > 0 &&
                    !!productDetails.details.description
                      ? 2
                      : (productDetails.attributes &&
                          productDetails.attributes.length > 0) ||
                        !!productDetails.details.description
                      ? 1
                      : 0
                  }
                  onChange={activeIndex => {
                    setActiveTabIndex(activeIndex)
                  }}
                />
                <ContentContainer>
                  {activeTabIndex === 0 &&
                  productDetails.details?.description ? (
                    <div>
                      <Text
                        scale='body'
                        weight='normal'
                        style={{lineHeight: '24px', padding: rem(16)}}
                        dangerouslySetInnerHTML={{
                          __html: showMoreDescription
                            ? productDetails.details.description
                            : multilineEllipsis(
                                productDetails.details.description,
                                500
                              ),
                        }}
                      />
                      {!showMoreDescription &&
                        productDetails.details.description.length > 500 && (
                          <ShowMoreDescription
                            onClick={onShowMoreDescriptionClick}
                          >
                            <Text
                              scale='body'
                              weight='bold'
                              colorName='accent2'
                            >
                              {t('menu:show-more-description')}
                            </Text>
                            <ChevronDownIcon
                              fill={colors.accent2.main}
                              width={12}
                              height={14}
                            />
                          </ShowMoreDescription>
                        )}
                    </div>
                  ) : (
                    activeTabIndex === 1 &&
                    productDetails.attributes && (
                      <ProductAttributes
                        attributes={productDetails.attributes}
                      />
                    )
                  )}
                </ContentContainer>
              </>
            )}
          </>
        ) : (
          <Loading>
            <Spinner />
          </Loading>
        )}
      </ShiftCard>
    </Modal>
  )
}
