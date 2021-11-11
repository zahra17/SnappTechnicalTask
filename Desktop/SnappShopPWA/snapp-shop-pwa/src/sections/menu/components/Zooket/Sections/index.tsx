import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import {ZooketCategory} from '~menu/types'
import styled from 'styled-components'
import {rem} from 'polished'
import {Product} from '@schema/product'
import {useTranslation} from 'react-i18next'
import {
  Grid,
  Text,
  FailedMagnifier,
  ChevronLeftIcon,
  ChevronRightIcon,
  Button,
} from '@sf/design-system'
import {ZooketSection, ZooketSectionType} from '~menu/types'
import NoResult from '@components/NoResult'

interface Props {
  clearSearch: () => void
  searchQuery: string
  sections: ZooketSection[]
  renderProducts: (products: Product[]) => React.ReactElement[]
  categories: ZooketCategory[]
  activeCategories: (number | null)[]
  handleBredCrumb: (categoryId: (number | null)[]) => void
  moreText?: string
}

const SectionHeading = styled(Text).attrs({
  scale: 'caption',
  weight: 'normal',
  colorName: 'inactive',
  colorWeight: 'dark',
})`
  display: flex;
  align-items: center;

  /* justify-content: space-between; */
  height: ${rem(48)};
  margin-right: ${({theme}) => theme.spacing[2]};
  /* cursor: pointer; */
`

