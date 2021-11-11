import React from 'react'
import {SimplePageComponent} from '@root/types'
import Head from 'next/head'
import {useTranslation} from 'react-i18next'
import growthSideEffects from '~growth/helpers'
import styled from 'styled-components'
import {rem} from 'polished'
import {FlexBox, Text} from '@sf/design-system'
import {Img} from '@components/Img'
import {StaticLayout} from '~growth/layouts/StaticPage'

const Page = styled(StaticLayout)`
  min-height: 80vh;
`

const MainContainer = styled(FlexBox).attrs({
  justify: 'center',
  alignItems: 'center',
  direction: 'column',
})`
  width: ${rem(1170)};
  margin: 0 auto;
  padding: 0 ${rem(30)} ${rem(100)};
`

const TitleText = styled(Text)``

const AboutText = styled(TitleText)``

const DescriptionContainer = styled(FlexBox).attrs({
  direction: 'column',
})`
  margin-top: ${rem(40)};
  text-align: justify;
`

const FacilitiesContainer = styled(FlexBox).attrs({
  alignItems: 'center',
})``

const ImagesContainer = styled(FlexBox).attrs({
  justify: 'center',
  alignItems: 'center',
})``

const LineImageContainer = styled(FlexBox)`
  position: relative;
  margin: 0 auto;
`

const ImageContainer = styled.div`
  margin: ${rem(60)} 0;
`

const ArrowContainer = styled.div`
  position: absolute;
`

const LaptopArrowContainer = styled(ArrowContainer)`
  bottom: ${rem(30)};
  left: ${rem(-20)};

  @media screen and (max-width: 1200px) {
    bottom: ${rem(31)};
    left: ${rem(-90)};
  }
`

const MapArrowContainer = styled(ArrowContainer)`
  top: ${rem(15)};
  left: ${rem(-30)};

  @media screen and (max-width: 1200px) {
    top: ${rem(17)};
    left: ${rem(-96)};
  }
`

const FoodArrowContainer = styled(ArrowContainer)`
  top: ${rem(96)};
  left: ${rem(-102)};

  @media screen and (max-width: 1200px) {
    top: ${rem(75)};
    left: ${rem(-126)};
  }
`

const MainImage = styled(Img)`
  @media screen and (max-width: 1200px) {
    width: ${rem(200)};
  }
`

const LineImage = styled(Img)`
  @media screen and (max-width: 1200px) {
    width: 80%;
  }
`

const DefaultText = styled(Text)`
  margin: ${rem(5)} 0;
`

const FacilitiesDescriptionContainer = styled.div`
  width: 50%;
`

const FacilitiesDescription = styled(DefaultText)`
  padding: 0 ${rem(90)};
`

const OrderedList = styled.ol`
  margin: 0;
  padding: 0;
  text-align: justify;
  list-style-type: none;
`

const ListItem = styled(DefaultText)`
  display: block;
  margin: 0;
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

const About: SimplePageComponent = () => {
  const {t} = useTranslation()

  return (
    <>
      <Head>
        <title>{t('growth:about.pageTitle')}</title>
      </Head>
      <Page>
        <MainContainer>
          <TitleText as='h3' scale='xlarge' weight='bold' align='center'>
            <AboutText
              scale='xlarge'
              colorName='accent'
              colorWeight='dark'
              as='span'
              weight='bold'
              align='center'
            >
              {t('growth:about.contentTitle.about')}
            </AboutText>
            {` `}
            {t('growth:about.contentTitle.snappfood')}
          </TitleText>
          <DescriptionContainer>
            <DefaultText scale='body' lh='default'>
              {t('growth:about.description')}
            </DefaultText>
            <ImagesContainer>
              <LineImageContainer>
                <ImageContainer>
                  <MainImage src={`/static/images/laptop.jpg`} />
                </ImageContainer>
                <LaptopArrowContainer>
                  <LineImage src={`/static/images/line1.png`} />
                </LaptopArrowContainer>
              </LineImageContainer>
              <LineImageContainer>
                <ImageContainer>
                  <MainImage src={`/static/images/map.png`} />
                </ImageContainer>
                <MapArrowContainer>
                  <LineImage src={`/static/images/line2.png`} />
                </MapArrowContainer>
              </LineImageContainer>
              <LineImageContainer>
                <ImageContainer>
                  <MainImage src={`/static/images/foods.png`} />
                </ImageContainer>
                <FoodArrowContainer>
                  <LineImage src={`/static/images/line3.png`} />
                </FoodArrowContainer>
              </LineImageContainer>
              <LineImageContainer>
                <ImageContainer>
                  <MainImage src={`/static/images/motor.png`} />
                </ImageContainer>
              </LineImageContainer>
            </ImagesContainer>
            <FacilitiesContainer>
              <FacilitiesDescriptionContainer>
                <FacilitiesDescription
                  colorName='accent'
                  colorWeight='dark'
                  scale='default'
                  lh='default'
                >
                  {t('growth:about.facilities.description')}
                </FacilitiesDescription>
              </FacilitiesDescriptionContainer>
              <OrderedList>
                {(t('growth:about.facilities.list', {returnObjects: true}) as [

                ]).map((facility: string, index: number) => {
                  return (
                    <ListItem scale='caption' lh='default' as='li' key={index}>
                      {facility}
                    </ListItem>
                  )
                })}
              </OrderedList>
            </FacilitiesContainer>
          </DescriptionContainer>
        </MainContainer>
      </Page>
    </>
  )
}

About.getInitialProps = async ctx => {
  growthSideEffects(ctx)
}

export default About
