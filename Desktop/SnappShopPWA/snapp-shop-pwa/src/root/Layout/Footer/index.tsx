import React from 'react'
import {rem} from 'polished'
import styled, {useTheme} from 'styled-components'
import {
  FlexBox,
  Grid,
  SnappShopIcon as TypeMarkIcon,
  Text,
  Button,
  TwitterLogo,
  TelegramLogo,
  InstagramLogo,
  AparatLogo,
  LinkedIn,
} from '@sf/design-system'
import {Img} from '@components/Img'
import {useTranslation} from 'react-i18next'
import Link from 'next/link'
import {Anchor} from '@components/Anchor'

const StyledFooter = styled.div`
  box-sizing: border-box;
  width: 100%;
  min-width: ${rem(1024)};
  padding: ${({theme}) => theme.spacing[6]};
  background-color: ${({theme}) => theme.surface.main};
`
const TextList = styled(FlexBox)`
  > * {
    margin: ${rem(8)};
  }
`
const Heading = styled(FlexBox)`
  margin-right: ${({theme}) => theme.spacing[3]};
  /* Last FlexBox */
  > :first-child {
    margin-bottom: ${rem(4)};
  }
`
const SocialLinks = styled(FlexBox)`
  margin-top: ${({theme}) => theme.spacing[4]};

  > svg {
    visibility: hidden;
  }

  > :last-child {
    margin-right: ${({theme}) => theme.spacing[3]};
  }
`
const ALink = styled.a`
  border: 0;
`
const socialIcons = [
  // {Icon: AparatLogo, link: 'http://www.aparat.com/snappfood'},
  {Icon: InstagramLogo, link: 'https://www.instagram.com/snappshop_official'},
  {Icon: LinkedIn, link: ' https://www.linkedin.com/company/snappshop/'},
  // {Icon: TelegramLogo, link: 'https://t.me/snappfood'},
  // {Icon: TwitterLogo, link: 'https://twitter.com/snappfood'},
]

export const Footer = () => {
  const {t} = useTranslation()
  const theme = useTheme()

  const contactTexts = [
    {
      text: t('appfooter.contact-snappfood'),
      link: 'https://snappfood.ir/page/contact',
    },
    {text: t('appfooter.questions'), link: '/faq'},
    {text: t('appfooter.complaints'), link: 'mailto:info@snappfood.ir'},
  ]
  const introductionTexts = [
    {text: t('appfooter.about'), link: '/about'},
    {text: t('appfooter.weblog'), link: 'https://blog.snappfood.ir/'},
    {text: t('appfooter.rules'), link: '/rules'},

    {
      text: t('appfooter.privacy'),
      link: '/privacy-policy',
    },
    {
      text: t('appfooter.vendor-register'),
      link: 'https://snappfood.ir/campaign/registering',
    },
  ]

  return (
    <StyledFooter>
      <Grid container spacing={10}>
        <Grid item xs>
          <FlexBox alignItems='center'>
            <Link
              href={{pathname: '/', search: 'reset-scroll=true'}}
              as='/'
              passHref
            >
              <Anchor>
                <TypeMarkIcon
                  width='81.65'
                  height='41.73'
                  fill={theme.accent.main}
                />
              </Anchor>
            </Link>
            <Heading direction='column'>
              <Text
                scale='large'
                weight='bold'
                colorName='accent'
                family='snapweb'
              >
                {t('snappfood')}
              </Text>
              <Text scale='caption' colorWeight='light'>
                {t('appfooter.heading')}
              </Text>
            </Heading>
          </FlexBox>
          <SocialLinks>
            <TypeMarkIcon
              width='81.65'
              height='41.73'
              fill={theme.accent.main}
              style={{visibility: 'hidden'}}
            />
            <Grid container spacing={2}>
              {socialIcons.map(({Icon, link}, idx) => (
                <Grid item key={idx}>
                  <ALink href={link} target='_blank' rel='noreferrer'>
                    <Button float appearance='outline' colorName='carbon' round>
                      <Icon />
                    </Button>
                  </ALink>
                </Grid>
              ))}
            </Grid>
          </SocialLinks>
        </Grid>
        <Grid item xs>
          <TextList direction='column'>
            {introductionTexts.map(({text, link}) => (
              <ALink key={text} href={link} target='_blank' rel='noreferrer'>
                <Text scale='caption' as='p'>
                  {text}
                </Text>
              </ALink>
            ))}
          </TextList>
        </Grid>
        <Grid item xs>
          <TextList direction='column'>
            {contactTexts.map(({text, link}) => (
              <ALink key={text} href={link} target='_blank' rel='noreferrer'>
                <Text scale='caption' as='p'>
                  {text}
                </Text>
              </ALink>
            ))}
          </TextList>
        </Grid>
        <Grid item xs dir='ltr'>
          <Img
            style={{maxWidth: '125px', cursor: 'pointer'}}
            src='/static/images/senf.png'
            alt='کسب و کار مجازی'
            onClick={() =>
              window.open(
                'https://ecunion.ir/verify/snappfood.ir?token=40807925acf0232a69bb',
                'Popup',
                'toolbar=no, location=no, statusbar=no, menubar=no, scrollbars=1, resizable=0, width=580, height=600, top=30'
              )
            }
          />

          <Img
            className='enamad-img'
            id='xzjJOBtSHm9NSiFaYy2l'
            style={{cursor: 'pointer'}}
            onClick={() =>
              window.open(
                'https://trustseal.enamad.ir/?id=65397&Code=xzjJOBtSHm9NSiFaYy2l',
                'Popup',
                'toolbar=no, location=no, statusbar=no, menubar=no, scrollbars=1, resizable=0, width=580, height=600, top=30'
              )
            }
            alt=''
            src='/static/images/enamad.png'
          />
        </Grid>
      </Grid>
    </StyledFooter>
  )
}
