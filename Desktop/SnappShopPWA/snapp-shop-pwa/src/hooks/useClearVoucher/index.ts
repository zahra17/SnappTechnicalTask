import {useEffect} from 'react'
import {useSelector} from 'react-redux'

import {useAppDispatch} from '@redux'
import {basketActions, selectBasket} from '@slices/baskets'

const useClearVoucher = (vendorCode: string) => {
  const dispatch = useAppDispatch()

  const basket = useSelector(selectBasket(vendorCode))

  useEffect(() => {
    const voucherCode = basket?.discount?.voucherCode
    if (voucherCode) {
      dispatch(basketActions.updateBasket({vendorCode, voucherCode: ''}))
      // TODO show toast message
    }
  }, [])
}

export default useClearVoucher
