import {useEffect, useState} from 'react'
import {ReverseAddressItem} from '@schema/location'

export const useFormatAddress = (address: Array<ReverseAddressItem>) => {
  const [addressFormatted, setAddressFormatted] = useState('')
  const [areaName, setAreaName] = useState('')

  const ACCEPT_TYPE = [
    'meta_neighbourhood',
    'trunk',
    'relation',
    'residential',
    'secondary',
    'primary',
  ]

  const forbiddenAddressTextTypes = [
    'meta_neighbourhood',
    'meta_suburb',
    'meta_province',
    'meta_city',
    'meta_county',
  ]

  useEffect(() => {
    let addressText
    if (address && address?.length) {
      const timeOut = setTimeout(() => {
        const checkLastItemArray = ACCEPT_TYPE.find(item => {
          return item == address[0].type
        })

        if (!checkLastItemArray) {
          addressText = address.slice(1)
        } else {
          addressText = address
        }

        addressText = addressText.filter((item: ReverseAddressItem) => {
          if (item.type == 'meta_neighbourhood') {
            setAreaName(item.name)
          }
          return !forbiddenAddressTextTypes.includes(item.type)
        })
        addressText = addressText.map(
          (item: ReverseAddressItem) => `${item.name}، `
        )
        addressText = addressText.reverse().join('')
        setAddressFormatted(addressText)
      }, 50)
      return () => {
        clearTimeout(timeOut)
      }
    }
  }, [address])

  return {addressFormatted, areaName}
}

export default useFormatAddress
