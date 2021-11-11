import React from 'react'
import {rem} from 'polished'
import styled from 'styled-components'
import {Button, ExclamationIcon, Input, Text} from '@sf/design-system'
import {keyframes, StyledComponent, DefaultTheme} from 'styled-components'
import {useTranslation} from 'react-i18next'

interface CardContentNewPassProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  hasError: boolean
  ErrorContainer: StyledComponent<'div', DefaultTheme, {}, never>
  isLoading: boolean
  confirmNewPassword: React.MutableRefObject<HTMLInputElement | null>
  newPassword: React.MutableRefObject<HTMLInputElement | null>
}

const SlideUpKf = keyframes`
  from { opacity: 0.25; }
  to { opacity: 1; }
`
const CardContentNewPassContainer = styled.form`
  display: flex;
  flex-direction: column;
  padding: ${({theme}) => theme.spacing[3]};
  animation: ${SlideUpKf} 0.3s;

  > * {
    &:nth-child(1) {
      margin-bottom: ${rem(6)};
    }

    &:nth-child(2) {
      margin-bottom: ${rem(6)};
    }

    &:nth-child(3) {
      margin-bottom: ${rem(24)};
      opacity: 0.8;
    }

    &:nth-child(4) {
      margin-bottom: ${rem(6)};
    }

    &:nth-child(6) {
      margin: ${rem(16)} 0 ${rem(16)} 0;
    }
  }
`
const CardContentNewPass: React.FC<CardContentNewPassProps> = props => {
  const {t} = useTranslation()

  return (
    <CardContentNewPassContainer onSubmit={props.handleSubmit}>
      <Text
        scale='caption'
        colorName={props.hasError ? 'alert' : 'carbon'}
        colorWeight={props.hasError ? 'main' : 'light'}
        weight='bold'
        style={{
          opacity: props.hasError ? 1 : 0.8,
        }}
      >
        {t('new_password')}
      </Text>

      <Input
        type='password'
        name='newPassword'
        ref={props.newPassword}
        placeholder=''
        err={props.hasError}
      />

      <Text scale='caption'>{t('password_hint')}</Text>
      <Text
        scale='caption'
        colorName={props.hasError ? 'alert' : 'carbon'}
        colorWeight={props.hasError ? 'main' : 'light'}
        weight='bold'
        style={{
          opacity: props.hasError ? 1 : 0.8,
        }}
      >
        {t('new_password_confirm')}
      </Text>
      <Input
        type='password'
        name='confirmationNewPassword'
        ref={props.confirmNewPassword}
        placeholder=''
        err={props.hasError}
      />
      {props.hasError ? (
        <props.ErrorContainer>
          <ExclamationIcon width={16} height={16} />
          <Text scale='caption' colorName='alert' colorWeight='main'>
            {t('passwords_did_not_match')}
          </Text>
        </props.ErrorContainer>
      ) : (
        <div style={{height: 16}} />
      )}
      <Button
        size='large'
        isLoading={props.isLoading}
        disabled={Boolean(
          (props.newPassword.current?.value &&
            props.newPassword.current?.value?.length < 6) ||
            (props.confirmNewPassword.current?.value &&
              props.confirmNewPassword.current?.value?.length < 6)
        )}
      >
        {t('change_password')}
      </Button>
    </CardContentNewPassContainer>
  )
}
export default CardContentNewPass
