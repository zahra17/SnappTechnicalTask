import React, {useState} from 'react'
import styled from 'styled-components'
import {rem} from 'polished'
import {Text, Switch, fn, FlexBox} from '@sf/design-system'
import {Filter} from '~search/types'

export interface FilterKindsProps {
  filters: Array<Filter>
  handleChange?: (activeFilters: ActiveFilters) => void
  filtersQuery?: (string | null)[] | null
}
export type ActiveFilters = Record<string, string>

const FiltersContainer = styled(FlexBox)`
  flex-grow: 1;

  > * {
    min-height: ${rem(55)};

    &:not(:last-child) {
      border-bottom: 1px solid ${({theme}) => theme.carbon.alphaLight};
    }
  }
`

export const FilterKinds: React.FC<FilterKindsProps> = ({
  filtersQuery,
  filters = [],
  handleChange = fn,
}) => {
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(
    filters
      .filter(item => item.selected)
      .reduce((acc, val) => {
        acc[val.value] = val.value
        return acc
      }, {} as ActiveFilters)
  )
  const onChange = (e: React.ChangeEvent<HTMLInputElement>, filter: Filter) => {
    const checked = e.target.checked
    if (checked) {
      const newFilters = {
        ...activeFilters,
        [filter.value]: filter.value,
        ...(filtersQuery || []).reduce((acc, val) => {
          acc[val!] = val!
          return acc
        }, {} as ActiveFilters),
      }
      setActiveFilters(newFilters)
      handleChange(newFilters)
    } else {
      const {[filter.value]: _, ...newFilters} = {
        ...activeFilters,
        ...(filtersQuery || []).reduce((acc, val) => {
          acc[val!] = val!
          return acc
        }, {} as ActiveFilters),
      }
      setActiveFilters(newFilters)
      handleChange(newFilters)
    }
  }
  return (
    <FiltersContainer wrap='wrap' direction='column'>
      {filters.map(filter => (
        <FlexBox key={filter.value} justify='space-between' alignItems='center'>
          <Text scale='body' as='span'>
            {filter.title}
          </Text>
          <Switch
            checked={Boolean(activeFilters[filter.value])}
            onChange={e => {
              onChange(e, filter)
            }}
          ></Switch>
        </FlexBox>
      ))}
    </FiltersContainer>
  )
}
