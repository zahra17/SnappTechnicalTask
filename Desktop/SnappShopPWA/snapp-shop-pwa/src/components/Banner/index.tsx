import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import {rem} from 'polished'
import {bks, FlexBox} from '@sf/design-system'

import {Img} from '@components/Img'
import {BannerModel} from '@schema/banner'
import {getPathname, getRouteParams, SUPER_TYPES} from '~search/utils'

interface Props {
  bannerModel: BannerModel
}

const ImgWrapper = styled(FlexBox)`
  width: 100%;
  cursor: 'pointer';

  > img {
    border-radius: ${rem(12)};

    ${bks.down('lg')} {
      width: ${rem(920)};
    }

    ${bks.up('lg')} {
      width: ${rem(1000)};
    }
  }
`

export const Banner: React.FC<Props> = ({bannerModel}) => {
  const deepLink = bannerModel?.banner?.deepLink
  const linkParams = getRouteParams(deepLink)
  const superType = Object.entries(SUPER_TYPES)?.find(
    ([key, value]) => value == Number(linkParams['superType'])
  )
  const superTypeAlias = superType?.length ? superType[0] : ''
  const pathname = getPathname(
    deepLink?.includes('near'),
    !!linkParams['city'],
    superTypeAlias,
    linkParams?.city
  )

  return (
    <Link
      href={
        deepLink
          ? `${
              deepLink?.includes('product') ? 'products' : pathname
            }?${new URLSearchParams(linkParams).toString()}`
          : bannerModel?.banner?.link || ''
      }
    >
      <a target={deepLink ? '_self' : '_blank'}>
        <ImgWrapper justify='center' alignItems='center'>
          <Img
            src={
              bannerModel?.banner?.image || bannerModel?.banner?.image_custom
            }
            alt={bannerModel?.banner?.title}
          />
        </ImgWrapper>
      </a>
    </Link>
  )
}
