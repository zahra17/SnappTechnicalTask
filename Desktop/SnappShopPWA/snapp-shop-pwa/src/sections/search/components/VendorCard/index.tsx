import styled from 'styled-components'
import {rem} from 'polished'
import React from 'react'
import Link from 'next/link'

import {Card, Text, AdBadge, FlexBox} from '@sf/design-system'
import {Vendor, VendorModel} from '@schema/vendor'
import {DeliveryBadge} from '@components/DeliveryBadge'
import {RateCommentBadge} from '@components/RateCommentBadge'
import {PromotionBadge} from '../PromotionBadge'
import {VendorLogo} from '@components/VendorLogo'
import {Img} from '@components/Img'
import {useTranslation} from 'react-i18next'
import {useRudderStack} from '@contexts/RudderStack'
import {eventTypes} from '@schema/rudderStack'
import {useRouter} from 'next/router'

interface VendorCardProps {
  vendor: Vendor
  isLoading: boolean
  position: number
  promotionId?: number
  heading?: string
}

const VendorBox = styled(Card)<{isInRange?: boolean; isLoading: boolean}>`
  justify-content: space-between;
  box-sizing: border-box;
  height: 100%;
  padding-bottom: ${({theme}) => theme.spacing[3]};
  overflow: hidden;
  background-color: ${({theme, isInRange}) =>
    !isInRange ? theme.carbon.alphaLight : theme.surface.light};
  border: 1px solid ${({theme}) => theme.carbon.alphaLight};
  cursor: pointer;

  &:hover {
    box-shadow: ${({theme}) => theme.shadows.high};
  }

  > * {
    flex-shrink: 0;
    text-decoration: none;
    opacity: ${({isLoading}) => (isLoading ? `0.6` : 'initial')};
  }
`
const Info = styled(FlexBox)`
  margin-top: ${rem(28)};

  > * {
    margin-bottom: ${({theme}) => theme.spacing[1]};

    :last-child {
      margin-bottom: ${rem(12)};
    }
  }
`

const ImgWrapper = styled(FlexBox)`
  position: relative;
  min-height: ${rem(155)};
  max-height: ${rem(155)};

  > *:nth-child(2) {
    position: absolute;
    right: 0;
    left: 0;
    margin: auto;
    transform: translateY(${rem(20)});
  }

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`
const Ad = styled(AdBadge)`
  position: absolute;
  bottom: ${rem(-28)};
  left: ${rem(12)};
`

const HtmlLink = styled.a`
  text-decoration: none;
`

export const VendorCard: React.FC<VendorCardProps> = ({
  vendor,
  position,
  heading,
  promotionId,
  isLoading,
  ...props
}) => {
  const {t} = useTranslation()
  const vendorModel = new VendorModel(vendor)
  const rudderStack = useRudderStack()
  const router = useRouter()
  const onVendorClicked = () => {
    if (router.pathname === '/') {
      rudderStack.eventTrigger({
        type: eventTypes.track,
        eventName: 'Promotion Clicked',
        payload: {
          promotion_id: String(promotionId),
          creative: heading,
          name: vendor.title,
          position: position,
          url: Object(vendorModel.getLink())?.pathname,
          image_url: vendor.backgroundImage,
        },
      })
    } else {
      rudderStack.eventTrigger({
        type: eventTypes.track,
        eventName: 'Vendor Clicked',
        payload: {
          vendor_id: vendor.id,
          category: vendor.childType,
          name: vendor.title,
          delivery_price: vendor.deliveryFee,
          coupon: vendor.vendorCode,
          position: position,
          url: Object(vendorModel.getLink())?.pathname,
          image_url: vendor.backgroundImage,
        },
      })
    }
  }
  return (
    <Link href={vendorModel.getLink()} passHref>
      <HtmlLink onClick={onVendorClicked} title={vendor.title}>
        <VendorBox
          isInRange={vendorModel.isInRange()}
          shadow='small'
          spacing={0}
          direction='column'
          isLoading={isLoading}
          {...props}
        >
          <ImgWrapper justify='center' alignItems='flex-end'>
            <Img src={vendor.backgroundImage} alt={vendor.title} />
            <VendorLogo
              src={vendor.defLogo || vendor.featured}
              alt={vendor.title}
            />
            {Boolean(vendor.bid) && <Ad />}
            <PromotionBadge
              discountValue={vendor.discountValueForView}
              couponCount={vendor.coupon_count}
            />
          </ImgWrapper>

          <FlexBox direction='column' justify='space-between'>
            <Info direction='column' alignItems='center'>
              <Text as='h2' scale='large' weight='bold' align='center'>
                {vendor.title}
              </Text>
              <RateCommentBadge
                rating={vendor.rating / 2}
                commentsCount={vendor.commentCount}
                label={t('score')}
              />
              <Text
                as='h3'
                scale='caption'
                colorName='inactive'
                colorWeight='dark'
              >
                {vendor.description.split(' ,').slice(0, 3).join('، ')}
              </Text>
            </Info>
            <FlexBox justify='center' as='footer'>
              {vendor && <DeliveryBadge vendorModel={vendorModel} />}
            </FlexBox>
          </FlexBox>
        </VendorBox>
      </HtmlLink>
    </Link>
  )
}
