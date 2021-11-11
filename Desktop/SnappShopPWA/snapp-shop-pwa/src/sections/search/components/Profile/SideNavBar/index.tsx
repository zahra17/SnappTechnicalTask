import React from 'react'
import styled from 'styled-components'
import {SimplePageComponent} from '@root/types'
import {rem} from 'polished'
import {FlexBox, Text, EditIcon, ChevronLeftIcon} from '@sf/design-system'
import {useTranslation} from 'react-i18next'
import {logout, selectUser} from '@slices/core'
import {useSelector} from 'react-redux'
import {User} from '@schema/user'
import {useAppDispatch} from '@redux'
import {useRouter} from 'next/router'

interface SideNavBarProps {
  step: number
}

export enum PROFILE_STATES {
  DEFAULT = 1,
  ORDERS = 2,
  TRANSACTIONS = 3,
}
const SideNav = styled(FlexBox).attrs({as: 'nav'})`
  background-color: ${({theme}) => theme.surface.light};
  border: ${rem(1)} solid ${({theme}) => theme.carbon.alphaLight};
  border-radius: ${rem(12)};
  box-shadow: ${({theme}) => theme.shadows.medium};

  > * {
    padding: ${rem(22)} ${rem(16)};
    text-align: right;

    &:not(:last-child) {
      border-bottom: ${rem(1)} solid ${({theme}) => theme.carbon.alphaLight};
    }
  }
`

const NavItem = styled(FlexBox)`
  cursor: pointer;

  &:first-child {
    padding: ${rem(20)} ${rem(16)};

    > svg {
      transform: translatey(calc(50% + 3px));
    }
  }
`
const SmallText = styled(Text)`
  flex: 100%;
`
const Sides = styled.div`
  position: sticky;
  top: ${rem(90)};
`

const SideNavBar: React.FC<
  SideNavBarProps & React.HTMLAttributes<HTMLDivElement>
> = ({step}) => {
  const {t} = useTranslation()
  const user: User | null = useSelector(selectUser)
  const dispatch = useAppDispatch()
  const router = useRouter()
  return (
    <Sides>
      <SideNav direction='column' justify-content='space-between'>
        <NavItem
          direction='row'
          alignItems='center'
          justify='space-between'
          wrap='wrap'
          onClick={() => {
            router.push('/profile')
          }}
        >
          <Text scale='large' weight='bold' as='span'>
            {`${user?.firstname} ${user?.lastname}`}
          </Text>

          {step == PROFILE_STATES.DEFAULT && (
            <ChevronLeftIcon
              fill='var(--sf-carbon-alphaHigh)'
              width='12'
              height='13'
            />
          )}
          <SmallText
            scale='body'
            as='span'
            align='right'
            numeric={false}
            style={{direction: 'ltr'}}
          >
            {user?.cellphone}
          </SmallText>
        </NavItem>

        <NavItem
          alignItems='center'
          justify='space-between'
          onClick={() => {
            router.push('/profile/orders')
          }}
        >
          <Text scale='body' as='span'>
            {t('user_profile.my_orders')}
          </Text>
          {step == PROFILE_STATES.ORDERS && (
            <ChevronLeftIcon
              fill='var(--sf-carbon-alphaHigh)'
              width='12'
              height='13'
            />
          )}
        </NavItem>

        <NavItem
          alignItems='center'
          justify='space-between'
          onClick={() => {
            router.push('/profile/transactions')
          }}
        >
          <Text scale='body' as='span'>
            {t('user_profile.transactions_list')}
          </Text>
          {step == PROFILE_STATES.TRANSACTIONS && (
            <ChevronLeftIcon
              fill='var(--sf-carbon-alphaHigh)'
              width='12'
              height='13'
            />
          )}
        </NavItem>

        <NavItem onClick={() => dispatch(logout({}))}>
          <Text scale='body' as='span'>
            {t('logout')}
          </Text>
        </NavItem>
      </SideNav>
    </Sides>
  )
}

export default SideNavBar
