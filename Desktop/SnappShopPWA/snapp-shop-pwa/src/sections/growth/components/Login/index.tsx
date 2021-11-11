import React, {useEffect, useRef, useState} from 'react'
import {useSelector} from 'react-redux'
import {useAppDispatch} from '@redux'
import {rem} from 'polished'
import styled from 'styled-components'
import Navbar from '@components/Navbar'
import {ChevronRightIcon, CloseIcon, Text} from '@sf/design-system'
import requests from '../../endpoints'
import {isAPIResponse} from '@api'
import {useTranslation} from 'react-i18next'
import CardContentLoginSignup from '../CardContents/LoginSignup'
import CardContentSignUpOtp from '../CardContents/SignUpOtp'
import CardContentConfirmation from '../CardContents/Confirmation'
import CardContentLoginPass from '../CardContents/LoginPass'
import ForgetPass from '../CardContents/ForgetPass'
import CardContentNewPass from '../CardContents/NewPass'
import CardContentUserInfo from '../CardContents/UserInfo'
import STATES from '../../constants'
import {setUser} from '@slices/core'
import {User} from '@schema/user'
import {selectUser} from '@slices/core'
import {setActive as setActiveAction} from '~growth/redux/location'
import {Modes} from '@schema/location'
import {getPendingOrders} from '~order/redux/pendingOrders'
import {useRudderStack} from '@contexts/RudderStack'
import {eventTypes} from '@schema/rudderStack'

interface TextProps {
  closeModal: Function
  state?: string
}
function handleCardTitle(state: string) {
  const {t} = useTranslation()
  switch (state) {
    case STATES.LOGIN_SIGNUP:
    case STATES.LOGIN_CAPTCHA:
      return t('login_signup')
    case STATES.SIGNUP_OTP:
    case STATES.CONFIRMATION:
      return t('confirmation')
    case STATES.LOGIN_PASS:
      return t('login_pass')
    case STATES.FORGET_PASS:
      return t('forget_pass')
    case STATES.NEW_PASS:
      return t('new_pass')
    case STATES.USER_INFO:
      return t('user_info')
    default:
      return t('login_signup')
  }
}
const LinkTo = styled(Text).attrs({
  scale: 'body',
  colorName: 'accent2',
  weight: 'bold',
  as: 'span',
})`
  cursor: pointer;
`
const ErrorContainer = styled.div`
  display: flex;
  align-items: center;

  > * {
    &:first-child {
      position: relative;
      bottom: 1px;
      margin-left: ${rem(9)};
      fill: ${({theme}) => theme.alert.main};
    }
  }
`
const CardContainer = styled.div<TextProps>`
  display: flex;
  flex-direction: column;
  width: ${rem(480)};
  margin: 0;
  background: ${({theme}) => theme.surface.light};
  border-radius: ${rem(16)};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 8px 32px rgba(0, 0, 0, 0.16);

  ${({state}) =>
    state === STATES.LOGIN_PASS &&
    `
    > * {
    &:nth-child(1) {
      position: absolute;
      left: 0;
      margin: ${rem(18)} 0 0 ${rem(24)};
    }
  }
`};
`

