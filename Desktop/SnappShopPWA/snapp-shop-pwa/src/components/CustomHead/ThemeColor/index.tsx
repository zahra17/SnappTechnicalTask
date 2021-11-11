import React from 'react'
import Head from 'next/head'
import {defaultTheme} from '@sf/design-system'
export default function ThemeColor() {
  return (
    <Head>
      <meta name='theme-color' content={defaultTheme.accent.main} />
    </Head>
  )
}
