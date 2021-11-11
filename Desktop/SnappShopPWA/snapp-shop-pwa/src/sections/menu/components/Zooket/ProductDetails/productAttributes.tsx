import React, {useState} from 'react'
import {
  ChevronDownIcon,
  colors,
  FlexBox,
  Text,
  toPersian,
} from '@sf/design-system'
import styled from 'styled-components'
import {rem} from 'polished'
import {ProductAttribute} from '@schema/product'
import {useTranslation} from 'react-i18next'

interface Props {
  attributes: ProductAttribute[]
}

const AttributeItem = styled(FlexBox)`
  flex: 0 0 73%;
`
const AttributeListItem = styled(FlexBox)`
  box-sizing: border-box;
  width: 100%;
  border-bottom: 1px solid var(--gray7-color);

  > div {
    box-sizing: border-box;
    width: 100%;
    padding: ${rem(16)};
  }

  &:last-child {
    border-bottom: unset;
  }
`
const CategoryItem = styled(FlexBox)`
  flex: 0 0 23%;
`
const Container = styled(FlexBox)`
  width: 100%;
`

const ShowMoreContainer = styled(FlexBox).attrs({
  alignItems: 'center',
  justify: 'flex-end',
})`
  margin: ${rem(20)};
  cursor: pointer;

  svg {
    margin-right: ${rem(6)};
  }
`
export const ProductAttributes: React.FC<Props> = ({attributes}) => {
  const [showMore, setShowMore] = useState<boolean>(
    attributes.length < 9 || false
  )
  const onShowMoreClick = () => {
    setShowMore(true)
  }
  const {t} = useTranslation()
  return (
    <Container direction='column'>
      {(showMore || attributes.length < 9
        ? attributes
        : attributes.slice(0, 9)
      ).map(item => (
        <AttributeListItem key={item.categoryTitle}>
          <FlexBox alignItems='center'>
            <CategoryItem>
              <Text scale='body' color='var(--gray5-color)'>
                {item.categoryTitle}
              </Text>
            </CategoryItem>
            <AttributeItem>
              <Text scale='default' weight='bold'>
                {toPersian(item.title)}
              </Text>
            </AttributeItem>
          </FlexBox>
        </AttributeListItem>
      ))}

      {!showMore && (
        <ShowMoreContainer onClick={onShowMoreClick}>
          <Text
            scale='body'
            colorName='accent2'
            weight='bold'
            style={{cursor: 'pointer'}}
          >
            {t('show-more')}
          </Text>
          <ChevronDownIcon fill={colors.accent2.main} width={12} height={14} />
        </ShowMoreContainer>
      )}
    </Container>
  )
}
