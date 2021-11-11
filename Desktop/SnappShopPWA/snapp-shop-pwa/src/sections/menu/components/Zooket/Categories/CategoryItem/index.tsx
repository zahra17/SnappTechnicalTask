import React from 'react'
import {rem} from 'polished'
import styled from 'styled-components'
import {
  FlexBox,
  Text,
  ChevronLeftIcon,
  StyledCustomProps,
  Spinner,
} from '@sf/design-system'
import {ZooketCategory} from '~menu/types'
import {Img} from '@components/Img'
import {Collapse} from '@components/Collapse'

interface Props {
  isActive: (categoryId: number) => boolean
  isOpen: boolean
  item: ZooketCategory
  handleChange: (category: ZooketCategory) => void
  isLoading: boolean
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
    isActive ? theme.surface.light : 'transparent'};
  border: 1px solid
    ${({theme, isActive}) =>
      isActive ? theme.carbon.alphaLight : theme.surface.main};
  border-radius: ${rem(8)};

  cursor: pointer;
  transition: all 200ms;

  > *:last-child {
    margin-left: ${rem(10)};
  }
`
const CategoryImg = styled(Img)`
  width: ${rem(40)};
  height: ${rem(40)};
`
const CategoryText = styled(Text)`
  margin-right: ${rem(12)};
`
const StyledSpinner = styled(FlexBox)`
  position: relative;

  > * {
    transform: scale(0.5);
  }
`
//
export const CategoryItem: React.FC<StyledCustomProps<'div', Props>> = ({
  isActive,
  isLoading,
  item,
  handleChange,
  isOpen,
  ...props
}) => {
  return (
    <Container direction='column'>
      <Item
        alignItems='center'
        justify='space-between'
        isActive={isActive(item.id)}
        {...props}
        onClick={() => handleChange(item)}
      >
        <FlexBox alignItems='center'>
          {item.image && <CategoryImg src={item.image} alt={item.title} />}
          <CategoryText
            scale='body'
            colorName={isActive(item.id) ? 'accent2' : 'carbon'}
            weight={isActive(item.id) ? 'bold' : 'normal'}
          >
            {item.title}
          </CategoryText>
        </FlexBox>
        {!item.sub && isLoading && isActive(item.id) ? (
          <StyledSpinner justify='flex-end'>
            <Spinner colorName='inactive' />
          </StyledSpinner>
        ) : (
          isActive(item.id) && (
            <ChevronLeftIcon
              fill='var(--sf-accent2-main)'
              width='11'
              height='12'
            />
          )
        )}
      </Item>
      {item.sub?.length && (
        <Collapse isOpen={isOpen} height={`${item.sub.length * 48}px`}>
          {item.sub.map(innerItem => (
            <CategoryItem
              item={innerItem}
              key={innerItem.id}
              isOpen={false}
              isLoading={false}
              isActive={isActive}
              handleChange={handleChange}
            >
              {innerItem.title}
            </CategoryItem>
          ))}
        </Collapse>
      )}
    </Container>
  )
}
