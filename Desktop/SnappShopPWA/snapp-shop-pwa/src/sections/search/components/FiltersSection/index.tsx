import React, {useEffect, useState} from 'react'
import {useTranslation} from 'react-i18next'
import {Text, fn} from '@sf/design-system'
import styled from 'styled-components'
import {
  Tab,
  TabOverlay,
  TabsContainer,
} from '~menu/components/VendorDetail/Comments/Sort'

import {FilterKindsProps, ActiveFilters} from '../FilterKinds'

interface Props extends FilterKindsProps {
  filtersQuery?: (string | null)[] | null
}
const FiltersSectionLayout = styled(TabsContainer)`
  margin-top: ${({theme}) => theme.spacing[2]};
`

const FiltersSection: React.FC<Props> = ({
  filters = [],
  handleChange = fn,
  filtersQuery = [],
}) => {
  const {t} = useTranslation()
  const [activeIndex, setActiveIndex] = useState<number>(
    filters.findIndex(item => item.selected)
  )
  useEffect(() => {
    const initialActiveFilters = (filtersQuery || []).reduce((acc, val) => {
      acc[val!] = val!
      return acc
    }, {} as ActiveFilters)
    handleChange(
      // Make a dictionary of activeFilters
      filters.reduce((acc, val, idx) => {
        // If already active delete it
        if (acc[val.value]) {
          delete acc[val.value]
        }
        if (idx === activeIndex) {
          acc[val.value] = val.value
        }
        return acc
      }, initialActiveFilters)
    )
  }, [activeIndex])

  return (
    <FiltersSectionLayout alignItems='center'>
      <TabOverlay
        offset={0}
        style={{
          width: '25%',
          transform: `translateX(-${(activeIndex + 1) * 98}%)`,
        }}
      />
      <Tab
        key={'all'}
        onClick={() => {
          setActiveIndex(-1)
        }}
      >
        <Text
          scale='body'
          colorName={activeIndex === -1 ? 'accent2' : 'carbon'}
        >
          {t('search:filters.all')}
        </Text>
      </Tab>
      {filters.map((filter, index) => (
        <Tab
          key={filter.value}
          onClick={() => {
            if (activeIndex === index) setActiveIndex(-1)
            else {
              setActiveIndex(index)
            }
          }}
        >
          <Text
            scale='body'
            colorName={activeIndex === index ? 'accent2' : 'carbon'}
          >
            {filter.title}
          </Text>
        </Tab>
      ))}
    </FiltersSectionLayout>
  )
}

export default FiltersSection
