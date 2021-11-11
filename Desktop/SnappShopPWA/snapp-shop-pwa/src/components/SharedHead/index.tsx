import Head from 'next/head'
import React from 'react'

function SharedHead() {
  return (
    <Head>
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      <meta charSet='UTF-8' />
      <meta httpEquiv='X-UA-Compatible' content='ie=edge' />
    </Head>
  )
}

export default SharedHead
