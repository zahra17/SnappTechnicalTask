import React, {useEffect} from 'react'
import {rem} from 'polished'
import styled from 'styled-components'
import {
  Button,
  ExclamationIcon,
  Input,
  Text,
  toEnglish,
} from '@sf/design-system'
import {useTranslation} from 'react-i18next'
import {keyframes, StyledComponent, DefaultTheme} from 'styled-components'
import {cellNumberValidation} from '@utils'

interface CardContentProps {
  ErrorContainer: StyledComponent<'div', DefaultTheme, {}, never>
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  setHasError: Function
  hasError: boolean
  setMobile: Function
  mobile: string
  isLoading: boolean
}

const SlideUpKf = keyframes`
  from { opacity: 0.25; }
  to { opacity: 1; }
`
const CardContentContainer = styled.form`
  display: flex;
  flex-direction: column;
  padding: ${({theme}) => theme.spacing[3]};
  animation: ${SlideUpKf} 0.3s;

  > * {
    &:nth-child(2) {
      margin: ${rem(6)} 0;
    }

    &:nth-child(4) {
      margin-top: ${({theme}) => theme.spacing[3]};
    }
  }
`

const CardContentLoginSignup: React.FC<CardContentProps> = props => {
  const {t} = useTranslation()

  // mobile validation
  useEffect(() => {
    if (cellNumberValidation(props.mobile)) {
      props.setHasError(false)
    } else {
      props.setHasError(true)
    }
  }, [props.mobile])

  return (
    <CardContentContainer onSubmit={props.handleSubmit} {...props}>
      <Text
        scale='caption'
        colorName={props.hasError ? 'alert' : 'carbon'}
        colorWeight={props.hasError ? 'main' : 'light'}
        weight='bold'
        style={{
          opacity: props.hasError ? 1 : 0.8,
        }}
      >
        {t('mobile')}
      </Text>
      <Input
        type='tel'
        name='mobile'
        placeholder=''
        err={props.hasError}
        onChange={e => props.setMobile(toEnglish(e.target.value))}
        defaultValue={props.mobile}
        autoFocus
      />
      {!props.hasError ? (
        <Text
          scale='caption'
          colorName='carbon'
          colorWeight='light'
          style={{
            opacity: 0.8,
          }}
        >
          {t('mobile_description')}
        </Text>
      ) : (
        <props.ErrorContainer>
          <ExclamationIcon height={16} width={16} />
          <Text scale='caption' colorName='alert' colorWeight='main'>
            {t('mobile_wrongNumber')}
          </Text>
        </props.ErrorContainer>
      )}
      <Button
        size='large'
        type='submit'
        isLoading={props.isLoading}
        disabled={props.mobile.length != 11}
      >
        {t('continue')}
      </Button>
    </CardContentContainer>
  )
}
export default CardContentLoginSignup
