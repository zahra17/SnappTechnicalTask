import {PageTypes, SEOSchema} from '@schema/seo'
import {getName} from '@utils'
import {useRouter} from 'next/router'
import {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {Tag} from '~search/types'

const useCategorySeoTitle = (tags: Tag[], activeIndex: number) => {
  const router = useRouter()
  // page title
  const [pageTitle, setPageTitle] = useState<string | null>(null)
  const [seoImage, setSeoImage] = useState<string>('')
  const [metaData, setMetaData] = useState<SEOSchema | null>(null)
  const {superType, cityTitle} = router.query
  const {t} = useTranslation()
  const getPageTitle = (
    superType: string | null,
    serviceName: string | null,
    cityTitle: string | null
  ) => {
    if (!superType || !serviceName) return null
    const sp = t(`core:vendorTypes.${superType}`)
    if (sp) {
      return t(
        `seo.titles.${sp && sp.toLowerCase()}_cuisine${
          cityTitle ? '_city' : ''
        }`,
        {cityTitle, serviceName}
      )
    } else {
      return t('seo.home_title')
    }
  }
  useEffect(() => {
    // set page title based on selected tag (use in page title)
    const activeTag = tags[activeIndex]
    if (!activeTag) return
    const subCategory = activeTag.sub?.find(tag => tag.selected)
    if (subCategory) {
      setPageTitle(subCategory.title)
      setSeoImage(subCategory.image)
    } else {
      setPageTitle(activeTag.title)
      setSeoImage(activeTag.image)
    }
  }, [activeIndex])

  useEffect(() => {
    if (!tags[activeIndex]) return
    const categorySuperType = getName(superType)
    const categoryCity = getName(cityTitle)
    const data = {
      title: getPageTitle(
        String(categorySuperType),
        pageTitle,
        String(categoryCity)
      ),
      description: '',
      image: seoImage,
      url: `${t('seo.base_url')}/${router.query.asPath}`,
      page: PageTypes.VENDOR_LIST,
    }
    setMetaData(data)
  }, [pageTitle, seoImage])

  return metaData
}

export default useCategorySeoTitle
