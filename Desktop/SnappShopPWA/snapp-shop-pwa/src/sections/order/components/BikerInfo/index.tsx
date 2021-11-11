import React, {FC, useEffect, useState} from 'react'
import {rem} from 'polished'
import styled from 'styled-components'
import {useTranslation} from 'react-i18next'
import {Button, Text, FlexBox, MobileIcon} from '@sf/design-system'
import {Biker} from '~order/types'
import {Img} from '@components/Img'

interface BikerInfoProps {
  biker: Biker
}

const Container = styled(FlexBox)`
  height: ${({theme}) => theme.spacing[6]};
  padding: ${({theme}) => theme.spacing[1]} ${({theme}) => theme.spacing[2]};

  > * > {
    &:first-child {
      margin-left: ${({theme}) => theme.spacing[1]};
      border-radius: 100%;
    }
  }
`

const BikerInfo: FC<BikerInfoProps> = ({biker}) => {
  return (
    <>
      <Container justify='space-between' alignItems='center'>
        <FlexBox alignItems='center'>
          <Img
            src={biker.image || undefined}
            alt={'تصویر پیک'}
            width={48}
            height={48}
          />
          <Text scale='body'>{biker.name}</Text>
        </FlexBox>
        <FlexBox>
          <Text scale='body' weight={'bold'} numeric={false}>
            {biker.cellphone.replace('+98', '0')}
          </Text>
          <MobileIcon />
        </FlexBox>
      </Container>
    </>
  )
}

export default BikerInfo
