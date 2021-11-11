import React from 'react'
import Head from 'next/head'
import {useTranslation} from 'react-i18next'

export default function Icon() {
  const {t} = useTranslation()
  return (
    <Head>
      <meta name='msapplication-TileColor' content={t('seo.ms_tile_color')} />
      <meta name='msapplication-TileImage' content={t('seo.ms_tile_image')} />
    </Head>
  )
}
