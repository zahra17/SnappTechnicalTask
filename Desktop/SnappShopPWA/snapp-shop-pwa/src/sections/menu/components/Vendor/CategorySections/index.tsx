import React from 'react'
import styled from 'styled-components'
import {rem} from 'polished'
import {
  flexCenter,
  Grid,
  Text,
  FailedMagnifier,
  ChevronRightIcon,
  FlexBox,
} from '@sf/design-system'
import {MenuCategory, ProductVariation} from '@schema/product'
import {COUPON_CATEGORY_ID} from '~menu/constants'
import {Coupons} from '~menu/components/Coupons'
import NoResult from '@components/NoResult'
import {useTranslation} from 'react-i18next'
import {useRouter} from 'next/router'
import {DecodedValueMap, QueryParamConfig} from 'use-query-params'

interface Props {
  categories: MenuCategory[]
  hasCoupon?: boolean
  searchRes: ProductVariation[]
  handleClearQuery: () => void
  renderProducts: (
    productVariations: ProductVariation[],
    categoryId: number
  ) => React.ReactElement[]

  queryParam: DecodedValueMap<{
    query: QueryParamConfig<
      string | null | undefined,
      string | null | undefined
    >
  }>
}

const SectionHeading = styled(Text).attrs({
  scale: 'caption',
  weight: 'bold',
})<{index: number}>`
  height: ${rem(48)};
  margin-top: ${({index}) => (index > 1 ? rem(32) : 0)};
  color: ${({theme}) => theme.carbon.light};
  ${flexCenter};
`
const SearchHeading = styled(FlexBox)`
  margin: ${rem(20)} ${rem(25.5)} ${rem(20)} ${rem(0)};

  > *:first-child {
    margin-left: ${rem(25.5)};
  }
`
const SectionItems = styled(Grid).attrs({container: true})`
  --border-style: ${rem(1)} solid ${({theme}) => theme.surface.dark};
  border-top: var(--border-style);

  > * {
    border-bottom: var(--border-style);

    &:nth-child(2n + 1) {
      border-left: var(--border-style);
    }
  }
`
const Container = styled.section`
  background-color: ${({theme}) => theme.surface.light};
  border: ${rem(1)} solid ${({theme}) => theme.surface.dark};
  border-radius: ${rem(8)};

  > section {
    scroll-margin-top: ${rem(70)};
  }
`

export const CategorySections: React.FC<Props> = ({
  categories,
  renderProducts,
  searchRes,
  handleClearQuery,
  queryParam,
}) => {
  const {t} = useTranslation()
  const {query} = useRouter()
  return (
    <Container>
      <Coupons />
      {String(queryParam?.query) !== '' && queryParam?.query !== undefined ? (
        searchRes.length > 0 ? (
          <section>
            <SearchHeading justify='start' alignItems='center'>
              <ChevronRightIcon onClick={handleClearQuery} />
              {t('result-for')}&nbsp;
              <Text scale='default' weight='bold'>{`«${query.query}»`}</Text>
            </SearchHeading>
            <SectionItems>{renderProducts(searchRes, 1)}</SectionItems>
          </section>
        ) : (
          <FlexBox justify='center' alignItems='center' direction='column'>
            <NoResult
              searchMessage={t('no-result-query-with-link', {
                query: query.query,
              })}
            >
              <FailedMagnifier />
            </NoResult>
          </FlexBox>
        )
      ) : (
        categories.map(
          (category, index) =>
            category.categoryId !== COUPON_CATEGORY_ID && (
              <section
                key={category.categoryId}
                id={String(category.categoryId)}
                data-categoryid={String(category.categoryId)}
              >
                <SectionHeading index={index}>
                  {category.category}
                </SectionHeading>
                <SectionItems>
                  {renderProducts(
                    category.productVariations,
                    category.categoryId
                  )}
                </SectionItems>
              </section>
            )
        )
      )}
    </Container>
  )
}
