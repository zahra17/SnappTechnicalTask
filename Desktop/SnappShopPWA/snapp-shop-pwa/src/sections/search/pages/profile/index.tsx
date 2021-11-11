import React, {useEffect} from 'react'
import styled from 'styled-components'
import {SimplePageComponent} from '@root/types'
import ProtectRoute from '@root/Guard'
import {rem} from 'polished'
import {DefaultLayout} from '@root/Layout'

import {PROFILE_STATES} from '~search/components/Profile/SideNavBar'
import UserProfile from '~search/components/Profile/UserProfile'

import ProfileLayout from '~search/layout/profile-layout'
import {useRudderStack} from '@contexts/RudderStack'
import {eventTypes} from '@schema/rudderStack'

const Page = styled(DefaultLayout)`
  display: flex;
  justify-content: center;
  min-height: 80vh;
  padding-top: ${rem(60)};
`

const Profile: SimplePageComponent = () => {
  const MainContainer = styled(ProfileLayout)`
    min-height: 80vh;
  `
  const rudderStack = useRudderStack()
  useEffect(() => {
    rudderStack.eventTrigger({
      type: eventTypes.pageView,
      page_category: 'Profile',
      page_name: 'Profile Page',
    })
  }, [rudderStack])
  return (
    <Page>
      <MainContainer defaultStep={PROFILE_STATES.DEFAULT}>
        <UserProfile />
      </MainContainer>
    </Page>
  )
}

export default ProtectRoute(Profile)
