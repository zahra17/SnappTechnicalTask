import React from 'react'
import styled, {useTheme} from 'styled-components'
import {rem} from 'polished'
import i18n from '@i18n'

import {FlexBox, SnappShopIcon as TypeMarkIcon, Text} from '@sf/design-system'

import {ServicesList} from '~search/components/ServicesList'
import {UserProfile} from '~growth/components/UserProfile'
import {AnimatedTexts} from '~search/components/Home/AnimatedText'
import {SelectLocationBox} from '~search/components/Home/SelectLocationBox'
import {Img} from '@components/Img'

const ServicesWrapper = styled.div`
  position: relative;
  z-index: 100;
  padding: ${rem(16)} 0 ${rem(8)} 0;
  background-color: rgba(242, 244, 245, 0.75);
  border-radius: ${({theme}) => theme.spacing[3]};

  @supports (backdrop-filter: blur(40px)) {
    background-color: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(${({theme}) => theme.spacing[5]});
  }
`
const HeroImgWrapper = styled.div`
  position: absolute;
  top: ${rem(150)};
  left: 0;
  width: 50%;
  height: 85%;
  margin-top: -${({theme}) => theme.spacing[8]};
`
const HeroImg = styled(Img)`
  left: 0;
`
const StyledHero = styled(FlexBox)`
  position: relative;
  box-sizing: border-box;
  height: ${rem(704)};
  padding: ${({theme}) => theme.spacing[4]};
  overflow: hidden;
  background-color: ${({theme}) => theme.surface.main};
  border-bottom-right-radius: ${rem(120)};

  > :nth-child(2) {
    flex-grow: 1;
  }
`
const HeroContent = styled(FlexBox)`
  margin-top: ${rem(146)};
  margin-right: ${({theme}) => theme.spacing[2]};
`
const HeroTitle = styled(Text)`
  font-size: ${rem(40)};
`
const animatedTexts = [
  i18n.t('search:home.food'),
  i18n.t('search:home.grocery'),
  i18n.t('search:home.bread'),
  i18n.t('search:home.fruit'),
  i18n.t('search:home.coffee'),
  i18n.t('search:home.pizza'),
  i18n.t('search:home.food'),
]

export const Hero: React.FC = () => {
  const theme = useTheme()

  return (
    <StyledHero direction='column'>
      <HeroImgWrapper>
        <HeroImg src='/static/images/hero-image.png' />
      </HeroImgWrapper>
      <div>
        <FlexBox justify='space-between' alignItems='center'>
          <TypeMarkIcon
            width='136.08'
            height='69.54'
            fill={theme.accent.main}
          />
          <UserProfile />
        </FlexBox>
        <HeroContent direction='column'>
          <FlexBox alignItems='center'>
            <HeroTitle as='h1' scale='xlarge' weight='bold' family='snapweb'>
              سفارش آنلاین
            </HeroTitle>
            <AnimatedTexts texts={animatedTexts} />
          </FlexBox>

          <Text scale='body' colorWeight='light' family='snapweb'>
            سفارش آنلاین از رستوران‌ها،‌شیرینی‌فروشی‌ها، کافی‌شاپ‌ها،
            <br />
            سوپرمارکت‌ها،‌ نانوایی‌ها و ...
          </Text>

          <SelectLocationBox />
        </HeroContent>
      </div>
      <ServicesWrapper>
        <ServicesList />
      </ServicesWrapper>
    </StyledHero>
  )
}
