import React, {useState} from 'react'
import styled from 'styled-components'
import {useTranslation} from 'react-i18next'
import {EditIcon, Text, FlexBox, Button} from '@sf/design-system'
import {rem} from 'polished'
import UserInfoForm from '~search/components/Profile/UserProfile/UserInfoForm'
import PasswordForm from '~search/components/Profile/UserProfile/PasswordForm'
import {useSelector} from 'react-redux'
import {User} from '@schema/user'
import {selectUser} from '@slices/core'

interface UserProfileProps {
  isActive?: boolean
  onClick?: (id: string) => void
}
const Section = styled(FlexBox)`
  padding: ${rem(14)};
`
const UserProfileSection = styled(FlexBox)`
  flex-grow: 1;
  box-sizing: border-box;
  margin-bottom: 1rem;
  padding: ${rem(16)};
`
const UserItem = styled(FlexBox)`
  margin-bottom: ${rem(14)};
  cursor: pointer;
`
const LabelText = styled(Text)`
  color: var(--sf-inactive-dark);
`
const ModalTrigger = styled(Button)`
  width: fit-content;
  margin-top: ${rem(20)};
  padding: 0 px;

  > svg {
    margin-left: ${rem(6)};
  }

  &:hover,
  &:focus,
  &:active {
    background-color: var(--white);
    border: transparent;
    outline: none;
  }
`
const Title = styled(FlexBox)`
  padding: ${rem(16)};
`
const ButtonHolder = styled(FlexBox)`
  padding: 0 ${rem(16)} ${rem(16)};
`
const userProfile: React.FC<UserProfileProps> = (props: UserProfileProps) => {
  const {t} = useTranslation()
  const {isActive, onClick = () => {}} = props
  const user: User | null = useSelector(selectUser)
  const [isOpenUserInfoModal, setisOpenUserInfoModal] = useState(false)
  const [isOpenPasswordModal, setisOpenPasswordModal] = useState(false)

  const onCloseUserInfoModal = () => {
    setisOpenUserInfoModal(!setisOpenUserInfoModal)
  }

  const onClosePasswordModal = () => {
    setisOpenPasswordModal(!setisOpenPasswordModal)
  }

  return (
    <>
      <Title justify='flex-start' alignItems='center'>
        <Text
          scale='default'
          weight='bold'
          colorName='carbon'
          colorWeight='light'
        >
          {t('user_profile.user_account')}
        </Text>
      </Title>
      <Section direction='row'>
        <UserProfileSection
          direction='column'
          alignItems='flex-start'
          justify='space-between'
        >
          <UserItem direction='row'>
            <LabelText scale='body' weight='normal'>
              {t('name')} و {t('last_name')}
            </LabelText>
          </UserItem>
          <Text
            scale='large'
            weight='bold'
            as='span'
          >{`${user?.firstname} ${user?.lastname}`}</Text>
        </UserProfileSection>
        <UserProfileSection direction='column'>
          <UserItem direction='row'>
            <LabelText scale='body' weight='normal'>
              {t('user_profile.email')}
            </LabelText>
          </UserItem>
          <Text scale='body' weight='bold' as='span'>
            {user?.email}
          </Text>
        </UserProfileSection>

        <UserInfoForm
          isOpen={isOpenUserInfoModal}
          closeModal={onCloseUserInfoModal}
        />
        <PasswordForm
          isOpen={isOpenPasswordModal}
          closeModal={onClosePasswordModal}
        />
      </Section>
      <ButtonHolder direction='column'>
        {/* user info Modal */}
        <ModalTrigger
          appearance='naked'
          colorName='accent2'
          block={false}
          onClick={() => setisOpenUserInfoModal(!isOpenUserInfoModal)}
        >
          <EditIcon
            fill='var(--sf-accent2-main)'
            width='13px'
            height='13px'
            style={{marginRight: '0.6rem'}}
          />
          {t('user_profile.change_user_info')}
        </ModalTrigger>

        {/* change pass Modal */}
        <ModalTrigger
          appearance='naked'
          colorName='accent2'
          block={false}
          onClick={() => setisOpenPasswordModal(!isOpenPasswordModal)}
        >
          <EditIcon
            fill='var(--sf-accent2-main)'
            width='13px'
            height='13px'
            style={{marginRight: '0.6rem'}}
          />
          {t('change_password')}
        </ModalTrigger>
      </ButtonHolder>
    </>
  )
}

export default userProfile
