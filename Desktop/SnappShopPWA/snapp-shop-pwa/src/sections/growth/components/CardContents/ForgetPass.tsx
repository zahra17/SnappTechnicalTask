import React from 'react'
import {rem} from 'polished'
import styled from 'styled-components'
import {Button, ExclamationIcon, Input, Text} from '@sf/design-system'
import {useTranslation} from 'react-i18next'
import {keyframes, StyledComponent, DefaultTheme} from 'styled-components'
import {useSetTimer} from '@hooks/useSetTimer'
import {secondsToTime} from '@utils'
import STATES from '../../constants'

interface ForgetPassProps {
  ErrorContainer: StyledComponent<'div', DefaultTheme, {}, never>
  LinkTo: any
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  hasError: boolean
  isLoading: boolean
  mobile: string
  setForgetConfirmation: Function
  resendConfirmationCode: Function
  forgetConfirmation: string
}
const SlideUpKf = keyframes`
  from { opacity: 0.25; }
  to { opacity: 1; }
`
const CardContentForgerPassContainer = styled.form`
  display: flex;
  flex-direction: column;
  padding: ${({theme}) => theme.spacing[3]};
  animation: ${SlideUpKf} 0.3s;

  > * {
    &:nth-child(2) {
      margin: ${rem(24)} 0 ${rem(6)} 0;
    }

    &:nth-child(4) {
      margin: ${rem(6)} 0 ${rem(8)} 0;
    }

    &:nth-last-child(2) {
      margin: ${rem(14)} auto ${rem(30)} auto;
    }
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  /* Firefox */
  input[type='number'] {
    -moz-appearance: textfield;
  }
`
const RemainedContainer = styled.div`
  > {
    &:first-child {
      min-width: ${({theme}) => theme.spacing[5]};
    }
  }
`

const ForgetPass: React.FC<ForgetPassProps> = props => {
  const [remainedTime, setRemainedTime] = useSetTimer(60 + 59)
  const {t} = useTranslation()

  return (
    <CardContentForgerPassContainer onSubmit={props.handleSubmit}>
      <Text scale='large'>
        {t('change_pass_code_1')}{' '}
        <Text as='span' scale='large' weight='bold' numeric={false}>
          {props.mobile}
        </Text>{' '}
        {t('change_pass_code_2')}
      </Text>
      <Input
        type='number'
        name='forgetConfirmation'
        placeholder=''
        err={props.hasError}
        onChange={e => props.setForgetConfirmation(e.target.value)}
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
            props.resendConfirmationCode(STATES.FORGET_PASS)
          }}
        >
          {t('resend')}
        </props.LinkTo>
      ) : (
        <div style={{height: '20px'}} />
      )}
      <Button
        size='large'
        type='submit'
        isLoading={props.isLoading}
        disabled={props.forgetConfirmation.length != 5}
      >
        {t('confirm_continue')}
      </Button>
    </CardContentForgerPassContainer>
  )
}
export default ForgetPass
