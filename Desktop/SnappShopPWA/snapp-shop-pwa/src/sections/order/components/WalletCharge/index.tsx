import React, {FC, useState} from 'react'
import styled from 'styled-components'
import {useTranslation} from 'react-i18next'
import {useRouter} from 'next/router'
import {FlexBox, Text, Button, MinusIcon, PlusIcon} from '@sf/design-system'
import {ModalHeader} from '@components/ModalTools'
import useCredit from '~order/hooks/useCredit'
import {rem} from 'polished'
import {persianPrice, numberToWords} from '@utils'
import {isAPIResponse} from '@api'
import requests from '~order/endpoints'
import {DESKTOP_ENV} from '~order/constants'

const Container = styled(FlexBox)`
  width: ${rem(480)};
  /* height: ${rem(256)}; */
  border-radius: ${({theme}) => theme.spacing[1]};
`
const TopMessage = styled(FlexBox)`
  margin-bottom: 0.5rem;
  padding: 0.2rem 1rem 1rem;

  p:first-child {
    margin-bottom: 0.5rem;
  }
`
const Content = styled(FlexBox)`
  margin-top: ${({theme}) => theme.spacing[1]};
  padding: ${({theme}) => theme.spacing[2]};

  > {
    &:nth-child(1) {
      > button {
        margin: 0 ${({theme}) => theme.spacing[1]};
      }
    }

    &:nth-child(2) {
      padding: ${({theme}) => `${theme.spacing[3]} ${theme.spacing[2]}`};
    }

    &:nth-child(3) {
      /* margin: ${({theme}) => theme.spacing[3]} 0; */
    }
  }
`
const Thousand = styled(Text)`
  margin-right: 0.25rem !important;
`

interface WalletChargeProps {
  onCloseModal: (code: string) => void
}

const WalletCharge: FC<WalletChargeProps> = ({onCloseModal}) => {
  const {t} = useTranslation()
  const credit = useCredit()
  const router = useRouter()

  const [value, setValue] = useState(20000)

  const [loading, setLoading] = useState(false)

  async function increaseCredit(value: number) {
    const response = await requests.increaseCredit<{
      data: {url: string}
      status: boolean
    }>({params: {amount: value, source: DESKTOP_ENV}})
    if (isAPIResponse(response) && response.data.data) {
      const {data} = response.data
      if (data?.url) window.location.assign(`https://snappfood.ir${data.url}`)
    }
    setLoading(false)
  }

  return (
    <Container direction='column'>
      <ModalHeader onClose={onCloseModal} />
      <TopMessage direction='column'>
        <Text scale='xlarge' weight='bold' colorName='carbon'>
          {t('user_profile.charge')}
        </Text>
        <Text scale='body' colorName='carbon' colorWeight='light'>
          {t('user_profile.current-credit', {
            credit: persianPrice(String(credit)),
          })}
        </Text>
      </TopMessage>
      <Content direction='column'>
        <FlexBox justify='space-evenly'>
          <Button
            block
            colorName='carbon'
            appearance='ghost'
            onClick={() => setValue(10000)}
          >
            <Text as='span' scale='default' weight='bold'>
              10
            </Text>
            <Thousand as='span' scale='default'>
              {t('user_profile.thousand-t')}
            </Thousand>
          </Button>
          <Button
            block
            colorName='carbon'
            appearance='ghost'
            onClick={() => setValue(20000)}
          >
            <Text as='span' scale='default' weight='bold'>
              20
            </Text>
            <Thousand as='span' scale='default'>
              {t('user_profile.thousand-t')}
            </Thousand>
          </Button>
          <Button
            block
            colorName='carbon'
            appearance='ghost'
            onClick={() => setValue(50000)}
          >
            <Text as='span' scale='default' weight='bold'>
              50
            </Text>
            <Thousand as='span' scale='default'>
              {t('user_profile.thousand-t')}
            </Thousand>
          </Button>
        </FlexBox>
        <FlexBox justify='space-between'>
          <Button
            type='button'
            round
            size='body'
            appearance='naked'
            colorName='accent'
            onClick={() => {
              value > 1000 ? setValue(value - 1000) : undefined
            }}
          >
            <MinusIcon fill='var(--sf-accent-main)' width={10} height={10} />
          </Button>
          <FlexBox direction='column' alignItems='center'>
            <Text scale='xlarge' weight='bold'>
              {value}
            </Text>
            <Text scale='caption' style={{opacity: 0.8}}>
              {t('user_profile.value-t', {
                value: numberToWords(value),
              })}
            </Text>
          </FlexBox>
          <Button
            type='button'
            round
            size='body'
            appearance='naked'
            colorName='accent'
            onClick={() => setValue(value + 1000)}
          >
            <PlusIcon fill='var(--sf-accent-main)' width={10} height={10} />
          </Button>
        </FlexBox>
        <Button
          block
          size='large'
          onClick={() => {
            setLoading(true)
            increaseCredit(value)
          }}
          isLoading={loading}
        >
          {t('user_profile.payment')}
        </Button>
      </Content>
    </Container>
  )
}

export default WalletCharge
