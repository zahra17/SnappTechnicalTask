import React from 'react'
import styled from 'styled-components'
import {rem} from 'polished'
import {Img} from '@components/Img'
import {FlexBox, Text, Button} from '@sf/design-system'
import {useTranslation} from 'react-i18next'
import {useRouter} from 'next/router'
const Container = styled(FlexBox)`
  height: 50vh;
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
const CustomError: React.FC<{errorMessage?: string | null}> = ({
  errorMessage = null,
}: {
  errorMessage?: string | null
}) => {
  const {t} = useTranslation()
  const router = useRouter()
  const goHome = () => router.push('/')

  return (
    <Container direction='column' alignItems='center'>
      <ContentWrapper direction='column' justify='center' alignItems='center'>
        <Img src='/static/images/error_404.png' alt={t('core:alt_404')} />
        <TextStyled scale='large' colorName='carbon'>
          {errorMessage || t('core:error.404')}
        </TextStyled>
        <Button color='accent' onClick={goHome} textShadow={true}>
          {t('core:back_to_home')}
        </Button>
      </ContentWrapper>
    </Container>
  )
}

export default CustomError
