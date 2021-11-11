import {useEffect, useRef} from 'react'
import {useSelector} from 'react-redux'

import {useAppDispatch} from '@redux'
import {Address} from '@schema/address'
import {basketActions, selectBasket} from '@slices/baskets'
import {selectActiveAddressId} from '~growth/redux/location'

const useUpdateAddress = (vendorCode: string) => {
  const dispatch = useAppDispatch()

  const addressRef = useRef<Address['id']>()

  const addressId = useSelector(selectActiveAddressId)
  const basket = useSelector(selectBasket(vendorCode))

  useEffect(() => {
    if (basket?.addressId) addressRef.current = basket?.addressId
  }, [basket?.addressId])

  useEffect(() => {
    const isTheSame = !!addressId && `${basket?.addressId}` === `${addressId}`
    const isNew = `${addressRef.current}` !== `${addressId}`
    if (!vendorCode || !addressId || !basket?.verified) return

    if ((!basket.addressId || !isTheSame) && isNew) {
      dispatch(basketActions.updateBasket({addressId, vendorCode}))
    }
  }, [addressId, vendorCode, basket?.verified])
}

export default useUpdateAddress
