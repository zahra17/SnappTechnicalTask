import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {rem} from 'polished'
import {bks, FlexBox} from '@sf/design-system'
import {LazySection} from '@components/LazySection'
import {Banner} from '@components/Banner'
import {BannerType} from '~search/types'
import {BannerModel} from '@schema/banner'

import {actions} from '~search/redux/home'
import {useAppDispatch} from '@redux'
import {makeServicePageLink} from '~search/utils'

interface Props {
  banner: BannerType
}

export const BannerSection: React.FC<Props> = ({
  banner: {
    front_id,
    visible,
    data: {banner},
  },
}) => {
  const dispatch = useAppDispatch()
  const bannerModel = new BannerModel(banner)
  const appearingStyles = {
    opacity: visible ? '1' : '0',
    transition: 'opacity 0.7s cubic-bezier(0.5, 0, 0, 1) 0s',
  }

  const onSectionVisible = () => {
    dispatch(actions.setSectionVisibility({id: front_id!, visible: true}))
  }

  return (
    <LazySection
      key={front_id}
      visible={visible}
      onVisible={() => {
        onSectionVisible()
      }}
      preservedHeight={bks.down('lg') ? '306px' : '333px'}
    >
      <Banner bannerModel={bannerModel} />
    </LazySection>
  )
}
