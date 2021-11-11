import React from 'react'
import {rem} from 'polished'
import styled from 'styled-components'
import {Button, EditIcon, ExclamationIcon, Input, Text} from '@sf/design-system'
import {useTranslation} from 'react-i18next'
import {keyframes, StyledComponent, DefaultTheme} from 'styled-components'
import {useSetTimer} from '@hooks/useSetTimer'
import STATES from '../../constants'
import {secondsToTime} from '@utils'
import {useRudderStack} from '@contexts/RudderStack'
import {eventTypes} from '@schema/rudderStack'

interface CardContentConfirmationProps {
  ErrorContainer: StyledComponent<'div', DefaultTheme, {}, never>
  LinkTo: any
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  hasError: boolean
  setMobile: Function
  setState: Function
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
const CardContentConfirmationContainer = styled.form`
  display: flex;
  flex-direction: column;
  padding: ${({theme}) => theme.spacing[3]};
  animation: ${SlideUpKf} 0.3s;

  > * {
    &:nth-child(2) {
      margin: ${rem(16)} ${rem(6)} ${rem(32)} ${rem(0)};
    }

    &:nth-child(4) {
      margin: ${rem(6)} 0 ${rem(8)} 0;
    }

    &:nth-last-child(3) {
      margin-top: ${rem(6)};
    }

    &:nth-last-child(2) {
      margin: ${rem(14)} 0 ${rem(30)} 0;
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

const CardContentConfirmation: React.FC<CardContentConfirmationProps> = props => {
  const [remainedTime, setRemainedTime] = useSetTimer(60 + 59)
  const {t} = useTranslation()
  const rudderStack = useRudderStack()
  const onEditNumberClick = () => {
    props.setState(STATES.LOGIN_SIGNUP)
    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: 'Login OTP phone Edit',
    })
  }
  const onResendCodeClick = () => {
    setRemainedTime(60 + 59)
    props.resendConfirmationCode(STATES.CONFIRMATION)
    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: 'Login OTP retry',
    })
  }
  return (
    <CardContentConfirmationContainer onSubmit={props.handleSubmit}>
      <Text scale='large'>
        {t('confirmation_sent_1')}{' '}
        <Text as='span' scale='large' weight='bold' numeric={false}>
          {props.mobile}
        </Text>{' '}
        {t('confirmation_sent_2')}
      </Text>
      <Text scale='body'>
        <EditIcon
          fill={'var(--sf-accent2-main)'}
          style={{marginLeft: '6px', width: '13px', height: '13px'}}
        />
        <props.LinkTo onClick={onEditNumberClick}>
          {t('edit_number')}
        </props.LinkTo>
      </Text>
      <Input
        type='text'
        name='confirmation'
        placeholder=''
        err={props.hasError}
        onChange={e => props.setConfirmation(e.target.value)}
        autoFocus
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
        <props.LinkTo align='center' onClick={onResendCodeClick}>
          {t('resend')}
        </props.LinkTo>
      ) : (
        <div style={{height: '20px'}} />
      )}
      <Button
        size='large'
        isLoading={props.isLoading}
        disabled={props.confirmation.length != 5}
      >
        {t('login')}
      </Button>
    </CardContentConfirmationContainer>
  )
}
export default CardContentConfirmation
