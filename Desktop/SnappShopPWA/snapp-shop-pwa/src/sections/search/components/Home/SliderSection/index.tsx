import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {rem} from 'polished'
import {bks, FlexBox} from '@sf/design-system'

import {LazySection} from '@components/LazySection'
import {ListView} from '@components/ListView'
import {Banner} from '@components/Banner'

import {BannerSliderType} from '~search/types'
import {Banner as Type, BannerModel} from '@schema/banner'

import {actions} from '~search/redux/home'
import {useAppDispatch} from '@redux'
import {makeServicePageLink} from '~search/utils'

interface Props {
  banner: BannerSliderType
}

export const SliderSection: React.FC<Props> = ({
  banner: {
    front_id,
    visible,
    data: {banner},
  },
}) => {
  const dispatch = useAppDispatch()

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
      <ListView listId={front_id} slidesPerView={1}>
        {banner.map((item: Type) => {
          const bannerModel = new BannerModel(item)
          return (
            <Banner bannerModel={bannerModel} key={bannerModel.banner.id} />
          )
        })}
      </ListView>
    </LazySection>
  )
}
