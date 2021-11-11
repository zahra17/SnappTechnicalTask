import React from 'react'
import styled from 'styled-components'
import {SimplePageComponent} from '@root/types'
import Head from 'next/head'
import growthSideEffects from '~growth/helpers'
import {useTranslation} from 'react-i18next'
import {rem} from 'polished'
import {FlexBox, Text} from '@sf/design-system'
import {StaticLayout} from '~growth/layouts/StaticPage'
import {Img} from '@components/Img'

const Page = styled(StaticLayout)`
  min-height: 70vh;
`

const MainContainer = styled(FlexBox).attrs({
  direction: 'column',
  alignItems: 'center',
})`
  width: ${rem(850)};
  padding: 0 ${rem(40)} ${rem(68)};
`

const Title = styled(Text)``

const SnappFood = styled(Title)``

const Description = styled(Text)`
  margin-top: ${rem(30)};
`

const OrderedList = styled.ol`
  margin: 0;
  padding: 0;
  text-align: justify;
  list-style-type: none;
`

const ListItem = styled(Text)`
  display: block;
  padding-left: ${rem(12)};
  text-indent: 0;

  &::before {
    position: relative;
    top: ${rem(6)};
    width: ${rem(20)};
    padding: 0 0 0 ${rem(7)};
    color: ${({theme}) => theme.carbon.dark};
    font-size: ${rem(25)};
    line-height: ${rem(21)};
    content: '• ';
  }
`

const ImageContainer = styled.div`
  max-width: ${rem(555)};
`

const AppImage = styled(Img)`
  width: 100%;
`

const DownloadTitle = styled(Text)``

const MarketsContainer = styled(FlexBox)`
  margin-top: ${rem(30)};
`

const MarketLink = styled.a`
  width: ${rem(124)};
  margin: 0 ${rem(15)};
`

const Sign = styled(Img)`
  width: 100%;
`

const AppIntroduction: SimplePageComponent = () => {
  const {t} = useTranslation()

  const createMarketSign = (signName: string, href: string) => (
    <MarketLink href={href} target='_blank'>
      <Sign src={`/static/images/${signName}`} />
    </MarketLink>
  )

  return (
    <>
      <Head>
        <title>{t('growth:appIntroduction.pageTitle')}</title>
      </Head>
      <Page>
        <MainContainer>
          <Title as='h3' scale='xlarge' weight='bold' align='center'>
            {`${t('growth:appIntroduction.contentTitle.application')} `}
            <SnappFood
              scale='xlarge'
              colorName='accent'
              colorWeight='dark'
              as='span'
              weight='bold'
              align='center'
            >
              {t('growth:appIntroduction.contentTitle.snappfood')}
            </SnappFood>
            {t('growth:appIntroduction.contentTitle.continues')}
          </Title>
          <Description scale='default' align='justify' lh='large'>
            {t('growth:appIntroduction.description.app')}

            <OrderedList>
              {(t('growth:appIntroduction.description.advantages', {
                returnObjects: true,
              }) as []).map((advantage: string, index: number) => {
                return (
                  <ListItem
                    scale='default'
                    align='justify'
                    lh='large'
                    as='li'
                    key={index}
                  >
                    {advantage}
                  </ListItem>
                )
              })}
            </OrderedList>

            {t('growth:appIntroduction.description.cities')}
          </Description>
          <ImageContainer>
            <AppImage src={`/static/images/img_app_mockup.png`} />
          </ImageContainer>
          <DownloadTitle scale='default' align='justify' lh='large' as='h3'>
            {t('growth:appIntroduction.downloadTitle')}
          </DownloadTitle>
          <MarketsContainer>
            {createMarketSign(
              'cafebazaar.svg',
              'https://app.adjust.com/5kwuf1?redirect=https://cafebazaar.ir/app/com.zoodfood.android/?l=fa'
            )}
            {createMarketSign(
              'google-play.svg',
              'https://play.google.com/store/apps/details?id=com.zoodfood.android.play&hl=en'
            )}
            {createMarketSign(
              'sib-app.svg',
              'https://sibapp.com/applications/snappfood'
            )}
            {createMarketSign('iapps.svg', 'https://app.iapps.ir/i/312476215')}
          </MarketsContainer>
        </MainContainer>
      </Page>
    </>
  )
}

AppIntroduction.getInitialProps = async ctx => {
  growthSideEffects(ctx)
}

export default AppIntroduction
