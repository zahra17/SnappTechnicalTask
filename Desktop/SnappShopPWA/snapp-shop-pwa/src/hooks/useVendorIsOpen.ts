import {useEffect, useState} from 'react'
import {VendorModel} from '@schema/vendor'

interface Args {
  vendorModel: VendorModel
}

export const useVendorIsOpen = ({vendorModel}: Args) => {
  const [vendorIsOpen, setVendorIsOpen] = useState(false)
  const {vendor} = vendorModel

  useEffect(() => {
    let isOpen = false
    if (vendorModel.getVendorState() === VendorModel.VendorStates.OUTOFSCOPE) {
      isOpen = vendorModel.getVendorOutOfScopeIsOpen()
    } else {
      isOpen = vendorModel.getVendorState() === VendorModel.VendorStates.OPEN
    }

    setVendorIsOpen(isOpen)
  }, [vendor])

  return vendorIsOpen
}
