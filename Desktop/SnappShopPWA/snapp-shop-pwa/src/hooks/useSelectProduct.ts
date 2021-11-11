import React, {useEffect} from 'react'
import {useRouter} from 'next/router'
import {ZooketSection} from '~menu/types'
import {getVendorCodeFromQuery, Vendor, VendorModel} from '@schema/vendor'
import {Product} from '@schema/product'
import {useAppDispatch} from '@redux'
import {getZooketProductDetails} from '~menu/redux/zooket'
import {isProductDetailsType} from '~menu/types'

type SetProductDetail = React.Dispatch<
  React.SetStateAction<{
    isOpenModal: boolean
    product: Product | null
  }>
>

interface SelectProduct {
  vendor: Vendor | null
  isLoading: boolean
  sections: ZooketSection[]
  setProductDetail: SetProductDetail
}

export const useSelectProduct = ({
  vendor,
  isLoading,
  sections,
  setProductDetail,
}: SelectProduct) => {
  const router = useRouter()
  const appDispatch = useAppDispatch()
  const {productId} = router.query

  const {vendorCode} = getVendorCodeFromQuery(router.query)

  useEffect(() => {
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
        setProductDetail(() => ({isOpenModal: true, product: payload.details}))
      }
    }

    if (
      vendorCode &&
      vendor?.vendorCode === vendorCode &&
      productId &&
      !isLoading
    ) {
      const product =
        VendorModel.findShopProductById(sections, +productId) ?? null

      if (product) {
        setProductDetail(() => ({isOpenModal: true, product}))
      } else {
        getProductDetails(+productId, vendorCode)
      }
    }
  }, [vendor])
}
