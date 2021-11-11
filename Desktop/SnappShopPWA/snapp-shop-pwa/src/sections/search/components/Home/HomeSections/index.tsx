import React from 'react'
import styled from 'styled-components'
import {Spinner} from '@sf/design-system'
import {HOME_SECTION_TYPE, HomeSection} from '~search/types'
import {BannerSection} from '~search/components/Home/BannerSection'
import {CuisinesSection} from '~search/components/Home/Cuisines'
import {ProductCollection} from '~search/components/Home/ProductCollection'
import {ShopOptionsSection} from '~search/components/Home/ShopOptionsSections'
import {SliderSection} from '~search/components/Home/SliderSection'
import {VendorCollection} from '~search/components/Home/VendorCollection'

// import {Banner} from "@components/Banner";

interface Props {
  sections: HomeSection[]
  isLoading: boolean
}
const Loading = styled.div`
  padding: ${({theme}) => theme.spacing[4]};
`

export const HomeSections: React.FC<Props> = ({sections, isLoading}) => {
  function Row(section: HomeSection) {
    switch (section.type) {
      case HOME_SECTION_TYPE.VENDORS:
        return (
          <VendorCollection key={section.front_id} vendorCollection={section} />
        )
      case HOME_SECTION_TYPE.CUISINES:
        return <CuisinesSection key={section.front_id} cuisines={section} />
      case HOME_SECTION_TYPE.SPECIAL_PRODUCTS:
        return (
          <ProductCollection
            key={section.front_id}
            productCollection={section}
          />
        )
      case HOME_SECTION_TYPE.BANNER:
        return <BannerSection key={section.front_id} banner={section} />
      case HOME_SECTION_TYPE.SLIDER:
        return <SliderSection key={section.front_id} banner={section} />
      case HOME_SECTION_TYPE.SHOP_DELIVERY:
        return <ShopOptionsSection key={section.front_id} services={section} />
      case HOME_SECTION_TYPE.CITIES:
        return null
      default:
        return null
    }
  }
  return (
    <>
      {isLoading ? (
        <Loading>
          <Spinner />
        </Loading>
      ) : (
        sections.map(Row)
      )}
    </>
  )
}
