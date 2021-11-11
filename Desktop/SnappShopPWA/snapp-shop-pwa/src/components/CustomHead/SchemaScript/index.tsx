import Head from 'next/head'
import React from 'react'
import {useTranslation} from 'react-i18next'

import {
  schemaType,
  vendorSchemaText,
  VendorSEOSchema,
  vendorTypes,
} from '@schema/seo'

export const HomePageSchema = () => {
  const {t} = useTranslation()
  const {
    company_name,
    legal_name,
    url,
    logo,
    founding_date,
    street_address,
    address_locality,
    address_region,
    postal_code,
    address_country,
    telephone,
    email,
    same_as,
  } = t('seo.schema', {returnObjects: true})
  const json = {
    '@context': 'https://schema.org',
    '@type': schemaType.Organization,
    name: company_name,
    legalName: legal_name,
    url: url,
    logo: logo,
    foundingDate: founding_date,
    address: {
      '@type': schemaType.PostalAddress,
      streetAddress: street_address,
      addressLocality: address_locality,
      addressRegion: address_region,
      postalCode: postal_code,
      addressCountry: address_country,
    },

    contactPoint: {
      '@type': schemaType.ContactPoint,
      contactType: 'customer support',
      telephone: telephone,
      email: email,
    },

    sameAs: same_as,
  }
  return (
    <Head>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{__html: JSON.stringify(json)}}
      />
    </Head>
  )
}

export const VendorDetailSchema = (props: VendorSEOSchema) => {
  const {
    vendorType,
    address = {lat: '', long: '', addressDetail: ''},
    title,
    logo,
    commentCount = 0,
    rating = 5,
  } = props
  const json = {
    '@context': 'http://schema.org',
    '@type':
      vendorType === vendorTypes.CAFE
        ? vendorSchemaText.CafeOrCoffeeShop
        : vendorType === vendorTypes.BAKERY
        ? vendorSchemaText.Bakery
        : vendorType === vendorTypes.CONFECTIONERY
        ? vendorSchemaText.Confectionery
        : vendorSchemaText.Restaurant,
    image: logo,
    name: title,
    priceRange: '$$$',
    address: address.addressDetail,
    geo: {
      '@type': schemaType.GeoCoordinates,
      latitude: address.lat,
      longitude: address.long,
    },
    aggregateRating: {
      '@type': schemaType.AggregateRating,
      bestRating: 5,
      ratingValue: rating / 2,
      reviewCount: commentCount,
      worstRating: 1,
    },
  }
  return (
    <Head>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{__html: JSON.stringify(json)}}
      />
    </Head>
  )
}

export const VendorListSchema = (props: {items: string}) => {
  return (
    <Head>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{__html: props.items}}
      />
    </Head>
  )
}
