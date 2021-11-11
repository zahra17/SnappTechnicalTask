import React from 'react'
import styled from 'styled-components'
import {SimplePageComponent} from '@root/types'
import Head from 'next/head'
import {useTranslation} from 'react-i18next'
import growthSideEffects from '~growth/helpers'
import {rem} from 'polished'
import {FlexBox, Text} from '@sf/design-system'
import {StaticLayout} from '~growth/layouts/StaticPage'

const Page = styled(StaticLayout)``

const ContentContainer = styled(FlexBox).attrs({
  direction: 'column',
  alineItems: 'center',
})`
  width: ${rem(1240)};
`

const TitleText = styled(Text)``

const Privacy = styled(TitleText)``

const MainContentContainer = styled.div`
  margin: ${rem(40)} 0 ${rem(80)} 0;
  padding: 0 ${rem(40)};
`

const MainContent = styled(Text)`
  white-space: break-spaces;
`

const ContactDetails = styled(MainContent)``

const PrivacyPolicy: SimplePageComponent = () => {
  const {t} = useTranslation()

  return (
    <>
      <Head>
        <title>{t('growth:privacyPolicy.pageTitle')}</title>
      </Head>
      <Page>
        <ContentContainer>
          <TitleText as='h3' scale='xlarge' weight='bold' align='center'>
            {t('growth:privacyPolicy.contentTitle.informationRetentionPolicy')}
            {` ${t('growth:privacyPolicy.contentTitle.and')} `}
            <Privacy
              scale='xlarge'
              colorName='accent'
              colorWeight='dark'
              as='span'
              weight='bold'
              align='center'
            >
              {t('growth:privacyPolicy.contentTitle.privacy')}
            </Privacy>
          </TitleText>
          <MainContentContainer>
            <MainContent scale='body' align='start' lh='default'>
              {t('growth:privacyPolicy.mainContent')}
            </MainContent>
            <ContactDetails scale='body' align='start' lh='default'>
              {t('growth:privacyPolicy.contactDetails')}
            </ContactDetails>
          </MainContentContainer>
        </ContentContainer>
      </Page>
    </>
  )
}

PrivacyPolicy.getInitialProps = async ctx => {
  growthSideEffects(ctx)
}

export default PrivacyPolicy
