import React, {useState} from 'react'
import {FlexBox, Grid} from '@sf/design-system'
import SideNavBar from '~search/components/Profile/SideNavBar'
import styled from 'styled-components'
import {rem} from 'polished'

interface ProfileLayoutProps {
  defaultStep: number
}
const Container = styled(FlexBox)`
  width: 100%;
  overflow-y: auto;
  background-color: ${({theme}) => theme.surface.light};
  border: ${rem(1)} solid ${({theme}) => theme.carbon.alphaLight};
  border-radius: ${rem(12)};

  box-shadow: ${({theme}) => theme.shadows.medium};
`
const Section = styled(FlexBox).attrs({
  direction: 'column',
})`
  box-sizing: border-box;
  width: 100%;
  padding: ${({theme}) => theme.spacing[3]};

  &:not(:last-child) {
    padding-bottom: 0;
  }
`
const ProfileLayout: React.FC<
  ProfileLayoutProps & React.HTMLAttributes<HTMLDivElement>
> = ({children, defaultStep, ...props}) => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={1} />
      <Grid item xs={3} as='aside'>
        <SideNavBar step={defaultStep} />
      </Grid>
      <Grid item xs={7} as='section'>
        <Container direction='column'>{children}</Container>
      </Grid>
    </Grid>
  )
}
export default ProfileLayout
