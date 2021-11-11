import React from 'react'
import extractProps from './helpers'
import {RootComponent as RC} from './types'

import Layout from './Layout'
import Providers from './Providers'
import RudderStackProvider from '@contexts/RudderStack'

const Root: RC = ({Component, router, providers, layout, pageProps}) => {
  return (
    <Providers {...providers}>
      <RudderStackProvider>
        <Layout {...layout}>
          <Component {...pageProps} key={router.route} />
        </Layout>
      </RudderStackProvider>
    </Providers>
  )
}

Root.getInitialProps = async ({Component, ctx}) => {
  ctx.isServer = typeof window === 'undefined'

  const providersProps = await extractProps(Providers, ctx)!

  const layout = await extractProps(Layout, ctx)!

  const pageProps = await extractProps(Component, ctx)

  const providers = {
    ...providersProps,
    redux: {initialState: ctx.store.getState()},
  }

  return {providers, layout, pageProps}
}

export default Root