const LoginCard: React.FC<TextProps> = (props: TextProps) => {
  const {t} = useTranslation()

  const [state, setState] = useState(STATES.LOGIN_SIGNUP)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mobile, setMobile] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [password, setPassword] = useState('')
  const [forgetConfirmation, setForgetConfirmation] = useState('')
  //const [newPassword, setNewPassword] = useState('')
  const newPassword = useRef<HTMLInputElement>(null)
  //const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const confirmNewPassword = useRef<HTMLInputElement>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const user = useSelector(selectUser)
  const dispatch = useAppDispatch()

  // remove error when state changes
  useEffect(() => {
    setHasError(false)
  }, [state])

  // select first address for user when logged in
  useEffect(() => {
    if (user && user.addresses.length) {
      dispatch(
        setActiveAction({
          id: user.addresses[0].id,
          latitude: user.addresses[0].latitude,
          longitude: user.addresses[0].longitude,
          mode: Modes.Address,
        })
      )
      dispatch(getPendingOrders({}))
    }
  }, [user])
  const rudderStack = useRudderStack()
  useEffect(() => {
    if (!user) return
    rudderStack.eventTrigger({
      type: eventTypes.identify,
      eventName: user.id,
      payload: {
        cellphone: user.cellphone,
        email: user.email,
        active_address_id: user.addresses[0]?.id,
        latitude: user.addresses[0]?.latitude,
        longitude: user.addresses[0]?.longitude,
      },
    })
  }, [user, rudderStack])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    //TODO: add form validation for mobile
    if (state === STATES.LOGIN_SIGNUP) {
      const response = await requests.loginMobileWithNoPass<{data: any}>({
        data: {cellphone: mobile},
      })
      if (isAPIResponse(response)) {
        setIsLoading(false)
        const {isRegistered, hasPassword} = response.data.data.result
        if (!response.status) {
          // TODO: handle when server failed to answer

          // TODO: trigger rudder stack event for Login phone step error
          rudderStack.eventTrigger({
            type: eventTypes.track,
            eventName: 'Login phone step error',
            payload: {
              entered_characters: mobile,
              error_message: response.data.data?.result?.message,
            },
          })
        } else if (hasError) {
          //TODO: handle error in validation in client side

          // TODO: trigger rudder stack event for Login phone step error
          rudderStack.eventTrigger({
            type: eventTypes.track,
            eventName: 'Login phone step error',
            payload: {
              entered_characters: mobile,
              error_message: response.data.data?.result?.message,
            },
          })
        } else {
          //handle three mode when user try to signup/login
          if (isRegistered && hasPassword) {
            setState(STATES.LOGIN_PASS)
          } else if (isRegistered && !hasPassword) {
            setState(STATES.CONFIRMATION)
          } else {
            setState(STATES.SIGNUP_OTP)
          }

          // TODO: trigger rudder stack event for Login Phone Submit
          rudderStack.eventTrigger({
            type: eventTypes.track,
            eventName: 'Login Phone submit',
          })
        }
      }
      // always set timer restart when nex step button clicked
    } else if (state === STATES.SIGNUP_OTP) {
      setHasError(false)
      const response = await requests.loginMobileWithToken<{status: boolean}>({
        data: {cellphone: mobile, code: confirmation},
      })
      if (isAPIResponse(response)) {
        setIsLoading(false)
        const {status} = response.data
        if (!status) {
          setHasError(true)
          // TODO: handle when server failed to answer
        } else if (hasError) {
          //TODO: handle error in validation in client side
        } else {
          setState(STATES.USER_INFO)
        }
      }
    } else if (state === STATES.LOGIN_PASS) {
      setHasError(false)
      const response = await requests.loginMobileWithPass<{
        data: {user: User}
        status: boolean
      }>({
        data: {cellphone: mobile, pass: password},
      })
      if (isAPIResponse(response)) {
        setIsLoading(false)
        const {status} = response.data
        if (!status) {
          setHasError(true)
          rudderStack.eventTrigger({
            type: eventTypes.track,
            eventName: 'Login password step error',
            payload: {
              error_message: Object(response).data.error.message,
            },
          })
          // TODO: handle when server failed to answer
        } else {
          dispatch(setUser(response.data.data.user))
          //DONE login with password
          props.closeModal()
        }
      }
    } else if (state === STATES.CONFIRMATION) {
      setHasError(false)
      const response = await requests.loginMobileWithToken<{
        data: {user: User}
        status: boolean
      }>({
        data: {cellphone: mobile, code: confirmation},
      })
      if (isAPIResponse(response)) {
        setIsLoading(false)
        const {status} = response.data
        if (!status) {
          setHasError(true)
          // TODO: handle when server failed to answer
          rudderStack.eventTrigger({
            type: eventTypes.track,
            eventName: 'Login OTP Submit error',
            payload: {
              error_message: Object(response).data.error.message,
            },
          })
        } else {
          //DONE otp sent
          dispatch(setUser(response.data.data.user))
          props.closeModal()
          rudderStack.eventTrigger({
            type: eventTypes.track,
            eventName: 'Login OTP Submit',
          })
        }
      }
    } else if (state === STATES.FORGET_PASS) {
      setHasError(false)
      // handled in handleSubmitForgetPass
      const response = await requests.forgetPassword<{
        data: any
      }>({
        data: {input: mobile, type: 'verify', code: forgetConfirmation},
      })
      if (isAPIResponse(response)) {
        setIsLoading(false)
        const {result} = response.data.data
        // result === 2 wrong code
        if (result === 2) {
          console.log('====> Err set', result)
          setHasError(true)
          // TODO: handle when server failed to answer
        } else {
          setHasError(false)
          setState(STATES.NEW_PASS)
        }
      }
    } else if (state === STATES.NEW_PASS) {
      setHasError(false)
      if (newPassword.current?.value === confirmNewPassword.current?.value) {
        const response = await requests.forgetPassword<{
          data: {user: User}
          status: boolean
        }>({
          data: {
            input: mobile,
            type: 'reset',
            new_password: newPassword.current?.value,
            confirm: confirmNewPassword.current?.value,
          },
        })
        if (isAPIResponse(response)) {
          setIsLoading(false)
          const {status} = response.data
          if (!status) {
            setHasError(true)
            // TODO: handle when server failed to answer
          } else {
            //DONE reset password
            dispatch(setUser(response.data.data.user))
            props.closeModal(true)
          }
        }
      } else {
        setIsLoading(false)
        setHasError(true)
      }
    } else if (state === STATES.USER_INFO) {
      setHasError(false)
      const response = await requests.registerWithOptionalPass<{
        data: {user: User}
      }>({
        data: {
          code: confirmation,
          cellphone: mobile,
          firstname: firstName,
          lastname: lastName,
        },
      })
      if (isAPIResponse(response)) {
        setIsLoading(false)
        //DONE user signup name and last name submitted
        dispatch(setUser(response.data.data.user))
        props.closeModal()
      }
    }
  }
  async function handleSubmitForgetPass(
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
  ) {
    e.preventDefault()
    const response = await requests.forgetPassword<{
      status: boolean
    }>({
      data: {input: mobile, type: 'sms'},
    })
    if (isAPIResponse(response)) {
      setIsLoading(false)
      const {status} = response.data
      if (!status) {
        setHasError(true)
        // TODO: handle when server failed to answer
      } else {
        //DONE forgetPass OTP sent
      }
    }
  }
  async function resendConfirmationCode(state: string) {
    setHasError(false)
    let response
    if (state === STATES.FORGET_PASS) {
      response = await requests.forgetPassword<{
        data: unknown
      }>({
        data: {input: mobile, type: 'sms'},
      })
    } else if (state === STATES.SIGNUP_OTP) {
      response = await requests.loginMobileWithNoPass<{
        data: unknown
      }>({
        data: {cellphone: mobile},
      })
    } else {
      response = await requests.loginMobileWithNoPass<{
        data: unknown
      }>({
        data: {cellphone: mobile, optionalLoginToken: true},
      })
    }
    if (isAPIResponse(response)) {
      setIsLoading(false)
    }
  }
  async function loginUserWithOTP() {
    const response = await requests.loginMobileWithNoPass<{
      data: unknown
    }>({
      data: {cellphone: mobile, optionalLoginToken: true},
    })
    if (isAPIResponse(response)) {
      setIsLoading(false)
      setState(STATES.CONFIRMATION)
      rudderStack.eventTrigger({
        type: eventTypes.track,
        eventName: 'Login with OTP',
      })
    }
  }

  const onBackToFirstIconClicked = () => {
    setState(STATES.LOGIN_SIGNUP)
    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: 'Login back to first step',
    })
  }

  const onLoginPassFocus = () => {
    setHasError(false)
  }
  return (
    <CardContainer {...props} state={state}>
      {state === STATES.LOGIN_PASS && (
        <LinkTo
          scale='body'
          colorName='accent2'
          weight='bold'
          onClick={loginUserWithOTP}
        >
          {t('login_otp')}
        </LinkTo>
      )}
      {state === STATES.FORGET_PASS || state === STATES.NEW_PASS ? (
        <Navbar
          navMode='center'
          icon={state === STATES.FORGET_PASS ? ChevronRightIcon : CloseIcon}
          title={handleCardTitle(state)}
          handleIconClick={
            state === STATES.FORGET_PASS
              ? () => setState(STATES.LOGIN_PASS)
              : () => props.closeModal()
          }
        />
      ) : (
        <Navbar
          icon={state === STATES.LOGIN_SIGNUP ? CloseIcon : ChevronRightIcon}
          title={handleCardTitle(state)}
          logo={state === STATES.LOGIN_SIGNUP}
          handleIconClick={
            state === STATES.LOGIN_SIGNUP
              ? () => props.closeModal()
              : () => onBackToFirstIconClicked()
          }
        />
      )}
      {state === STATES.LOGIN_SIGNUP && (
        <CardContentLoginSignup
          ErrorContainer={ErrorContainer}
          handleSubmit={handleSubmit}
          setHasError={setHasError}
          hasError={hasError}
          setMobile={setMobile}
          mobile={mobile}
          isLoading={isLoading}
        />
      )}
      {state === STATES.SIGNUP_OTP && (
        <CardContentSignUpOtp
          ErrorContainer={ErrorContainer}
          LinkTo={LinkTo}
          handleSubmit={handleSubmit}
          hasError={hasError}
          setMobile={setMobile}
          setState={setState}
          setConfirmation={setConfirmation}
          mobile={mobile}
          isLoading={isLoading}
          resendConfirmationCode={resendConfirmationCode}
          confirmation={confirmation}
        />
      )}
      {state === STATES.CONFIRMATION && (
        <CardContentConfirmation
          ErrorContainer={ErrorContainer}
          LinkTo={LinkTo}
          handleSubmit={handleSubmit}
          hasError={hasError}
          setMobile={setMobile}
          setState={setState}
          setConfirmation={setConfirmation}
          mobile={mobile}
          isLoading={isLoading}
          resendConfirmationCode={resendConfirmationCode}
          confirmation={confirmation}
        />
      )}
      {state === STATES.LOGIN_PASS && (
        <CardContentLoginPass
          ErrorContainer={ErrorContainer}
          LinkTo={LinkTo}
          handleSubmit={handleSubmit}
          setPassword={setPassword}
          hasError={hasError}
          setState={setState}
          handleSubmitForgetPass={handleSubmitForgetPass}
          isLoading={isLoading}
          password={password}
          onFocusHandler={onLoginPassFocus}
        />
      )}
      {state === STATES.FORGET_PASS && (
        <ForgetPass
          ErrorContainer={ErrorContainer}
          LinkTo={LinkTo}
          handleSubmit={handleSubmit}
          hasError={hasError}
          isLoading={isLoading}
          mobile={mobile}
          setForgetConfirmation={setForgetConfirmation}
          resendConfirmationCode={resendConfirmationCode}
          forgetConfirmation={forgetConfirmation}
        />
      )}
      {state === STATES.NEW_PASS && (
        <CardContentNewPass
          handleSubmit={handleSubmit}
          hasError={hasError}
          // setNewPassword={setNewPassword}
          // setConfirmNewPassword={setConfirmNewPassword}
          ErrorContainer={ErrorContainer}
          isLoading={isLoading}
          confirmNewPassword={confirmNewPassword}
          newPassword={newPassword}
        />
      )}
      {state === STATES.USER_INFO && (
        <CardContentUserInfo
          handleSubmit={handleSubmit}
          setFirstName={setFirstName}
          setLastName={setLastName}
          isLoading={isLoading}
          firstName={firstName}
          lastName={lastName}
        />
      )}
    </CardContainer>
  )
}
export default LoginCard
