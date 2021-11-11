import React, {useEffect, useRef, useState} from 'react'
import Link from 'next/link'
import {useAppDispatch} from '@redux'
import {useSelector} from 'react-redux'
import {rem} from 'polished'
import styled from 'styled-components'
import {useTranslation} from 'react-i18next'
import {useQueryParams, BooleanParam, StringParam} from 'use-query-params'
import {Orders} from '~order/components/Orders'
import {
  Text,
  UserIcon,
  FlexBox,
  Button,
  Modal,
  Card,
  LogoutIcon,
  Price,
  WalletIcon,
} from '@sf/design-system'
import {logout, selectLoading, selectUser} from '@slices/core'
import {User} from '@schema/user'
import LoginCard from '~growth/components/Login'
import {useRouter} from 'next/router'
import {useRudderStack} from '@contexts/RudderStack'
import {eventTypes} from '@schema/rudderStack'
import useCredit from '~order/hooks/useCredit'
import WalletCharge from '~order/components/WalletCharge'

const Profile = styled(FlexBox)`
  > * {
    margin-left: ${rem(9)};

    &:first-child {
      padding: ${rem(16)};
      cursor: pointer;
    }

    &:last-child {
      margin-right: ${({theme}) => theme.spacing[2]};
    }
  }
`
const MoreContainer = styled.div`
  position: relative;
  width: 0;
  height: 0;
`
const More = styled(Card)`
  position: absolute;
  top: ${({theme}) => theme.spacing[3]};
  left: ${rem(-120)};
  width: ${rem(260)};
  min-height: ${({theme}) => theme.spacing[6]};
  padding: 0;

  > {
    Button {
      justify-content: flex-start;
      min-height: ${({theme}) => theme.spacing[6]};
      padding-right: ${({theme}) => theme.spacing[2]};
    }
  }
`
const MoreHeader = styled(FlexBox)`
  box-sizing: border-box;
  width: 100%;
  height: ${({theme}) => theme.spacing[8]};
  padding: ${rem(12)} ${({theme}) => theme.spacing[2]};

  /* UserIcon */
  > {
    &:first-child {
      margin-left: ${({theme}) => theme.spacing[2]};
    }

    &:last-child {
      > {
        /* link to profile */
        &:last-child {
          margin-top: ${rem(4)};
          cursor: pointer;
        }
      }
    }
  }
`
const UserInfoContainer = styled(FlexBox)`
  user-select: none;

  > * {
    margin-left: ${({theme}) => theme.spacing[1]};
  }
`
const ButtonItem = styled(Button).attrs({
  appearance: 'naked',
  colorName: 'carbon',
  type: 'button',
  size: 'large',
  block: true,
})`
  height: ${({theme}) => theme.spacing[7]};

  svg {
    margin-left: ${({theme}) => theme.spacing[1]};
  }

  > * {
    svg {
      margin-left: ${({theme}) => theme.spacing[2]};
    }
  }
`
const WalletButtonItem = styled(ButtonItem)`
  /* just until wallet-button is disabled ---> */
  background: initial;
  border: 0;
  /* just until wallet-button is disabled <--- */

  > * {
    width: 100%;
  }

  /* just until wallet-button is disabled ---> */
  /* &:hover,
  &:active,
  &:focus {
    background: initial;
    border: 0;
    cursor: initial;
  } */
  /* just until wallet-button is disabled <--- */
`

const ParamConfig = {
  login: BooleanParam,
  referrer: StringParam,
}

