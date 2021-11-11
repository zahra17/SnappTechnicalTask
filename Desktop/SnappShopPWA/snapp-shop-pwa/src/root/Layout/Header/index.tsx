import React, {useEffect, useState} from 'react'
import {rem} from 'polished'
import styled, {useTheme} from 'styled-components'
import {
  SnappShopIcon as TypeMarkIcon,
  FlexBox,
  FlexProps,
} from '@sf/design-system'
import Location from './Location'
import {SearchModal} from '~search/components/SearchModal'
import {ServicesList} from '~search/components/ServicesList'
import {UserProfile} from '~growth/components/UserProfile'
import {useRouter} from 'next/router'
import Link from 'next/link'
import Breadcrumb from '@components/Breadcrumb'
import {useRudderStack} from '@contexts/RudderStack'
import {eventTypes} from '@schema/rudderStack'
import {Anchor} from '@components/Anchor'
import HeadingTitle from '~search/components/HeadingTitle'

const StyledHeaderWrapper = styled(FlexBox)`
  position: sticky;
  top: 0;
  right: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  min-width: ${rem(1024)};

  &.home-header.inactive {
    position: fixed;
    transform: translateY(-300px);
  }

  > :first-child > :first-child {
    top: 0;
    right: 0;
    left: 0;
    width: 100%;
    background-color: ${({theme}) => theme.surface.light};
  }

  .fixed {
    position: fixed;
    animation: fixedEffect 0.3s ease-out both;

    @keyframes fixedEffect {
      from {
        transform: translateY(-200px);
      }

      to {
        transform: translateY(0);
      }
    }
  }

  &.home-header {
    position: sticky;
    transform: translateY(0);
    transition: all 0.3s ease-out;

    > :first-child > :first-child,
    .fixed {
      position: relative !important;
      animation: none !important;
    }
  }
`
const StyledHeader = styled(FlexBox).attrs({as: 'header'})`
  width: 100%;
  background-color: ${({theme}) => theme.surface.light};

  > :first-child {
    box-sizing: border-box;
    height: ${rem(72)};
    padding: ${({theme}) => theme.spacing[2]};
  }
`

const Right = styled(FlexBox)`
  > *:first-child {
    margin-left: ${({theme}) => theme.spacing[5]};
    outline: none;
    cursor: pointer;

    > svg {
      outline: none;
    }
  }
`
export enum HeaderMode {
  home,
  others,
}

export type HeaderProps = {
  displayState?: boolean
  headerMode?: HeaderMode
}

export const Header = (props: HeaderProps) => {
  const {displayState = true, headerMode = HeaderMode.others} = props
  const router = useRouter()
  const rudderStack = useRudderStack()
  const theme = useTheme()

  const onLogoClicked = () => {
    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: 'Header Snappfood logo',
      payload: {},
    })
  }
  const inactiveClass = !displayState ? 'inactive' : ''
  const headerModeClass = headerMode === HeaderMode.home ? 'home-header' : ''
  const topSectionRef = React.createRef<HTMLDivElement>()

  return (
    <>
      <StyledHeaderWrapper
        direction='column'
        className={`${inactiveClass} ${headerModeClass}`}
      >
        <StyledHeader direction='column'>
          <FlexBox
            ref={topSectionRef}
            justify='space-between'
            alignItems='center'
          >
            <Right alignItems='center'>
              <Link
                href={{pathname: '/', search: 'reset-scroll=true'}}
                as='/'
                passHref
              >
                <Anchor>
                  <TypeMarkIcon
                    role='button'
                    tabIndex={0}
                    width='68'
                    height='34'
                    onClick={onLogoClicked}
                    fill={theme.accent.main}
                  />
                </Anchor>
              </Link>
              <Location />
            </Right>
            <SearchModal />
            <UserProfile />
          </FlexBox>
          {headerMode === HeaderMode.home && <ServicesList />}
        </StyledHeader>
      </StyledHeaderWrapper>
      {headerMode !== HeaderMode.home ? (
        <>
          <ServicesList />
          <Breadcrumb />
          <HeadingTitle />
        </>
      ) : (
        <Breadcrumb />
      )}
    </>
  )
}
