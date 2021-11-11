import React, {useMemo} from 'react'
import styled from 'styled-components'
import {FlexBox} from '@sf/design-system'
import {Tag} from '~search/types'
import {CategoryItem, CategoryItemProps} from './CategoryItem'
import {CategoryQueryType} from '~search/pages/vendor-list'
import {useTranslation} from 'react-i18next'

export interface CategoriesProps {
  categories: Tag[]
  onChange?: (args: {tag: Tag | null; subTags: Array<Tag>}) => void
  activeCategories: CategoryQueryType
}

const Items = styled(FlexBox)`
  /* padding-right: ${({theme}) => theme.spacing[3]}; */

  > * {
    margin: 4px 0;
  }
`
export const Categories: React.FC<CategoriesProps> = ({
  categories = [],
  activeCategories,
  onChange = () => {},
}) => {
  const {t} = useTranslation()
  const isActive: (tag: Tag, isInnerTag: Boolean) => boolean = (
    tag,
    isInnerTag
  ) => {
    const {value = -1, sub = []} = activeCategories || {}
    return Boolean(
      !isInnerTag
        ? value === tag.value && !sub?.length
        : sub?.includes(tag.value)
    )
  }
  const activeTag = useMemo(() => {
    return categories.find(c => c.value === activeCategories?.value)
  }, [activeCategories?.value])

  const handleChange: CategoryItemProps['handleChange'] = (
    tag,
    isInnerTag = false,
    item
  ) => {
    const {value = -1, sub = []} = activeCategories || {}
    let nextActiveTag: Tag | null = null
    if (!isInnerTag && (value !== tag.value || tag.sub)) {
      nextActiveTag = tag
    }

    if (isInnerTag && item) {
      nextActiveTag = item
    }
    onChange({
      tag: nextActiveTag,

      subTags: isInnerTag && !sub?.includes(tag.value) ? [tag] : [],
    })
  }
  return (
    <React.Fragment>
      <CategoryItem
        isActive={() => !activeCategories?.value}
        isInnerTag={false}
        isOpen={false}
        item={{
          title:
            activeTag && activeTag.sub
              ? t('actions.back')
              : t('search:list.all-categories'),
          image: '',
          single_choice: true,
          selected: false,
          value: 45,
        }}
        handleChange={() => {
          onChange({tag: null, subTags: []})
        }}
      />
      <Items direction='column'>
        {categories
          .filter(
            c => !activeTag || !activeTag.sub || c.value === activeTag.value
          )
          .map(item => {
            return (
              <CategoryItem
                item={item}
                key={item.value}
                isActive={isActive}
                isOpen={item.value === activeCategories?.value}
                isInnerTag={false}
                handleChange={(tag, isInnerTag) => {
                  handleChange(tag, isInnerTag, item)
                }}
              ></CategoryItem>
            )
          })}
      </Items>
    </React.Fragment>
  )
}
