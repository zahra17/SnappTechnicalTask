import {useEffect} from 'react'
import {useAppDispatch} from '@redux'
import {useSelector} from 'react-redux'
import {
  selectLocation,
  showModal as showModalAction,
} from '~growth/redux/location'

export const useOpenAddressModal = () => {
  const dispatch = useAppDispatch()
  const {activeLocation: {lat = -1, long = -1} = {}} = useSelector(
    selectLocation
  )
  useEffect(() => {
    if (Number(lat) === -1 && Number(long) === -1) {
      dispatch(showModalAction(true))
    }
  }, [])
}
