import React from 'react'
import {rem} from 'polished'
import styled, {keyframes} from 'styled-components'
import {Button, Input, Text} from '@sf/design-system'
import {useTranslation} from 'react-i18next'

interface CardContentUserInfoProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  setFirstName: Function
  setLastName: Function
  isLoading: boolean
  firstName: string
  lastName: string
}
const SlideUpKf = keyframes`
  from { opacity: 0.25; }
  to { opacity: 1; }
`
const CardContentUserInfoContainer = styled.form`
  display: flex;
  flex-direction: column;
  padding: ${({theme}) => theme.spacing[3]};
  animation: ${SlideUpKf} 0.3s;

  > * {
    &:nth-child(1) {
      margin-bottom: ${rem(6)};
    }

    &:nth-child(3) {
      margin-bottom: ${rem(6)};
    }

    &:nth-child(even) {
      margin-bottom: ${rem(24)};
    }
  }
`

const CardContentUserInfo: React.FC<CardContentUserInfoProps> = props => {
  const {t} = useTranslation()

  return (
    <CardContentUserInfoContainer onSubmit={props.handleSubmit}>
      <Text
        scale='caption'
        colorName='carbon'
        colorWeight='light'
        weight='bold'
        style={{
          opacity: 0.8,
        }}
      >
        {t('name')}
      </Text>
      <Input
        type='text'
        name='firstName'
        placeholder=''
        onChange={e => props.setFirstName(e.target.value)}
      />
      <Text
        scale='caption'
        colorName='carbon'
        colorWeight='light'
        weight='bold'
        style={{
          opacity: 0.8,
        }}
      >
        {t('last_name')}
      </Text>
      <Input
        type='text'
        name='lastName'
        placeholder=''
        onChange={e => props.setLastName(e.target.value)}
      />
      <Button
        size='large'
        type='submit'
        isLoading={props.isLoading}
        disabled={
          props.firstName.trim().length === 0 ||
          props.lastName.trim().length === 0 ||
          props.firstName.length > 50 ||
          props.lastName.length > 50
        }
      >
        {t('confirm')}
      </Button>
    </CardContentUserInfoContainer>
  )
}
export default CardContentUserInfo
