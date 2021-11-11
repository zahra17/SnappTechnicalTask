import React from 'react'
import styled, {useTheme} from 'styled-components'
import {rem} from 'polished'
import {Img} from '@components/Img'
import {Anchor} from '@components/Anchor'
import Link from 'next/link'
import {
  SnappShopIcon as TypeMarkIcon,
  FlexBox,
  Text,
  Button,
} from '@sf/design-system'
import {useTranslation} from 'react-i18next'
import {useRouter} from 'next/router'
const Container = styled(FlexBox)`
  height: 80vh;
`
const IconWrapper = styled(FlexBox)`
  flex-grow: 0;
  padding: ${rem(20)};

  svg {
    outline: none;
  }
`
const ContentWrapper = styled(FlexBox)`
  flex-grow: 1;

  button {
    width: 100%;
  }
`
const TextStyled = styled(Text)`
  margin: 24px 0;
`
const Custom404: React.FC = () => {
  const {t} = useTranslation()
  const router = useRouter()
  const theme = useTheme()
  const goHome = () => router.push('/')

  return (
    <Container direction='column' alignItems='center'>
      <IconWrapper>
        <Link
          href={{pathname: '/', search: 'reset-scroll=true'}}
          as='/'
          passHref
        >
          <Anchor>
            <TypeMarkIcon
              role='button'
              tabIndex={0}
              width='82'
              height='42'
              fill={theme.accent.main}
            />
          </Anchor>
        </Link>
      </IconWrapper>
      <ContentWrapper direction='column' justify='center' alignItems='center'>
        <Img src='/static/images/error_404.png' alt={t('core:alt_404')} />
        <TextStyled scale='large' colorName='carbon'>
          {t('core:error.404')}
        </TextStyled>
        <Button color='accent' onClick={goHome} textShadow={true}>
          {t('core:back_to_home')}
        </Button>
      </ContentWrapper>
    </Container>
  )
}

export default Custom404
