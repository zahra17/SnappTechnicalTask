import React from 'react'
import styled from 'styled-components'
import {rem} from 'polished'

import {CafeBazar, FlexBox, GooglePlay, SibApp, Text} from '@sf/design-system'
import {DownloadInput} from './DownloadInput'
import {Img} from '@components/Img'
import {LazySection} from '@components/LazySection'

const Container = styled(FlexBox)`
  box-sizing: border-box;
  height: ${rem(494)};
  margin-top: ${rem(150)};
  padding: ${({theme}) => theme.spacing[8]};
  background-color: ${({theme}) => theme.surface.dark};
  border-bottom-right-radius: ${rem(120)};

  > * {
    flex-grow: 1;
  }
  /* FlexBox */
  > :first-child {
    padding: ${rem(0)} ${rem(82)} ${rem(0)} ${rem(96)};

    > * {
      margin-bottom: ${({theme}) => theme.spacing[5]};
      line-height: ${rem(32)};
    }
  }

  @media screen and (max-width: 1300px) {
    height: ${rem(550)};
  }
`
const Title = styled(Text)`
  font-size: ${rem(32)};
`
const DownloadIcons = styled(FlexBox)`
  > * {
    margin-left: ${({theme}) => theme.spacing[2]};
  }
`
const PhoneImg = styled(Img)`
  transform: translateY(-31%);
`

export const DownloadSection: React.FC = () => {
  return (
    <LazySection preservedHeight='494px' visible={true}>
      <Container>
        <FlexBox direction='column'>
          <Title as='h1' scale='xlarge' weight='bold' family='snapweb'>
            اپلیکیشن اسنپ‌فود
          </Title>
          <Text scale='body' colorWeight='light' family='snapweb'>
            با اپلیکیشن اسنپ‌فود به راحتی و با چند کلیک ساده می‌توانید
            رستوران‌ها، کافه‌ها، شیرینی‌فروشی‌ها و سوپرمارکت‌های نزدیک خودتان را
            جست‌و‌جو کرده و از تجربه سفارش آسان از اسنپ‌فود لذت ببرید.
          </Text>
          <DownloadInput />
          <DownloadIcons>
            <a
              target='_blank'
              rel='noreferrer'
              href='https://play.google.com/store/apps/details?id=com.zoodfood.android.play&hl=en'
            >
              <GooglePlay />
            </a>
            <a
              target='_blank'
              rel='noreferrer'
              href='https://cafebazaar.ir/app/com.zoodfood.android/?l=fa'
            >
              <CafeBazar />
            </a>
            <a
              target='_blank'
              rel='noreferrer'
              href='https://sibapp.com/applications/zoodfood-1'
            >
              <SibApp />
            </a>
          </DownloadIcons>
        </FlexBox>
        <div>
          <PhoneImg src='/static/images/img_app_mockup@2x.png' width='424' />
        </div>
      </Container>
    </LazySection>
  )
}
