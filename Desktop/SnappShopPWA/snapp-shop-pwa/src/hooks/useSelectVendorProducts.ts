import React, {useEffect} from 'react'
import {useRouter} from 'next/router'
import {getVendorCodeFromQuery, Vendor, VendorModel} from '@schema/vendor'
import {MenuCategory, Product} from '@schema/product'

type SetProductDetail = React.Dispatch<
  React.SetStateAction<{
    isOpenModal: boolean
    products: Product[]
  }>
>

interface SelectProduct {
  vendor: Vendor | null
  isLoading: boolean
  categories: MenuCategory[]
  setProductDetail: SetProductDetail
}

export const useSelectVendorProducts = ({
  vendor,
  isLoading,
  categories,
  setProductDetail,
}: SelectProduct) => {
  const router = useRouter()
  const {productId} = router.query

  const {vendorCode} = getVendorCodeFromQuery(router.query)
  useEffect(() => {
    if (vendor?.vendorCode === vendorCode && productId && !isLoading) {
      const products = VendorModel.findVendorProductById(categories, +productId)

      if (products.length) {
        setProductDetail(() => ({isOpenModal: true, products}))
      }
    }
  }, [vendor?.vendorCode])
}
