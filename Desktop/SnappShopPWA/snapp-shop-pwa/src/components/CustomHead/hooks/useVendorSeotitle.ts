import {Vendor} from '@schema/vendor'
import {useTranslation} from 'react-i18next'

export const useVendorSeoTitle = (vendor: Vendor | null) => {
  const {t} = useTranslation()
  const regExp = /\(([^)]+)\)/g
  const matches = regExp.exec(vendor?.title || '')
  const vendorInfo = {
    vendorTitle: vendor?.title,
    area: matches && matches.length > 0 ? '' : vendor?.area,
  }
  const sp = vendor?.vendorType?.toLowerCase()
  if (sp) {
    return t(`seo.titles.vendors_${sp}`, vendorInfo)
  } else {
    return t('seo.titles.vendors', vendorInfo)
  }
}
