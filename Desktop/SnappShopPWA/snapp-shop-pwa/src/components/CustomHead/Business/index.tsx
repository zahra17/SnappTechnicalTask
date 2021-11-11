import React from 'react'
import Head from 'next/head'
import {useTranslation} from 'react-i18next'

export default function Business() {
  const {t} = useTranslation()
  const {
    business_address,
    address_region,
    address_country,
    telephone,
    url,
    email,
  } = t('seo.schema', {returnObjects: true})
  return (
    <Head>
      <meta
        property='business:contact_data:street_address'
        content={business_address}
      />
      <meta
        property='business:contact_data:locality'
        content={address_region}
      />
      <meta
        property='business:contact_data:country_name'
        content={address_country}
      />
      <meta
        property='business:contact_data:phone_number'
        content={telephone ? telephone[0] : ''}
      />
      <meta property='business:contact_data:website' content={url} />
      <meta property='business:contact_data:email' content={email} />
    </Head>
  )
}
