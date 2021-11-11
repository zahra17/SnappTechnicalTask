import React, {useState} from 'react'
import styled from 'styled-components'
import {useTranslation} from 'react-i18next'
import {FlexBox, Text, Spinner} from '@sf/design-system'
import CommentItem from './Item'
import SortTabs from './Sort'
import {CommentsSort} from '~menu/types'
import {VendorState} from '~menu/redux/vendor'

interface Props {
  vendorComments: VendorState['vendorComments']
  vendorType: string
  onSort: (sort: CommentsSort['params'][number]) => void
}

const Header = styled(FlexBox)`
  padding: ${({theme}) => theme.spacing[2]};
`
const CommentsList = styled(FlexBox)`
  /* height: calc(90vh - 22rem); */
  /* overflow-y: scroll; */

  > * {
    flex-shrink: 0;
  }
`
const Loading = styled.div`
  padding: ${({theme}) => theme.spacing[4]};
`
export const VendorDetailComments: React.FC<Props> = ({
  vendorComments,
  vendorType,
  onSort = () => {},
}) => {
  const {t} = useTranslation()
  const {comments = [], sort, isLoading} = vendorComments
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <>
      <Header justify='space-between'>
        <Text scale='default' weight='bold' colorWeight='light'>
          {t('menu:vendorInfo.userComments')}
        </Text>
        {Boolean(sort) && (
          <SortTabs
            sort={sort!}
            onChange={(sort, index) => {
              setActiveIndex(index)
              onSort(sort)
            }}
            activeIndex={activeIndex}
          />
        )}
      </Header>
      <CommentsList direction='column' key={activeIndex}>
        {comments.map(comment => (
          <CommentItem
            key={comment.commentId}
            comment={comment}
            vendorType={vendorType}
          />
        ))}
        {isLoading && (
          <Loading>
            <Spinner />
          </Loading>
        )}
      </CommentsList>
    </>
  )
}