const SectionHeadingVitrin = styled(Text).attrs({
  scale: 'caption',
  weight: 'bold',
  colorName: 'carbon',
  colorWeight: 'light',
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${rem(48)};
  margin-right: ${({theme}) => theme.spacing[2]};

  > :last-child {
    margin-left: 1rem;
  }
`
const ClickableItem = styled.span`
  cursor: pointer;
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
`

export const ZooketSections: React.FC<Props> = ({
  sections,
  clearSearch,
  searchQuery,
  renderProducts,
  categories = [],
  activeCategories,
  handleBredCrumb,
  moreText,
}) => {
  //useState
  const MIN_NUMBER_VITRIN = 4
  const SHOW_VITRIN = 0
  const [showVitrin, setShowVitrin] = useState<number>(SHOW_VITRIN)
  const {t} = useTranslation()
  const {query} = useRouter()

  useEffect(() => {
    setShowVitrin(SHOW_VITRIN)
  }, [sections])
  return (
    <Container>
      {sections.map(section => {
        switch (section.type) {
          case ZooketSectionType.Products:
            return (
              <section
                key={section.id}
                id={String(section.id)}
                data-categoryid={String(section.id)}
              >
                {showVitrin == 0
                  ? Boolean(section.data.title) && (
                      <SectionHeadingVitrin>
                        {section.data.title}
                        {section.data.items.length > MIN_NUMBER_VITRIN && (
                          <Button
                            appearance='naked'
                            colorName='accent2'
                            onClick={() => {
                              setShowVitrin(section.id)
                            }}
                          >
                            <Text
                              margin='1rem 0'
                              scale='body'
                              weight='bold'
                              style={{color: 'var(--sf-accent2-main)'}}
                            >
                              {moreText}
                            </Text>
                            <ChevronLeftIcon
                              fill='var(--sf-accent2-main)'
                              width='6.58'
                              height='11.17'
                              style={{
                                margin: '0.1rem 0.6rem 0 0.8rem',
                                border: '1px',
                              }}
                            />
                          </Button>
                        )}
                      </SectionHeadingVitrin>
                    )
                  : Boolean(section.data.title) &&
                    section.id == showVitrin && (
                      <SectionHeading>
                        <ClickableItem
                          aria-hidden='true'
                          onClick={() => {
                            handleBredCrumb([])
                            setShowVitrin(SHOW_VITRIN)
                          }}
                        >
                          {t('vitrin')}{' '}
                        </ClickableItem>
                        <ChevronLeftIcon
                          fill='var(--sf-inactive-dark)'
                          style={{
                            margin: '0.1rem 0.1rem 0 0.8rem',
                            width: '4.94px',
                          }}
                        />
                        <Text
                          margin='1rem 0'
                          scale='tiny'
                          weight='bold'
                          style={{color: 'var(--sf-carbon-light)'}}
                        >
                          {section.data.title}
                        </Text>
                      </SectionHeading>
                    )}
                {searchQuery !== '' && (
                  <SectionHeading>
                    <ChevronRightIcon
                      onClick={clearSearch}
                      fill='var(--sf-carbon-light)'
                      width='7.15'
                      height='12.64'
                      style={{
                        marginRight: '14px',
                        cursor: 'pointer',
                      }}
                    />
                    <Text
                      as='span'
                      margin='0 25px 0 4px'
                      scale='default'
                      weight='normal'
                      colorName='carbon'
                      colorWeight='main'
                      style={{opacity: 0.6}}
                    >
                      {t('result_for')}
                    </Text>
                    <Text
                      as='span'
                      scale='default'
                      weight='bold'
                      colorName='carbon'
                      colorWeight='main'
                    >
                      «{searchQuery}»
                    </Text>
                  </SectionHeading>
                )}
                {activeCategories?.length == 1
                  ? categories.map(
                      item =>
                        item.id == activeCategories[0] && (
                          <SectionHeading>
                            <ClickableItem
                              aria-hidden='true'
                              onClick={() => handleBredCrumb([])}
                            >
                              {t('vitrin')}{' '}
                            </ClickableItem>
                            <ChevronLeftIcon
                              fill='var(--sf-inactive-dark)'
                              style={{
                                margin: '0.1rem 0.1rem 0 0.8rem',
                                width: '4.94px',
                              }}
                            />
                            <Text
                              margin='1rem 0'
                              scale='tiny'
                              weight='bold'
                              style={{color: 'var(--sf-carbon-light)'}}
                            >
                              {' '}
                              {item.title}
                            </Text>
                          </SectionHeading>
                        )
                    )
                  : activeCategories?.length == 2 &&
                    categories.map(
                      item =>
                        item.id == activeCategories[0] && (
                          <SectionHeading>
                            <ClickableItem
                              aria-hidden='true'
                              onClick={() => handleBredCrumb([])}
                            >
                              {t('vitrin')}{' '}
                            </ClickableItem>
                            <ChevronLeftIcon
                              fill='var(--sf-inactive-dark)'
                              style={{
                                margin: '0.1rem 0.1rem 0 0.8rem',
                                width: '4.94px',
                              }}
                            />
                            <ClickableItem
                              aria-hidden='true'
                              onClick={item =>
                                handleBredCrumb(activeCategories.slice(0, 1))
                              }
                            >{`${item.title}`}</ClickableItem>
                            <ChevronLeftIcon
                              fill='var(--sf-inactive-dark)'
                              style={{
                                margin: '0.1rem 0.1rem 0 0.8rem',
                                width: '4.94px',
                              }}
                            />

                            {item?.sub?.map(
                              i =>
                                i.id == activeCategories[1] && (
                                  <Text
                                    margin='1rem 0'
                                    scale='tiny'
                                    weight='bold'
                                    style={{color: 'var(--sf-carbon-light)'}}
                                  >
                                    {' '}
                                    {i.title}
                                  </Text>
                                )
                            )}
                          </SectionHeading>
                        )
                    )}

                {showVitrin == 0 ? (
                  section.data.items.length > 0 &&
                  Boolean(!section.data.title) ? (
                    <SectionItems>
                      {renderProducts(section.data.items)}
                    </SectionItems>
                  ) : section.data.items.length > MIN_NUMBER_VITRIN &&
                    Boolean(section.data.title) ? (
                    <SectionItems>
                      {renderProducts(section.data.items.slice(0, 4))}
                    </SectionItems>
                  ) : section.data.items.length > 0 &&
                    section.data.items.length <= MIN_NUMBER_VITRIN &&
                    Boolean(section.data.title) ? (
                    <SectionItems>
                      {renderProducts(section.data.items)}
                    </SectionItems>
                  ) : (
                    <NoResult
                      searchMessage={t('no-result-query-with-link', {
                        query: query.query,
                      })}
                    >
                      <FailedMagnifier />
                    </NoResult>
                  )
                ) : (
                  <SectionItems>
                    {section.id == showVitrin &&
                      renderProducts(section.data.items)}
                  </SectionItems>
                )}
              </section>
            )
          default:
            return null
        }
      })}
    </Container>
  )
}
