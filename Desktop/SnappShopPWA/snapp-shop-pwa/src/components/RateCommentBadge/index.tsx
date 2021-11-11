import React from 'react'
import styled from 'styled-components'
import i18n from '@i18n'
import {RateBadge, Text} from '@sf/design-system'

interface Props {
  rating: number
  commentsCount: number
  label?: string
}
const RateBox = styled.div`
  > *:first-child {
    margin-left: ${({theme}) => theme.spacing[1]};
  }
`
export const RateCommentBadge: React.FC<Props> = ({
  commentsCount,
  rating,
  label = i18n.t('comment'),
}) => {
  return (
    <RateBox>
      <RateBox>
        <RateBadge rate={rating}></RateBadge>
        <Text scale='caption' colorName='inactive' colorWeight='dark'>
          ( {commentsCount} {label} )
        </Text>
      </RateBox>
    </RateBox>
  )
}
