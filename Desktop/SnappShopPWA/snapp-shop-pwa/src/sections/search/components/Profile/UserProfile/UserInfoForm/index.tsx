import React from 'react'
import styled from 'styled-components'
import {
  Text,
  Modal,
  Button,
  fontStyles,
  Input,
  FlexBox,
} from '@sf/design-system'
import {useAppDispatch} from '@redux'
import {rem} from 'polished'
import {useForm} from 'react-hook-form'
import {useTranslation} from 'react-i18next'
import {ModalHeader} from '@components/ModalTools'
import requests from '~search/endpoints'
import {EditUserResponse} from '~search/types/profile'
import {User} from '@schema/user'
import {isAPIResponse} from '@api'
import {selectUser, setUser} from '@slices/core'
import {useSelector} from 'react-redux'
import {useToast} from '@contexts/Toast'
import {emailMatcher} from '@utils'
interface UserInfoFormProps {
  isOpen: boolean
  closeModal: () => void
}
interface IFormInput {
  firstname: string
  lastname: string
  email: string
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
const StyledModalHeader = styled(ModalHeader)``

const InputHolder = styled(FlexBox)`
  margin-bottom: ${rem(24)};
`

const StyledLabel = styled(Text)`
  margin-bottom: ${rem(6)};
  color: ${({theme}) => theme.carbon.light};
`
const StyledError = styled(Text)`
  color: ${({theme}) => theme.alert.main};
`
//UserInfoForm//
const UserInfoForm: React.FC<UserInfoFormProps> = (
  props: UserInfoFormProps
) => {
  const {isOpen, closeModal = () => {}} = props
  const user: User | null = useSelector(selectUser)
  const dispatch = useAppDispatch()
  const {t} = useTranslation()
  const {showToast} = useToast()

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<IFormInput>()

  const onSubmit = (data: IFormInput) => {
    const formData = new FormData()
    formData.set('firstname', data.firstname)
    formData.set('lastname', data.lastname)
    formData.set('email', data.email)

    if (user?.cellphone) formData.set('cellphone', user?.cellphone)
    const response = requests
      .editUser<EditUserResponse>({
        data: formData,
        transformRequest: data => data,
      })

      .then(res => {
        if (isAPIResponse(res)) {
          dispatch(setUser(res.data.data.user))
          closeModal()
          showToast({
            status: 'success',
            right: 80,
            message: t('user_profile.change_user_info_success'),
          })
        }
      })
      .catch(() => {})
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      animation='slideUp'
      style={{minWidth: '480px'}}
      backdropColor='var(--modal-backdrop)'
    >
      <StyledModalHeader
        title={t('user_profile.name_lastname_edit')}
        onClose={closeModal}
      />

      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <InputHolder direction='column'>
          <StyledLabel scale='caption' weight='bold'>
            {t('name')}
          </StyledLabel>
          <Input
            placeholder=''
            defaultValue={user?.firstname}
            {...register('firstname', {
              required: String(t('user_profile.name_required')),
              maxLength: {
                value: 20,
                message: String(t('user_profile.name_maximum')),
              },
            })}
          />

          <StyledError scale='caption'>
            {errors.firstname && <p>{errors.firstname.message}</p>}
          </StyledError>
        </InputHolder>

        <InputHolder direction='column'>
          <StyledLabel scale='caption' weight='bold'>
            {t('last_name')}
          </StyledLabel>
          <Input
            placeholder=''
            defaultValue={user?.lastname}
            {...register('lastname', {
              required: String(t('user_profile.lastname_required')),
              maxLength: {
                value: 20,
                message: String(t('user_profile.lastname_maximum')),
              },
            })}
          />

          <StyledError scale='caption'>
            {errors.lastname && <p>{errors.lastname.message}</p>}
          </StyledError>
        </InputHolder>

        <InputHolder direction='column'>
          <StyledLabel scale='caption' weight='bold'>
            {t('user_profile.email')}
          </StyledLabel>
          <Input
            placeholder=''
            defaultValue={user?.email}
            {...register('email', {
              required: String(t('user_profile.email_required')),
              pattern: {
                value: emailMatcher,
                message: String(t('user_profile.email_correction')),
              },
            })}
          />

          <StyledError scale='caption'>
            {errors.email && <p>{errors.email.message}</p>}
          </StyledError>
        </InputHolder>

        <Button type='submit'>{t('user_profile.cahnge_submit')} </Button>
      </StyledForm>
    </Modal>
  )
}

export default React.memo(UserInfoForm)
