import {useContext, useEffect, useState} from 'react'
import {useSelector} from 'react-redux'

import {useAppDispatch} from '@redux'
import {Coupon} from '@schema/coupon'
import {ProductContext} from '@contexts/Product'
import {basketActions, selectBasket} from '@slices/baskets'
import {fetchCoupon, selectVendor} from '~menu/redux/vendor'

export const useCoupon = (): [
  Coupon[] | undefined,
  Coupon | null,
  (coupon: Coupon) => void
] => {
  const dispatch = useAppDispatch()

  const [coupons, setCoupons] = useState<Coupon[]>()

  const vendor = useSelector(selectVendor)
  const basket = useSelector(selectBasket(vendor?.vendorCode))
  const {activeCoupon, setContextState} = useContext(ProductContext)

  async function getCoupon() {
    if (vendor?.has_coupon || vendor?.has_packaging) {
      const {payload} = await dispatch(fetchCoupon())

      if (typeof payload === 'object') {
        setCoupons(payload.coupons)
      }
    }
  }

  useEffect(() => {
    if (!basket || basket?.verified || coupons === undefined) getCoupon()
  }, [basket?.verified])

  useEffect(() => {
    if (!basket) setContextState!({activeCoupon: undefined})
  }, [basket])

  const selectCoupon = (coupon: Coupon) => {
    if (basket) {
      dispatch(
        basketActions.updateBasket({
          vendorCode: vendor!.vendorCode,
          selectedCoupon: coupon,
        })
      )
    }
    setContextState!({activeCoupon: coupon})
  }
  const coupon = (basket ? basket.selectedCoupon : activeCoupon) ?? null

  return [coupons, coupon, selectCoupon]
}
