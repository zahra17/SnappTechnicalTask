import React from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {
  selectLocation,
  selectActiveAddress,
  showModal as showModalAction,
} from '~growth/redux/location'
import {AutoAddressCard, AddressCard} from '@components/Location'
import {Modes} from '@schema/location'

const Location: React.FC = () => {
  const location = useSelector(selectLocation)
  const activeAddress = useSelector(selectActiveAddress)

  const dispatch = useDispatch()
  const openLocationModal = () => dispatch(showModalAction(true))

  return (
    <>
      {location.mode === Modes.Address || location.mode === Modes.Area ? (
        <AddressCard
          isArea={location.mode === Modes.Area}
          address={activeAddress?.address || location.areaAddress}
          label={activeAddress?.label}
          onClick={openLocationModal}
        />
      ) : (
        <AutoAddressCard onClick={openLocationModal} />
      )}
    </>
  )
}

export default React.memo(Location)
