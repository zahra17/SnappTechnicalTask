import React from 'react'
import {rem} from 'polished'
import {useTranslation} from 'react-i18next'
import {FlexBox, Text} from '@sf/design-system'
import styled from 'styled-components'

interface Props {
  onChange: (activeIndex: number) => void
  activeIndex: number
  activeIndexLength: number
  hasProductDetail: boolean
  hasProductAttributes: boolean
}
export const Container = styled(FlexBox)`
  margin-top: ${rem(22)};
  margin-right: ${rem(12)};
`
export const Tab = styled(FlexBox).attrs({
  alignItems: 'center',
  justify: 'center',
})`
  z-index: 2;
  width: ${rem(117)};
  padding: ${rem(10)};
`
export const TabOverlay = styled.div<{
  offset: number
  number: number
}>`
  position: absolute;
  width: ${({number = 1}) =>
    number === 1 ? '94%' : number === 2 ? '48%' : ''};
  height: ${rem(56)};
  margin: 0 ${rem(4)};
  background-color: ${({theme}) => theme.surface.light};
  border-radius: ${rem(10)};
  transform: translateX(-${({offset = 0}) => offset}px);
  transition: 0.1s;
`
export const TabsContainer = styled(FlexBox)`
  position: relative;
  height: ${rem(64)};
  background-color: ${({theme}) => theme.carbon.alphaLight};
  border-radius: ${rem(12)};
  cursor: pointer;
`
const ProductTabs: React.FC<Props> = ({
  onChange,
  activeIndex,
  activeIndexLength,
  hasProductDetail = false,
  hasProductAttributes = false,
}) => {
  const {t} = useTranslation()
  return (
    <Container alignItems='center'>
      <TabsContainer alignItems='center'>
        <TabOverlay offset={133 * activeIndex} number={activeIndexLength} />
        {hasProductDetail && (
          <Tab key='product-details' onClick={() => onChange(0)}>
            <Text scale='body' weight={activeIndex === 0 ? 'bold' : 'normal'}>
              {t('menu:tabs.product-detail')}
            </Text>
          </Tab>
        )}
        {hasProductAttributes && (
          <Tab key='product-properties' onClick={() => onChange(1)}>
            <Text scale='body' weight={activeIndex === 1 ? 'bold' : 'normal'}>
              {t('menu:tabs.product-property')}
            </Text>
          </Tab>
        )}
      </TabsContainer>
    </Container>
  )
}

export default ProductTabs
