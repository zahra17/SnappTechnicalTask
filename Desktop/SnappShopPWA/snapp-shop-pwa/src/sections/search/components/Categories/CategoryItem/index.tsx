import React, {useMemo} from 'react'
import {rem} from 'polished'
import styled from 'styled-components'
import {
  FlexBox,
  Text,
  ChevronRightIcon,
  ChevronLeftIcon,
  StyledCustomProps,
} from '@sf/design-system'
import {Img} from '@components/Img'
import {Collapse} from '@components/Collapse'
import {Tag} from '~search/types'
import {useTranslation} from 'react-i18next'

export interface CategoryItemProps {
  isActive: (tag: Tag, isInnerTag: boolean) => boolean
  isOpen: boolean
  item: Tag
  handleChange: (tag: Tag, isInnerTag: boolean, item?: Tag) => void
  isInnerTag: boolean
  //   isLoading: boolean
}
const Container = styled(FlexBox)`
  > *:nth-child(2) {
    margin-right: ${rem(16)};
  }
`
const Item = styled(FlexBox)<{isActive: boolean}>`
  box-sizing: border-box;
  height: ${rem(48)};
  padding: ${rem(3)};
  text-align: right;
  background-color: ${({theme, isActive}) =>
    isActive ? theme.carbon.alphaLight : 'transparent'};

  border-radius: ${rem(8)};

  cursor: pointer;
  transition: all 200ms;

  > svg {
    margin-right: 17px;
    margin-left: 5px;
  }

  > *:last-child {
    margin-left: ${rem(10)};
  }
`
const CategoryImg = styled(Img)`
  width: ${rem(32)};
  height: ${rem(32)};
`
const CategoryText = styled(Text)`
  margin-right: ${rem(12)};
`
const CollapsibleItems = styled(Collapse)`
  > * {
    margin: 8px 0;
  }
`

//
export const CategoryItem: React.FC<
  StyledCustomProps<'div', CategoryItemProps>
> = ({isActive, item, handleChange, isOpen, isInnerTag, ...props}) => {
  const {t} = useTranslation()
  const showChevron = item.sub && !isOpen
  const active = useMemo(() => isActive(item, isInnerTag), [item, isInnerTag])
  return (
    <Container direction='column'>
      <Item
        alignItems='center'
        justify={item.title === t('actions.back') ? 'initial' : 'space-between'}
        isActive={active}
        {...props}
        onClick={() => handleChange(item, isInnerTag)}
      >
        {item.title === t('actions.back') && (
          <ChevronRightIcon
            fill='var(--sf-carbon-main)'
            width='11'
            height='12'
          />
        )}
        <FlexBox alignItems='center'>
          {item.image && ((!active && !isOpen) || !item.sub) && (
            <CategoryImg src={item.image} alt={item.title} />
          )}
          <CategoryText
            scale='body'
            colorName='carbon'
            weight={active ? 'bold' : 'normal'}
          >
            {isOpen && item.sub
              ? t('search:list.category-item-title', {text: item.title})
              : item.title}
          </CategoryText>
        </FlexBox>
        {showChevron && (
          <ChevronLeftIcon
            fill='var(--sf-inactive-light)'
            width='11'
            height='12'
          />
        )}
      </Item>
      {item.sub?.length && (
        <CollapsibleItems isOpen={isOpen} height={`${item.sub.length * 56}px`}>
          {item.sub.map(innerItem => (
            <CategoryItem
              item={innerItem}
              key={innerItem.value}
              isOpen={false}
              isActive={isActive}
              isInnerTag={true}
              handleChange={handleChange}
            >
              {innerItem.title}
            </CategoryItem>
          ))}
        </CollapsibleItems>
      )}
    </Container>
  )
}
