import React from 'react'
import styled from 'styled-components'
import {SimplePageComponent} from '@root/types'
import Head from 'next/head'
import {useTranslation} from 'react-i18next'
import growthSideEffects from '~growth/helpers'
import {rem} from 'polished'
import {FlexBox, Text} from '@sf/design-system'
import {StaticLayout} from '~growth/layouts/StaticPage'

const Page = styled(StaticLayout)`
  min-height: 70vh;
`

const RulesBox = styled(FlexBox).attrs({
  direction: 'column',
})`
  width: ${rem(1170)};
  margin: ${({theme}) => theme.spacing[5]} auto;
  padding: ${rem(50)} ${rem(50)} ${rem(100)};
  background-color: ${({theme}) => theme.surface.light};
  box-shadow: 0 0 ${rem(3)} ${({theme}) => theme.inactive.light};

  @media screen and (max-width: 1280px) {
    width: ${rem(850)};
  }
`

const RulesTitle = styled(Text)`
  display: block;
  margin: ${rem(5)} 0;
`

const OrderedList = styled.ol`
  margin: 0;
  padding: 0;
  text-align: justify;
  list-style-type: none;
`

const ListItem = styled(RulesTitle)`
  padding-left: ${rem(12)};
  text-indent: 0;

  &::before {
    position: relative;
    top: ${rem(4)};
    width: ${rem(20)};
    padding: 0 0 0 ${rem(7)};
    color: ${({theme}) => theme.accent.dark};
    font-size: ${rem(21)};
    line-height: ${rem(21)};
    content: '• ';
  }
`

const Rules: SimplePageComponent = () => {
  const {t} = useTranslation()

  return (
    <>
      <Head>
        <title>{t('growth:rules.pageTitle')}</title>
      </Head>
      <Page>
        <RulesBox>
          <RulesTitle scale='body' as='h5' lh='large'>
            {t('growth:rules.rulesTitle')}
          </RulesTitle>
          <OrderedList>
            {(t('growth:rules.rulesList', {returnObjects: true}) as []).map(
              (rule: string, index: number) => {
                return (
                  <ListItem scale='body' lh='default' as='li' key={index}>
                    {rule}
                  </ListItem>
                )
              }
            )}
          </OrderedList>
        </RulesBox>
      </Page>
    </>
  )
}

Rules.getInitialProps = async ctx => {
  growthSideEffects(ctx)
}

export default Rules
