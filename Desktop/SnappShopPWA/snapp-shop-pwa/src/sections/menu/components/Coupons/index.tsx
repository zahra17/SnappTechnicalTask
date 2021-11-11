import React from 'react'
import {useTranslation} from 'react-i18next'
import styled from 'styled-components'
import {rem} from 'polished'

import {LazySection} from '@components/LazySection'
import {ListView} from '@components/ListView'
import {COUPON_CATEGORY_ID} from '~menu/constants'
import {flexCenter, Grid, Text} from '@sf/design-system'
import {useCoupon} from '~menu/hooks/useCoupon'

import {CouponItem} from './CouponItem'

const SectionCoupon = styled(Grid)`
  padding: ${rem(16)};
`
const SectionHeading = styled(Text).attrs({scale: 'caption', weight: 'bold'})`
  ${flexCenter};
  height: ${rem(48)};
`
const CouponList = styled(LazySection)`
  width: 100%;
  height: ${rem(68)};
`

export const Coupons: React.FC = () => {
  const {t} = useTranslation()

  const [coupons, selected, setCoupon] = useCoupon()

  if (!coupons || !coupons.length) return null

  return (
    <SectionCoupon
      as='section'
      id={String(COUPON_CATEGORY_ID)}
      data-categoryid={String(COUPON_CATEGORY_ID)}
    >
      <SectionHeading>{t('menu:coupon')}</SectionHeading>
      <Grid container>
        <CouponList visible={true} preservedHeight='68px'>
          <ListView
            listId='couponsLists'
            buttonSize='body'
            slidesPerView={'auto'}
          >
            {coupons.map(couponItem => (
              <CouponItem
                key={couponItem.id}
                coupon={couponItem}
                setCoupon={setCoupon}
                selected={selected?.id === couponItem.id}
              />
            ))}
          </ListView>
        </CouponList>
      </Grid>
    </SectionCoupon>
  )
}
