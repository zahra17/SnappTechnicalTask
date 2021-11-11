import React, {useRef, useState} from 'react'
import styled from 'styled-components'
import {
  Text,
  Modal,
  FlexBox,
  Button,
  Input,
  fontStyles,
} from '@sf/design-system'
import {rem} from 'polished'
import {useForm} from 'react-hook-form'
import {logout} from '@slices/core'
import {useAppDispatch} from '@redux'
import requests from '~search/endpoints'
import {isAPIResponse, isAPIError, apiSecurity} from '@api'
import {useTranslation} from 'react-i18next'
import {ModalHeader} from '@components/ModalTools'

import {useToast} from '@contexts/Toast'
import {Token} from 'src/api/APISecurity/api-types'
interface PasswordFormProps {
  isOpen: boolean
  closeModal: () => void
}
interface IFormInput {
  password: string
  password_repeat: string
  oldPassword: string
}
const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  padding: ${rem(24)};

  > label {
    ${fontStyles({
      scale: 'caption',
      weight: 'bold',
      lh: 'default',
    })}
    color: var(--sf-carbon-light)
  }
`
const InputHolder = styled(FlexBox)`
  margin-bottom: ${rem(46)};
`
const StyledLabel = styled(Text)`
  margin-bottom: ${rem(6)};
  color: ${({theme}) => theme.carbon.light};
`
const StyledError = styled(Text)`
  margin: ${rem(6)} 0;
  color: ${({theme}) => theme.alert.main};

  p {
    margin: 0;
  }
`
const PasswordForm: React.FC<PasswordFormProps> = props => {
  const {isOpen, closeModal = () => {}} = props
  const {t} = useTranslation()
  const {showToast} = useToast()
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: {errors},
  } = useForm<IFormInput>()
  const password = useRef({})
  password.current = watch('password', '')
  const dispatch = useAppDispatch()

  const onSubmit = (data: IFormInput) => {
    const formData = {oldPassword: data.oldPassword, password: data.password}
    const response = requests
      .changePassword<{
        status: boolean
        oauth2_token: Token
        error: {code: number; message: string}
      }>({
        data: {
          oldPassword: data.oldPassword,
          password: data.password,
        },
      })
      .then(res => {
        if (isAPIResponse(res)) {
          if (res.data.status) {
            closeModal()
            showToast({
              status: 'success',
              right: 80,
              message: t('user_profile.change_password_success'),
            })

            apiSecurity.tokens = res.data.oauth2_token
            dispatch(logout({}))
          } else {
            throw res.data.error.message
          }
        }
      })
      .catch(message => {
        setError('oldPassword', {
          type: 'server',
          message,
        })
      })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      animation='slideUp'
      style={{minWidth: '480px'}}
      backdropColor='var(--modal-backdrop)'
    >
      <ModalHeader title={t('change_password')} onClose={closeModal} />

      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <InputHolder direction='column'>
          <StyledLabel scale='caption' weight='bold'>
            {t('user_profile.current_password')}
          </StyledLabel>
          <Input
            type='password'
            placeholder=''
            {...register('oldPassword', {
              required: String(t('user_profile.password_required')),
            })}
          />

          <StyledError scale='caption'>
            {errors.oldPassword && <p>{errors.oldPassword.message}</p>}
          </StyledError>
        </InputHolder>

        <InputHolder direction='column'>
          <StyledLabel scale='caption' weight='bold'>
            {t('new_password')}
          </StyledLabel>
          <Input
            type='password'
            placeholder=''
            {...register('password', {
              required: String(t('user_profile.password_required')),
              minLength: {
                value: 6,
                message: String(t('password_hint')),
              },
            })}
          />

          <StyledError scale='caption'>
            {errors.password && <p>{errors.password.message}</p>}
          </StyledError>
        </InputHolder>
        <InputHolder direction='column'>
          <StyledLabel scale='caption' weight='bold'>
            {t('new_password_confirm')}
          </StyledLabel>
          <Input
            type='password'
            placeholder=''
            {...register('password_repeat', {
              required: String(t('user_profile.password_required')),
              validate: value =>
                value === password.current ||
                String(t('passwords_did_not_match')),
            })}
          />

          <StyledError scale='caption'>
            {errors.password_repeat && <p>{errors.password_repeat.message}</p>}
          </StyledError>
        </InputHolder>
        <Button
          appearance='solid'
          colorName='accent'
          type='submit'
          onClick={handleSubmit(onSubmit)}
        >
          {t('change_password')}
        </Button>
      </StyledForm>
    </Modal>
  )
}

export default React.memo(PasswordForm)
