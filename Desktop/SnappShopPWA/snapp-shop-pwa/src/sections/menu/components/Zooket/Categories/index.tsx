import React from 'react'
import {ZooketCategory} from '~menu/types'
import {CategoryItem} from './CategoryItem'
import {FlexBox} from '@sf/design-system'
import styled from 'styled-components'

interface Props {
  isSearchActive: boolean
  categories: ZooketCategory[]
  activeCategories: (number | null)[]
  handleChange: (categoryId: (number | null)[]) => void
  isLoading: boolean
}

const Wrapper = styled.section`
  height: calc(100vh - 180px - 152px);
  overflow-y: auto;
`

export const ZooketCategories: React.FC<Props> = ({
  isSearchActive,
  categories = [],
  activeCategories,
  handleChange,
  isLoading,
}) => {
  const isActive = (id: number) =>
    activeCategories[activeCategories.length - 1] === id
  return (
    <FlexBox direction='column'>
      <CategoryItem
        isActive={() => !activeCategories.length && !isSearchActive}
        isLoading={false}
        isOpen={false}
        item={{
          id: -1,
          image: null,
          lft: 1,
          rgt: 1,
          title: 'ویترین',
        }}
        handleChange={() => {
          handleChange([])
        }}
      />
      <Wrapper>
        {categories.map(item => {
          return (
            <CategoryItem
              item={item}
              key={item.id}
              isActive={isActive}
              isLoading={isLoading}
              isOpen={activeCategories.includes(item.id)}
              handleChange={category => {
                if (isActive(category.id)) {
                  handleChange(
                    activeCategories.filter(id => id !== category.id)
                  )
                } else {
                  if (category.lft === 1) {
                    handleChange([category.id])
                  } else {
                    handleChange([...activeCategories.slice(0, 1), category.id])
                  }
                }
              }}
            ></CategoryItem>
          )
        })}
      </Wrapper>
    </FlexBox>
  )
}
