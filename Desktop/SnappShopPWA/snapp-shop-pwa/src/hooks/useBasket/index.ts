import {useContext, useEffect} from 'react'
import Router, {useRouter} from 'next/router'
import {useSelector} from 'react-redux'

import {ProductContext} from '@contexts/Product'
import {ProductBase} from '@schema/product'
import {useAppDispatch} from '@redux'
import {
  basketActions,
  handleProduct,
  addDescription,
  selectBasket,
  selectProductCount,
  selectProductToppings,
  recreateBasket,
} from '@slices/baskets'
import {BasketType, CreatePayload, HandleAction} from '@schema/basket'
import useUpdateAddress from '@hooks/useUpdateAddress'
import {
  getVendorCodeFromQuery,
  VendorBase,
  VendorBaseModel,
} from '@schema/vendor'
import {basketIdStorage} from '@utils'
import useClearVoucher from '@hooks/useClearVoucher'
import useBasketError from '@hooks/useBasketError'

import {previousOrder, Reorders} from '~order/types'
import {selectActiveAddressId} from '~growth/redux/location'
import {setActive as setActiveAction} from '~growth/redux/location'
import {selectAddresses} from '@slices/core'

type Data = Omit<CreatePayload, 'vendor'> & {vendor: VendorBase | null}
function isCreatePayload(data: Data): data is CreatePayload {
  return !!(data as CreatePayload)?.vendor
}

export const useVendorBasket = (data: Data, vendorCode: string) => {
  const {setContextState} = useContext(ProductContext)

  useEffect(() => {
    if (!isCreatePayload(data)) return
    if (data.vendor.vendorCode === vendorCode) {
      setContextState!({vendorState: data})
    }
  }, [vendorCode, data.vendor])
}

export const useBasketProduct = (productId?: number) => {
  const router = useRouter()

  const dispatch = useAppDispatch()

  const {vendorCode} = getVendorCodeFromQuery(router.query)

  const {vendorState} = useContext(ProductContext)

  const count = useSelector(selectProductCount(productId, vendorCode))
  const toppings = useSelector(selectProductToppings(productId, vendorCode))
  const handleProductAction = (product: ProductBase, action: HandleAction) => {
    if (vendorState) {
      dispatch(handleProduct(vendorState, product, action))
    }
  }

  return {count, toppings, handleProductAction}
}

export const useReorder = () => {
  const dispatch = useAppDispatch()
  const activeAddressId = useSelector(selectActiveAddressId)
  const userAddresses = useSelector(selectAddresses)

  const handleReorder = (
    reorder: Reorders | previousOrder,
    addressId?: string | number
  ) => {
    let acceptingAddressId = activeAddressId
    if (userAddresses && addressId && addressId !== activeAddressId) {
      const basketLocation = userAddresses.find(
        address => address.id == addressId
      )
      if (basketLocation) {
        dispatch(setActiveAction(basketLocation))
        acceptingAddressId = addressId
      }
    }

    const data: CreatePayload = {
      basketType: ['normal'] as BasketType[],
      vendor: {...reorder, id: reorder.vendorId, title: reorder.vendorTitle},
      addressId: acceptingAddressId,
    }
    dispatch(recreateBasket(data, reorder.products))

    const vendor = new VendorBaseModel(reorder)
    Router.push(vendor.getLink())
  }

  return handleReorder
}
const useBasket = () => {
  const router = useRouter()

  const {vendorCode} = getVendorCodeFromQuery(router.query)

  const dispatch = useAppDispatch()

  const {vendorState, activeCoupon, setContextState} = useContext(
    ProductContext
  )

  const basket = useSelector(selectBasket(vendorCode))

  useBasketError(vendorCode)
  useUpdateAddress(vendorCode)

  useClearVoucher(vendorCode)

  useEffect(() => {
    basketIdStorage.store(vendorCode, basket?.id)
  }, [basket?.id])

  const setDescription = (description: string) => {
    if (vendorCode) {
      dispatch(addDescription({vendorCode, description}))
    }
  }

  const handleProductAction = (product: ProductBase, action: HandleAction) => {
    if (vendorState) {
      const data = {...vendorState, coupon: activeCoupon}
      dispatch(handleProduct(data, product, action))
    }
  }

  const clearBasket = () => {
    if (vendorCode) {
      dispatch(basketActions.clearBasket(vendorCode))
    }
  }

  const removeCoupon = () => {
    if (basket) {
      dispatch(basketActions.updateBasket({vendorCode, selectedCoupon: null}))
    }
    setContextState!({activeCoupon: undefined})
  }

  return {
    basket,
    handleProduct: handleProductAction,
    setDescription,
    clearBasket,
    removeCoupon,
  }
}

export default useBasket
