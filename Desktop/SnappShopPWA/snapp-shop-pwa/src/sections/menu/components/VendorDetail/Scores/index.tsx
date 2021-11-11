import React from 'react'
import {Text, FlexBox, StarIcon} from '@sf/design-system'
import {useTranslation} from 'react-i18next'
import styled from 'styled-components'
import {rem} from 'polished'
import {VendorModel} from '@schema/vendor'

interface Props {
  vendorModel: VendorModel
}
const SCORE_COLORS: Record<string, string> = {
  '5': '#02890A',
  '4': '#68C342',
  '3': '#ABE823',
  '2': '#FE9D07',
  '1': '#FE3900',
}

const Container = styled(FlexBox)`
  height: ${rem(108)};
`
const RatingInfo = styled(FlexBox)`
  padding-right: ${rem(20)};
  padding-bottom: ${({theme}) => theme.spacing[2]};

  svg {
    padding-left: ${({theme}) => theme.spacing[1]};
  }
`
const RatingScores = styled(FlexBox)`
  padding-bottom: ${({theme}) => theme.spacing[2]};

  > * {
    align-items: center;
    margin-top: ${rem(5)};

    svg {
      padding-right: ${({theme}) => theme.spacing[1]};
      fill: ${({theme}) => theme.inactive.light};
    }
  }
`
const RateBar = styled(FlexBox)<{type: string; value: number}>`
  width: ${rem(404)};
  height: ${rem(2)};
  margin-right: ${({theme}) => theme.spacing[2]};
  background-color: ${({theme}) => theme.surface.dark};
  border-radius: ${rem(4)};

  &::after {
    width: ${props => props.value}%;
    background-color: ${props => SCORE_COLORS[props.type]};
    border-radius: ${({theme}) => theme.spacing[1]};
    box-shadow: ${({theme}) => theme.shadows.small};
    content: '';
  }
`
const MAX_STARS = 5
export const VendorDetailScores: React.FC<Props> = ({vendorModel}) => {
  const {t} = useTranslation()
  const {vendor} = vendorModel
  const {reviewStars} = vendor

  return (
    <Container>
      <RatingInfo justify='flex-end' direction='column'>
        <Text scale='xlarge' weight='bold'>
          <StarIcon height={20} width={20} />
          {(vendor?.rating / 2).toFixed(1)}
        </Text>
        <Text scale='caption' colorName='inactive' colorWeight='dark'>
          {t('menu:vendorInfo.from-total-comments')}{' '}
          <Text scale='caption' weight='bold' as='span'>
            {vendor.commentCount}
          </Text>{' '}
          {t('menu:vendorInfo.score-and')}{' '}
          <Text scale='caption' weight='bold' as='span'>
            {vendor.textCommentCount}
          </Text>{' '}
          {t('menu:vendorInfo.comment')}
        </Text>
      </RatingInfo>
      <RatingScores justify='flex-end' alignItems='flex-end' direction='column'>
        {Object.keys(reviewStars).map((key, i) => (
          <FlexBox key={key}>
            {Array(MAX_STARS - i)
              .fill(i)
              .map((_, ii) => (
                <StarIcon key={ii} />
              ))}
            <RateBar type={String(MAX_STARS - i)} value={reviewStars[key]} />
          </FlexBox>
        ))}
      </RatingScores>
    </Container>
  )
}
