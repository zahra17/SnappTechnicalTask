import Head from 'next/head'
import Icon from './Icon'
import Business from './Business'
import Location from './Location'
import SocialMedia from './SocialMedia'
import ThemeColor from './ThemeColor'
import React from 'react'
import {useTranslation} from 'react-i18next'
import {
  HomePageSchema,
  VendorDetailSchema,
  VendorListSchema,
} from './SchemaScript'
import {PageTypes, SEOSchema} from '@schema/seo'

export function CustomHead(props: SEOSchema) {
  const {t} = useTranslation()
  const {
    title = t('search:home.title'),
    page,
    url = t('seo.base_url'),
    image = `${t('seo.base_url')}/static/images/favicon/favicon-96x96.png`,
    description = t('seo.descriptions.home'),
    address,
    rating,
    vendorType,
    commentCount,
    vendorItems = '',
    noIndex = false,
    canonical = null,
  } = props

  const formatCanonical = (canonical: string) => {
    const path = `${t('seo.base_url')}/${canonical
      .split('?')
      .splice(0, 1)
      .join('')
      .replace('near', '')}`
    return path
  }
  return (
    <>
      <Head>
        <title>{title ?? t('search:home.title')}</title>
        <meta name='description' content={description || ''} />
        {noIndex ? <meta name='robots' content='noindex,nofollow' /> : ''}
        {!!canonical && (
          <link rel='canonical' href={formatCanonical(canonical)} />
        )}
      </Head>
      <Icon />
      {page === PageTypes.HOME_PAGE && <Business />}
      <Location />
      <SocialMedia
        url={url}
        image={image}
        title={title ?? t('search:home.title')}
        description={description ?? t('seo.descriptions.home')}
      />
      <ThemeColor />
      {page === PageTypes.HOME_PAGE ? (
        <HomePageSchema />
      ) : page === PageTypes.VENDOR_DETAIL ? (
        <VendorDetailSchema
          logo={image}
          vendorType={vendorType}
          title={title ?? t('search:home.title')}
          address={address}
          rating={rating}
          commentCount={commentCount}
        />
      ) : page === PageTypes.VENDOR_LIST ? (
        <VendorListSchema items={vendorItems || ''} />
      ) : null}
    </>
  )
}