export const UserProfile = () => {
  const {t} = useTranslation()
  const router = useRouter()
  const [params, setParams] = useQueryParams(ParamConfig)
  const [showMore, setShowMore] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isWalletOpen, setIsWalletOpen] = useState(false)
  const user: User | null = useSelector(selectUser)
  const isLoading: boolean = useSelector(selectLoading)
  const dispatch = useAppDispatch()
  const showMoreModalRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const credit = useCredit()

  useEffect(() => {
    if (params.login) {
      if (user) setParams({login: false}, 'replaceIn')
      else setIsLoginOpen(true)
    }

    if (params.referrer && user) router.replace(params.referrer)
  }, [params, user])

  useEffect(() => {
    if (!isLoginOpen && params.login) setParams({login: false}, 'replaceIn')
  }, [isLoginOpen])

  // To hide ShowMore modal
  useEffect(() => {
    if (!isLoading) setShowMore(false)
  }, [isLoading])

  // To handle close modal with outside click
  useEffect(() => {
    if (showMore) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMore])

  const handleClickOutside = (e: Event) => {
    const target = e.target as Element
    const targetParent = target.parentNode as Element
    const targetParentParent = targetParent.parentNode as Element
    if (showMoreModalRef.current.contains(target)) {
      // inside click
      setTimeout(() => {
        setShowMore(false)
      }, 500)
    }
    // outside click not id=profile-button
    else if (
      target.id !== 'profile-button' &&
      targetParent.id !== 'profile-button' &&
      targetParentParent.id !== 'profile-button'
    ) {
      setShowMore(false)
    }
  }
  const rudderStack = useRudderStack()
  const onUserProfileClicked = () => {
    setShowMore(!showMore)
    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: 'Header Profile',
      payload: {},
    })
  }
  const onLogoutButtonClicked = (e: any) => {
    dispatch(logout({}))
    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: 'Header Profile Exit',
      payload: {},
    })
    e.stopPropagation()
  }

  const onLoginButtonClicked = (e: any) => {
    setIsLoginOpen(!isLoginOpen)
    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: 'Login Button',
    })
  }
  //get length of 'login_signup' string//
  const length = t('login_signup').split(' ').length
  return (
    <>
      <Profile alignItems='center'>
        {user ? (
          <>
            <UserInfoContainer
              id='profile-button'
              onClick={onUserProfileClicked}
            >
              <UserIcon />
            </UserInfoContainer>
            <MoreContainer>
              {showMore && (
                <More
                  alignItems='center'
                  ref={showMoreModalRef}
                  direction='column'
                  shadow='high'
                >
                  {/* HEADER ( first name - last name ) */}
                  <MoreHeader alignItems='center'>
                    <UserIcon />
                    <FlexBox direction='column'>
                      <Text scale='body' weight='bold'>
                        {`${user.firstname} ${user.lastname}`}
                      </Text>
                      <Link href={`/profile`}>
                        <Text scale='caption' colorName='accent2'>
                          {t('user_profile.visit_user_account')}
                        </Text>
                      </Link>
                    </FlexBox>
                  </MoreHeader>

                  {/* WALLET BUTTON */}
                  <WalletButtonItem onClick={() => setIsWalletOpen(true)}>
                    <FlexBox justify='space-between'>
                      <FlexBox>
                        <WalletIcon />
                        <Text scale='body'>{t('wallet')}</Text>
                      </FlexBox>

                      <Price value={credit} isZeroVisible />
                    </FlexBox>
                  </WalletButtonItem>

                  {/* LOG-OUT BUTTON */}
                  <ButtonItem
                    isLoading={isLoading}
                    onClick={onLogoutButtonClicked}
                  >
                    <LogoutIcon />
                    <Text scale='body'>{t('logout')}</Text>
                  </ButtonItem>
                </More>
              )}
            </MoreContainer>
            <Orders />
          </>
        ) : (
          <Button size='large' onClick={onLoginButtonClicked}>
            {t('login_signup')
              .split(' ')
              .map((item: string, i) => (
                <Text
                  as='span'
                  color='accent2'
                  colorWeight='overlay'
                  scale='default'
                  weight={item == t('or') ? 'normal' : 'bold'}
                  key={item}
                  style={{marginRight: 0, marginLeft: length === i + 1 ? 0 : 3}}
                >
                  {item}
                </Text>
              ))}
          </Button>
        )}
      </Profile>
      <Modal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(!isLoginOpen)}
        animation={'slideUp'}
        backdropColor='var(--modal-backdrop)'
      >
        <LoginCard closeModal={() => setIsLoginOpen(false)} />
      </Modal>
      <Modal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(!isWalletOpen)}
        animation={'slideUp'}
        backdropColor='var(--modal-backdrop)'
      >
        <WalletCharge onCloseModal={() => setIsWalletOpen(!isWalletOpen)} />
      </Modal>
    </>
  )
}
