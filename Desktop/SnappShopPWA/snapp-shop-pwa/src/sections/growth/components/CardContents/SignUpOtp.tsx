import React from 'react'
import {rem} from 'polished'
import styled from 'styled-components'
import {Button, EditIcon, ExclamationIcon, Input, Text} from '@sf/design-system'
import {keyframes, StyledComponent, DefaultTheme} from 'styled-components'
import {useTranslation} from 'react-i18next'
import {useSetTimer} from '@hooks/useSetTimer'
import STATES from '../../constants'
import {secondsToTime} from '@utils'
interface CardContentSignUpOtpProps {
  ErrorContainer: StyledComponent<'div', DefaultTheme, {}, never>
  LinkTo: any
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  hasError: boolean
  setState: Function
  setMobile: Function
  setConfirmation: Function
  mobile: string
  isLoading: boolean
  confirmation: string
  resendConfirmationCode: Function
}

const SlideUpKf = keyframes`
  from { opacity: 0.25; }
  to { opacity: 1; }
`
const CardContentSignUpOtpContainer = styled.form`
  display: flex;
  flex-direction: column;
  padding: ${({theme}) => theme.spacing[3]};
  animation: ${SlideUpKf} 0.3s;

  > * {
    &:nth-child(2) {
      margin: ${rem(14)} 0 ${rem(30)} 0;
    }

    &:nth-child(4) {
      margin: ${rem(6)} 0 ${rem(8)} 0;
    }

    &:nth-last-child(3) {
      margin: ${rem(14)} auto ${rem(30)};
    }

    &:nth-last-child(2) {
      margin: 0 auto ${rem(24)} auto;
    }
  }
`
const RemainedContainer = styled.div`
  > {
    &:first-child {
      min-width: ${({theme}) => theme.spacing[5]};
    }
  }
`
const ALink = styled.a`
  border: 0;
  color: var(--sf-accent2-main);
  text-decoration: none;
`
const CardContentSignUpOtp: React.FC<CardContentSignUpOtpProps> = props => {
  const [remainedTime, setRemainedTime] = useSetTimer(60 + 59)
  const {t} = useTranslation()

  return (
    <CardContentSignUpOtpContainer onSubmit={props.handleSubmit}>
      <Text scale='large'>
        {t('confirmation_sent_1')}{' '}
        <Text as='span' scale='large' weight='bold' numeric={false}>
          {props.mobile}
        </Text>{' '}
        {t('confirmation_sent_2')}
      </Text>
      <Text scale='body'>
        <EditIcon
          fill='var(--sf-accent2-main)'
          style={{marginLeft: '6px', width: '12px', height: '12px'}}
        />
        <props.LinkTo
          onClick={function () {
            props.setState(STATES.LOGIN_SIGNUP)
            props.setMobile('')
          }}
        >
          {t('edit_number')}
        </props.LinkTo>
      </Text>
      <Input
        type='text'
        name='confirmation'
        placeholder=''
        err={props.hasError}
        onChange={e => props.setConfirmation(e.target.value)}
      />
      {props.hasError ? (
        <props.ErrorContainer>
          <ExclamationIcon width={16} height={16} />
          <Text scale='caption' colorName='alert' colorWeight='main'>
            {t('wrong_code')}
          </Text>
        </props.ErrorContainer>
      ) : (
        <div style={{height: 16}} />
      )}
      <Text
        scale='caption'
        colorName='carbon'
        colorWeight='light'
        align='center'
        style={{
          opacity: 0.8,
        }}
      >
        {!remainedTime ? (
          t('code_not_received')
        ) : (
          <RemainedContainer>
            <Text scale='caption' align='center'>
              {secondsToTime(remainedTime, 'M:S')}
            </Text>
            <Text scale='caption' align='center'>
              {t('wait')}
            </Text>
          </RemainedContainer>
        )}
      </Text>
      {!remainedTime ? (
        <props.LinkTo
          align='center'
          onClick={function () {
            setRemainedTime(60 + 59)
            props.resendConfirmationCode(STATES.SIGNUP_OTP)
          }}
        >
          {t('resend')}
        </props.LinkTo>
      ) : (
        <div style={{height: '20px'}} />
      )}
      <Text
        scale='caption'
        colorName='carbon'
        colorWeight='light'
        style={{
          opacity: 0.8,
        }}
      >
        <Text as='span' scale='body' weight='bold'>
          {t('signup_caption_1')}{' '}
          <ALink href='/rules' target='_blank' rel='noreferrer'>
            {t('signup_caption_2')}
          </ALink>
          <br />
          {t('signup_caption_3')}
        </Text>
      </Text>
      <Button
        size='large'
        type='submit'
        isLoading={props.isLoading}
        disabled={props.confirmation.length != 5}
      >
        {t('signup')}
      </Button>
    </CardContentSignUpOtpContainer>
  )
}
export default CardContentSignUpOtp
