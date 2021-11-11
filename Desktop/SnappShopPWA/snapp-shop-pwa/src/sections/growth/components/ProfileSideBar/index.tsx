import React, {ReactText, useEffect, useRef, useState} from 'react'
import {useAppDispatch} from '@redux'
import {useSelector} from 'react-redux'
import {rem} from 'polished'
import styled from 'styled-components'
import {useTranslation} from 'react-i18next'
import {FlexBox, Text, ChevronLeftIcon} from '@sf/design-system'
import Link from 'next/link'

import {logout, selectLoading, selectUser} from '@slices/core'
import {User} from '@schema/user'

const Container = styled(FlexBox)`
  width: 100%;
  background-color: ${({theme}) => theme.surface.light};
  border: 1px solid ${({theme}) => theme.carbon.alphaLight};
  border-radius: ${rem(12)};

  > div:first-child {
    display: flex;
    flex-direction: column;
    padding: ${rem(18)};

    p {
      margin-bottom: 4px;
    }
  }

  > * {
    border-bottom: 1px solid ${({theme}) => theme.carbon.alphaLight};

    &:last-child {
      border-bottom: 0;
    }
  }
`

const Row = styled(FlexBox)`
  padding: ${rem(22)} ${rem(16)};
  cursor: pointer;
`

const ProfileSideBar: React.FC = ({...props}) => {
  const {t} = useTranslation()
  const dispatch = useAppDispatch()
  const user: User | null = useSelector(selectUser)
  const cellphone: ReactText | undefined = user?.cellphone?.split(' ').join('')

  return (
    <Container direction='column'>
      <div>
        <Text scale='default' weight='bold'>
          {user?.firstname} {user?.lastname}
        </Text>
        <Text scale='caption' numeric={false}>
          {cellphone}
        </Text>
      </div>
      <Link href='/orders/list'>
        <Row direction='row' justify='space-between'>
          <Text scale='body'>{t('profile.side-bar.my-orders')}</Text>
          <ChevronLeftIcon fill='var(--sf-inactive-main)' />
        </Row>
      </Link>

      <Row
        direction='row'
        onClick={() => dispatch(logout({}))}
        justify='space-between'
      >
        <Text scale='body'>{t('profile.side-bar.logout')}</Text>
      </Row>
    </Container>
  )
}

export default ProfileSideBar
