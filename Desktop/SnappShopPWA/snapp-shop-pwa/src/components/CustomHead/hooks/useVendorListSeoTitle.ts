import {PageTypes, SEOSchema} from '@schema/seo'
import {useTranslation} from 'react-i18next'
import {getCityTitle} from '@utils'
interface SEOData {
  title: string | null
  description: string | null
}

export const useVendorListSeoTitle = ({
  asPath = '',
  superType = null,
  service = null,
  cityTitle = null,
  cityName = null,
  areaName = null,
  area = null,
  image = '',
  vendorItems = '',
  canonical = '',
  chainName = null,
}) => {
  const {t} = useTranslation()
  const currentCityName = (cityName && getCityTitle(String(cityName))) || null
  if (!superType && !service)
    return {
      title: null,
      description: '',
      image: '',
      url: `${t('seo.base_url')}/${asPath}`,
      page: PageTypes.VENDOR_LIST,
    }

  const data: (
    type: string | string[],
    cityTitle: string | null,
    area: string | null,
    service: string | null,
    chanin?: string | null
  ) => SEOData = (
    type: string | string[],
    cityTitle: string | null,
    area: string | null
  ): SEOData => {
    if (service && String(service).toLowerCase() === 'all') {
      return {
        title: t('seo.titles.all_city', {cityTitle}),
        description: t('seo.descriptions.all_city', {
          cityTitle,
        }),
      }
    }

    if (chainName) {
      return {
        title: t('seo.titles.chain', {chainName}),
        description: t('seo.descriptions.chain', {chainName}),
      }
    }

    const sp = t(`core:vendorTypes.${type}`)
    return {
      title: t(
        `seo.titles.${sp && sp.toLowerCase()}${cityTitle ? '_city' : ''}${
          area ? '_area' : ''
        }`,
        {cityTitle, area}
      ),

      description: t(
        `seo.descriptions.${sp && sp.toLowerCase()}${cityTitle ? '_city' : ''}${
          area ? '_area' : ''
        }`,
        {
          cityTitle,
          area,
        }
      ),
    }
  }
  const metaData: SEOSchema = {
    ...data(
      superType || '0',
      cityTitle || currentCityName,
      area || areaName,
      service,
      chainName
    ),
    image: image,
    url: `${t('seo.base_url')}/${asPath}`,
    page: PageTypes.VENDOR_LIST,
    vendorItems,
    canonical,
  }

  return metaData
}
