import {AddressDetails, ReverseAddressItem} from '@schema/location'

export function formatAddress(address: AddressDetails['autoAddress'] = []) {
  const ACCEPT_TYPE = [
    'meta_neighbourhood',
    'trunk',
    'relation',
    'residential',
    'secondary',
    'primary',
  ]
  let addressText: string | string[] | ReverseAddressItem[] = ''
  let areaName = ''
  if (address && address.length) {
    const checkLastItemArray =
      address && address.length
        ? ACCEPT_TYPE.find(item => {
            return item == address[0].type
          })
        : null

    if (!checkLastItemArray) {
      addressText = address.slice(1)
    } else {
      addressText = address
    }

    addressText = addressText.filter(item => {
      if (item.type == 'meta_neighbourhood') {
        areaName = item.name
      }
      return (
        item.type !== 'meta_suburb' &&
        item.type !== 'meta_province' &&
        item.type !== 'meta_city' &&
        item.type !== 'meta_county' &&
        item.type !== 'meta_neighbourhood'
      )
    })
    addressText = addressText.map(item => `${item.name}، `)
    addressText = addressText.reverse().join('')
    const metaText = address.find(
      item => item.type === 'meta_province' || item.type === 'meta_county'
    )
    areaName = areaName || (metaText ? metaText.name : 'موقعیت انتخابی')
  }
  areaName = areaName || 'موقعیت انتخابی'
  const cityName = address.find(item => item.type === 'meta_city')?.name
  const countyName = address.find(item => item.type === 'meta_county')?.name
  const provinceName = address.find(item => item.type === 'meta_province')?.name
  return {
    addressText,
    areaName,
    cityName,
    countyName,
    provinceName,
  }
}
