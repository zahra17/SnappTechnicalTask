import React, {useState} from 'react'
import styled from 'styled-components'
import {Button, CloseIcon, FlexBox, Text, bks} from '@sf/design-system'
import {useTranslation} from 'react-i18next'

const AdBarBox = styled(FlexBox)`
  height: ${({theme}) => theme.spacing[6]};
  padding: 0 ${({theme}) => theme.spacing[2]};
  background-color: ${({theme}) => theme.surface.main};
  box-shadow: ${({theme}) => theme.shadows.inset};

  ${bks.down('sm')} {
    display: none;
  }

  > :first-child {
    /* CloseIcon */
    > :first-child {
      margin-left: ${({theme}) => theme.spacing[3]};
    }
  }

  > :last-child {
    text-decoration: none;
  }
`
let visible = true

export const AdBar = () => {
  const {t} = useTranslation()
  const [isVisible, setIsVisible] = useState(visible)
  return visible && isVisible ? (
    <AdBarBox justify='space-between' alignItems='center'>
      <FlexBox alignItems='center'>
        <CloseIcon
          onClick={e => {
            setIsVisible(false)
            visible = false
          }}
          width={8}
        />
        <Text scale='caption' colorWeight='light'>
          {t('layout.old-app-text')}
        </Text>
      </FlexBox>
      <a href='http://snappfood.ir/?go_to_old_version=true'>
        <Button colorName='carbon' appearance='ghost' size='body'>
          <Text as='span' scale='body'>
            {t('layout.back-to-old-version')}
          </Text>
        </Button>
      </a>
    </AdBarBox>
  ) : null
}
