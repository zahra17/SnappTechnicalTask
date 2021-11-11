import React from 'react'
import Head from 'next/head'
import {useTranslation} from 'react-i18next'

export default function Location() {
  const {t} = useTranslation()
  return (
    <Head>
      <meta property='place:location:latitude' content={t('seo.schema.lat')} />
      <meta
        property='place:location:longitude'
        content={t('seo.schema.long')}
      />
    </Head>
  )
}
