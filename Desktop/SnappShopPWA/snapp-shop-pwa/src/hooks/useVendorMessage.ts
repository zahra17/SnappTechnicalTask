import {useEffect, useState, Dispatch, SetStateAction} from 'react'
import {useRouter} from 'next/router'
import {getVendorCodeFromQuery, Vendor} from '@schema/vendor'

interface Args {
  vendor: Vendor | null
  isLoading: boolean
}

export const useVendorMessage = ({
  vendor,
  isLoading,
}: Args): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const [vendorMesageIsOpen, setVendorMesageIsOpen] = useState(false)
  const router = useRouter()
  const {vendorCode} = getVendorCodeFromQuery(router.query)

  useEffect(() => {
    if (
      vendor?.vendorCode === vendorCode &&
      !isLoading &&
      vendor?.vendorStateText
    ) {
      setVendorMesageIsOpen(!vendorMesageIsOpen)
    }
  }, [vendor])

  return [vendorMesageIsOpen, setVendorMesageIsOpen]
}
