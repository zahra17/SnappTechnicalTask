import React from 'react'
import styled from 'styled-components'
import {rem} from 'polished'
import {useTranslation} from 'react-i18next'
import {
  FlexBox,
  Text,
  PinIcon,
  Button,
  SearchIcon,
  PinOutlineIcon,
} from '@sf/design-system'
import {useAppDispatch} from '@redux'
import {showModal} from '~growth/redux/location'

const Container = styled(FlexBox)`
  box-sizing: border-box;
  width: 30vw;
  min-width: ${rem(300)};
  max-width: 50%;
  height: ${rem(56)};
  margin-top: ${rem(28)};
  background-color: ${({theme}) => theme.surface.light};
  border: ${rem(1)} solid ${({theme}) => theme.carbon.alphaMedium};
  border-radius: ${rem(80)};
  box-shadow: ${({theme}) => theme.shadows.medium};
  /* First FlexBox  */
  > :first-child {
    /* PinIcon */
    > :first-child {
      margin-right: ${rem(19)};
    }
    /* Text */
    > :last-child {
      margin-right: ${rem(11)};
    }
  }
  /* Button */
  > :last-child {
    margin-left: ${rem(4)};
  }
`
export const SelectLocationBox: React.FC = props => {
  const {t} = useTranslation()
  const dispatch = useAppDispatch()
  return (
    <>
      <Container
        alignItems='center'
        justify='space-between'
        {...props}
        onClick={() => {
          dispatch(showModal(true))
        }}
      >
        <FlexBox alignItems='center'>
          <PinOutlineIcon
            width='17'
            height='20'
            fill='var(--sf-inactive-dark)'
          />
          <Text scale='body' colorName='inactive' colorWeight='dark'>
            {t('search:home.select-address')}
          </Text>
        </FlexBox>
        <Button float round size='large'>
          <SearchIcon fill='var(--sf-accent-overlay)' />
        </Button>
      </Container>
    </>
  )
}
