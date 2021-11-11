import React from 'react'
import {rem} from 'polished'
import {useTranslation} from 'react-i18next'
import {FlexBox, Text} from '@sf/design-system'
import styled from 'styled-components'
import {CommentsSort} from '~menu/types'

interface Props {
  sort: CommentsSort
  onChange: (sort: CommentsSort['params'][number], activeIndex: number) => void
  activeIndex: number
}
export const SortTabsContainer = styled(FlexBox)`
  > *:first-child {
    margin-left: ${rem(10)};
  }
`
export const Tab = styled(FlexBox).attrs({
  alignItems: 'center',
  justify: 'center',
})`
  z-index: 2;
  width: ${rem(117)};
  padding: ${rem(10)};
`
export const TabOverlay = styled.div<{offset: number}>`
  position: absolute;
  width: 50%;
  height: ${rem(36)};
  margin-right: ${rem(2)};
  background-color: ${({theme}) => theme.surface.light};
  border-radius: ${rem(10)};
  transform: translateX(-${({offset = 0}) => offset}px);
  transition: 0.1s;
`
export const TabsContainer = styled(FlexBox)`
  position: relative;
  background-color: ${({theme}) => theme.carbon.alphaLight};
  border-radius: ${rem(12)};
  cursor: pointer;
`
const SortTabs: React.FC<Props> = ({sort, onChange, activeIndex}) => {
  const {t} = useTranslation()
  return (
    <SortTabsContainer alignItems='center'>
      <Text scale='caption' weight='bold' as='span'>
        {t('menu:vendorInfo.order')}
      </Text>
      <TabsContainer alignItems='center'>
        <TabOverlay offset={133 * activeIndex} />
        {sort.params.map((sort, index) => (
          <Tab key={sort.key} onClick={() => onChange(sort, index)}>
            <Text
              scale='body'
              colorName={activeIndex === index ? 'accent2' : 'carbon'}
            >
              {sort.title}
            </Text>
          </Tab>
        ))}
      </TabsContainer>
    </SortTabsContainer>
  )
}

export default SortTabs
