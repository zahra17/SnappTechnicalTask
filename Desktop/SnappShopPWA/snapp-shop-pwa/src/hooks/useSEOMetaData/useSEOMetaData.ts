import {PageTypes, SEOSchema, vendorTypes} from '@schema/seo'
import {useTranslation} from 'react-i18next'
type Props = {
  superType?: string | string[] | null
  cityTitle?: string | string[] | null
  icon: string
  pageType: PageTypes
  path: string | null
  vendorType: vendorTypes
}

const getDescription = (
  pageType: PageTypes,
  cityTitle?: string | string[] | null,
  superType?: string | string[] | null
) => {
  const title = cityTitle || superType
  const {t} = useTranslation()
  switch (pageType) {
    case PageTypes.VENDOR_LIST:
      return t('seo.description.vendorList', {title})
    default:
      break
  }
}
function useSEOMetaData(props: Props): SEOSchema {
  const {t} = useTranslation()
  const {
    superType = undefined,
    icon = '',
    cityTitle = undefined,
    pageType,
    path,
    vendorType = vendorTypes.RESTAURANT,
  } = props

  return {
    title:
      cityTitle || superType
        ? t('seo.title', {
            text:
              `${t('seo.pre_title')} ${cityTitle || superType}` ||
              t('snappfood'),
          })
        : t('search:home.title'),
    description: getDescription(pageType, cityTitle, superType),
    image: icon,
    url: `${t('seo.base_url')}/${path}`,
    page: pageType,
    vendorType: vendorType,
  }
}

export default useSEOMetaData
