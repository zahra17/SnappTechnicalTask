import React from 'react'
import Head from 'next/head'
import styled from 'styled-components'
import {rem} from 'polished'
import {LayoutComponent as LC} from '../types'
import {Header} from './Header'
import {Footer} from './Footer'
import LocationModal from '~growth/components/LocationModal'
import {AdBar} from './AdBar'
import PinnedLocationProvider from '@contexts/Map/PinnedLocation'

export const StyledLayout = styled.main`
  box-sizing: border-box;
  min-width: ${rem(1024)};
  max-width: ${rem(1366)};
  margin: auto;
`
export const DefaultLayout: React.FC = ({children, ...props}) => {
  return (
    <>
      <Header />
      <StyledLayout {...props}>{children}</StyledLayout>
      <Footer />
    </>
  )
}

const Layout: LC = ({children}) => {
  return (
    <>
      <Head>
        <link rel='icon' type='image/png' href='/images/logo.png' />
      </Head>
      {/*<AdBar />*/}
      {children}
      <LocationModal />
    </>
  )
}

Layout.getInitialProps = async () => ({})

export default Layout
