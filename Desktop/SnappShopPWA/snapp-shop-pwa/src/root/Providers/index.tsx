import React from 'react'
import {DesignSystemProvider} from '@sf/design-system'

import {ProvidersComponent} from '../types'

import Redux from './Redux'
import AppDataProvider from './AppData'
import LocationProvider from './Location'
import ToastProvider from '@contexts/Toast'
import {QueryParamProvider} from './QueryProvider'
import BreadcrumbProvider from '@contexts/Breadcrumb'
import HeadingTitleProvider from '@contexts/HeadingTitle'
import PinnedLocationProvider from '@contexts/Map/PinnedLocation'
import {theme} from '../../styles/themes'

const Providers: ProvidersComponent = ({children, redux}) => {
  return (
    <Redux {...redux}>
      <QueryParamProvider>
        <LocationProvider>
          <AppDataProvider>
            <DesignSystemProvider theme={theme}>
              <PinnedLocationProvider>
                <BreadcrumbProvider>
                  <HeadingTitleProvider>
                    <ToastProvider>{children}</ToastProvider>
                  </HeadingTitleProvider>
                </BreadcrumbProvider>
              </PinnedLocationProvider>
            </DesignSystemProvider>
          </AppDataProvider>
        </LocationProvider>
      </QueryParamProvider>
    </Redux>
  )
}

Providers.getInitialProps = async ctx => {
  await Redux.getInitialProps!(ctx)

  const query = await QueryParamProvider.getInitialProps!(ctx)

  await AppDataProvider.getInitialProps!(ctx)

  return {query}
}

export default Providers
