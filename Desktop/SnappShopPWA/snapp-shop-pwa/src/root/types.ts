import {FC} from 'react'
import {NextPageContext, NextComponentType} from 'next'
import {AppContext, AppInitialProps} from 'next/app'
import cookies from 'next-cookies'

import {AppStore, StoreShape} from '@redux'
import {CookyLocation} from '@schema/location'

export interface CTX extends NextPageContext {
  isServer: boolean
  activeLocation: CookyLocation
  store: AppStore
}
export interface Context extends AppContext {
  ctx: CTX
}
export type PageComponent<IP, P> = NextComponentType<CTX, IP, P>
export type SimplePageComponent<P = {}> = PageComponent<P, P>

// Redux
export type QueryComponent = SimplePageComponent

// Redux
interface ReduxProps {
  initialState: StoreShape
}
export type ReduxComponent = PageComponent<void, ReduxProps>

// Providers
interface ProvidersProps {
  redux: {initialState: StoreShape}
}
export type ProvidersComponent = PageComponent<
  Omit<ProvidersProps, 'redux'>,
  ProvidersProps
>

// Layout
export type LayoutComponent = SimplePageComponent

// Root
interface RootInitialProps {
  pageProps: AppInitialProps['pageProps']
  providers: ProvidersProps
  layout: {}
}
interface RootProps extends Context, RootInitialProps {}
export type RootComponent = FC<Exclude<RootProps, 'ctx'>> & {
  getInitialProps?: (context: Context) => Promise<RootInitialProps>
}

export type Cookies = ReturnType<typeof cookies>
