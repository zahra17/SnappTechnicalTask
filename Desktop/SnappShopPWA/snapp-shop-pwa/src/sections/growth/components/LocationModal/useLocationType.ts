import {MapTypes, LocationOptionType} from '@schema/location'
import {useTranslation} from 'react-i18next'

interface LocationAllOptionType {
  [key: string]: LocationOptionType
}

function useLocationType(
  step: string,
  latitude: string | number,
  hasData: number,
  selectGuestArea: (data: any) => void,
  submitNewAddress: (data: any) => void,
  selectNewArea: (data: any) => void,
  submitEditAddress: (data: any) => void
): LocationOptionType {
  const {t} = useTranslation()
  const types: LocationAllOptionType = {
    guest: {
      name: 'guest',
      pageTitle: null,
      mapType: MapTypes.edit,
      footer: {
        title: t('core:location.footer.confirm'),
        ghost: false,
        action: selectGuestArea,
        disabled: !latitude,
      },
    },
    list: {
      name: 'list',
      pageTitle: hasData ? t('core:location.selectAddress') : null,
      mapType: null,
      footer: null,
    },
    newAddress: {
      name: 'newAddress',
      pageTitle: t('core:location.newAddress'),
      mapType: MapTypes.edit,
      footer: {
        title: t('core:location.footer.confirmOnMap'),
        ghost: !latitude,
        action: selectNewArea,
        disabled: !latitude,
      },
    },
    newAddressDetails: {
      name: 'newAddressDetails',
      pageTitle: t('core:location.newAddress'),
      mapType: MapTypes.show,
      footer: {
        title: t('core:location.footer.confirmAndCreateAddress'),
        ghost: false,
        action: submitNewAddress,
        disabled: false,
      },
    },

    editAddress: {
      name: 'editAddress',
      pageTitle: t('core:location.editAddress'),
      mapType: MapTypes.edit,
      footer: {
        title: t('core:location.footer.confirmOnMap'),
        ghost: true,
        action: selectNewArea,
        disabled: false,
      },
    },
    editAddressDetails: {
      name: 'editAddressDetails',
      pageTitle: t('core:location.editAddress'),
      mapType: MapTypes.show,
      footer: {
        title: t('core:location.footer.confirmAndEditAddress'),
        ghost: false,
        action: submitEditAddress,
        disabled: false,
      },
    },
  }

  return types[step]
}

export default useLocationType
