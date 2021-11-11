import React, {FocusEventHandler} from 'react'
import {rem} from 'polished'
import styled from 'styled-components'
import {Button, ExclamationIcon, Input, Text} from '@sf/design-system'
import {keyframes, StyledComponent, DefaultTheme} from 'styled-components'
import {useTranslation} from 'react-i18next'
import STATES from '../../constants'
import {useRudderStack} from '@contexts/RudderStack'
import {eventTypes} from '@schema/rudderStack'

interface CardContentLoginPassProps {
  ErrorContainer: StyledComponent<'div', DefaultTheme, {}, never>
  LinkTo: any
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  hasError: boolean
  isLoading: boolean
  setPassword: Function
  setState: Function
  handleSubmitForgetPass: Function
  password: string
  onFocusHandler: FocusEventHandler<HTMLElement>
}
const SlideUpKf = keyframes`
  from { opacity: 0.25; }
  to { opacity: 1; }
`

const CardContentLoginPassContainer = styled.form`
  display: flex;
  flex-direction: column;
  padding: ${({theme}) => theme.spacing[3]};
  animation: ${SlideUpKf} 0.3s;

  > * {
    &:nth-child(2) {
      margin-top: ${rem(6)};
    }

    &:nth-child(3) {
      margin: ${rem(6)} 0 ${rem(8)} 0;
    }

    &:nth-last-child(2) {
      margin: ${rem(28)} auto ${rem(30)} 0;
    }
  }
`
const CardContentLoginPass: React.FC<CardContentLoginPassProps> = props => {
  const {t} = useTranslation()
  const rudderStack = useRudderStack()
  const onForgetPasswordTextClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    props.setState(STATES.FORGET_PASS)
    props.handleSubmitForgetPass(e)
    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: 'Login forgot password',
    })
  }
  return (
    <CardContentLoginPassContainer onSubmit={props.handleSubmit}>
      <Text
        scale='caption'
        colorName='carbon'
        colorWeight='light'
        weight='bold'
        style={{
          opacity: 0.8,
        }}
      >
        {t('password')}
      </Text>

      <Input
        type='password'
        name='password'
        placeholder={t('password_placeholder')}
        err={props.hasError}
        onFocus={props.onFocusHandler}
        onChange={e => props.setPassword(e.target.value)}
        autoFocus
      />

      {props.hasError ? (
        <props.ErrorContainer>
          <ExclamationIcon width={16} height={16} />
          <Text scale='caption' colorName='alert' colorWeight='main'>
            {t('wrong_password')}
          </Text>
        </props.ErrorContainer>
      ) : (
        <div style={{height: 16}} />
      )}
      <props.LinkTo
        style={{textAlign: 'left'}}
        onClick={onForgetPasswordTextClick}
      >
        {t('forget_password')}
      </props.LinkTo>
      <Button
        size='large'
        isLoading={props.isLoading}
        disabled={props.password.length == 0}
      >
        {t('login')}
      </Button>
    </CardContentLoginPassContainer>
  )
}
export default CardContentLoginPass
