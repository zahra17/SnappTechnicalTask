import React from 'react'
import {useRouter} from 'next/router'
import {SimplePageComponent} from '@root/types'
import {CTX} from '@root/types'
import extractProps from '@root/helpers'
import VendorPage from '~menu/components/Vendor/Page'
import ShopPage from '~menu/components/Zooket/Page'

// Vendor page component
const VendorHOC: SimplePageComponent = ({children: _, ...props}) => {
  const router = useRouter()

  return router.query.vendorType === 'shop' ? (
    <ShopPage {...props} />
  ) : (
    <VendorPage {...props} />
  )
}

VendorHOC.getInitialProps = async (ctx: CTX) => {
  const {query} = ctx
  let props
  if (query.vendorType === 'shop') {
    props = await extractProps(ShopPage, ctx)
  } else {
    props = await extractProps(VendorPage, ctx)
  }
  return props
}

export default VendorHOC
