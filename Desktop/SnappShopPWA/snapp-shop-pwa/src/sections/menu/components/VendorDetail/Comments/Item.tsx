import React from 'react'
import styled from 'styled-components'
import {useTranslation} from 'react-i18next'
import {FlexBox, StarIcon, Text} from '@sf/design-system'
import {rem} from 'polished'
import {Comment, ReplyComment} from '~menu/types'
import {localizeDate} from '@utils'
import i18n from '@i18n'
import {v4} from 'uuid'

interface Props {
  comment: Comment
  vendorType?: string
}

const Container = styled(FlexBox)`
  box-sizing: border-box;
  padding: ${({theme}) => theme.spacing[2]};
  border-bottom: ${rem(1)} solid ${({theme}) => theme.carbon.alphaMedium};
`
const CommentInfo = styled(FlexBox)`
  flex-shrink: 0;
  width: ${rem(160)};
  margin-left: ${({theme}) => theme.spacing[2]};

  > * {
    margin-top: ${rem(6)};

    &:last-child {
      width: ${({theme}) => theme.spacing[4]};
      padding: ${rem(2)} ${rem(6)};
      text-align: center;
      border: ${rem(1)} solid ${({theme}) => theme.surface.dark};
      border-radius: ${rem(4)};
    }
  }
`
const CommentContent = styled(FlexBox)`
  margin-left: ${({theme}) => theme.spacing[2]};

  > * {
    &:first-child {
      margin-bottom: ${rem(12)};
    }
  }
`
const CommentTags = styled(FlexBox)`
  > * {
    margin-bottom: ${({theme}) => theme.spacing[1]};
    margin-left: ${({theme}) => theme.spacing[1]};
  }
`
const Tag = styled(FlexBox)`
  height: ${rem(20)};
  padding: ${rem(4)} ${rem(6)};
  font-size: ${({theme}) => theme.scales.tiny};
  background-color: ${({theme}) => theme.surface.dark};
  border-radius: ${rem(6)};
`
const Reply = styled(FlexBox)`
  margin-top: ${({theme}) => theme.spacing[2]};
  padding: ${({theme}) => theme.spacing[1]};
  border: ${rem(1)} solid ${({theme}) => theme.carbon.alphaMedium};
  border-radius: ${({theme}) => theme.spacing[1]};

  > {
    &:first-child {
      margin-bottom: ${({theme}) => theme.spacing[1]};
    }
  }
`
const Rate = styled(Text)`
  > svg {
    margin-left: ${rem(2.5)};
    vertical-align: middle;
  }
`
const CommentItem: React.FC<Props> = ({comment, vendorType = ''}) => {
  const {t} = useTranslation()
  return (
    <Container>
      <CommentInfo direction='column'>
        <Text scale='body' weight='bold' ellipsis>
          {comment.sender}
        </Text>
        <Text scale='body'>{localizeDate(comment.date)}</Text>
        <Rate scale='body'>
          <StarIcon />
          {comment.rate / 2}
        </Rate>
      </CommentInfo>
      <CommentContent
        direction='column'
        alignItems='flex-start'
        justify='center'
      >
        <Text scale='body'>{comment.commentText}</Text>
        {Boolean(comment.foods?.length) && (
          <CommentTags wrap='wrap'>
            {comment.foods?.map((food, idx) => (
              <Tag alignItems='center' justify='center' key={food.title + idx}>
                <Text scale='tiny' colorName='carbon'>
                  {food.title}
                </Text>
              </Tag>
            ))}
          </CommentTags>
        )}

        {comment.replies.map(reply => (
          <Reply
            key={reply.timestamp + v4()}
            direction='column'
            justify='center'
          >
            <Text scale='caption' colorName='accent' weight='bold'>
              {t('menu:vendorInfo.reply')}{' '}
              {getReplyTitleText(reply.source, vendorType)}
            </Text>
            <Text scale='caption'>{reply.commentText}</Text>
          </Reply>
        ))}
      </CommentContent>
    </Container>
  )
}

const getReplyTitleText = (
  source: ReplyComment['source'],
  vendorType: string
) => {
  switch (source) {
    case 'VENDOR':
      return `${i18n.t('admin')} ${
        vendorType ? vendorType : i18n.t('restaurant')
      }`
    case 'ZOODFOOD':
      return i18n.t('snappfood')
    case 'USER':
      return i18n.t('user')
    case 'EXPRESS':
      return i18n.t('express')
  }
}

export default CommentItem
