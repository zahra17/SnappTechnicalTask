import React, {useEffect, useState} from 'react'
import {useRudderStack} from '@contexts/RudderStack'
import {eventTypes} from '@schema/rudderStack'
import styled from 'styled-components'
import {
  Text,
  FlexBox,
  Input,
  Button,
  ExclamationIcon,
  CloseIcon,
} from '@sf/design-system'
import {rem} from 'polished'
import {useTranslation} from 'react-i18next'

interface VoucherCardProps {
  error?: string
  loading: boolean
  onClose: () => void
  submitVoucher: (voucherCode: string) => void
}

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: ${rem(480)};
  margin: 0;
  background: ${({theme}) => theme.surface.light};
  border-radius: ${rem(16)};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 8px 32px rgba(0, 0, 0, 0.16);
`

const Header = styled(FlexBox)`
  height: ${({theme}) => theme.spacing[7]};

  > * {
    &:first-child {
      position: absolute;
      right: ${({theme}) => theme.spacing[2]};
    }
  }
`

const Content = styled(FlexBox)`
  padding: ${({theme}) => theme.spacing[3]};

  > {
    &:nth-child(2) {
      margin-top: ${rem(6)};
      margin-bottom: ${({theme}) => theme.spacing[3]};
    }
  }
`
const ErrorContainer = styled.div`
  display: flex;
  align-items: center;

  > * {
    &:first-child {
      position: relative;
      bottom: 1px;
      margin-left: ${rem(9)};
      fill: ${({theme}) => theme.alert.main};
    }
  }
`

const VoucherCard: React.FC<VoucherCardProps> = props => {
  const {submitVoucher, onClose, error, loading} = props

  const {t} = useTranslation()
  const rudderStack = useRudderStack()

  const [voucher, setVoucher] = useState('')

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    submitVoucher(voucher)
  }

  useEffect(() => {
    if (error) {
      rudderStack.eventTrigger({
        type: eventTypes.track,
        eventName: 'Checkout Coupon wrong code',
        payload: {
          coupon: voucher,
          error_message: error,
        },
      })
    }
  }, [error])

  return (
    <CardContainer as='form' onSubmit={onSubmit}>
      <Header alignItems='center' justify='center'>
        <Button
          round
          size='body'
          appearance='naked'
          colorName='carbon'
          type='button'
          onClick={onClose}
        >
          <CloseIcon />
        </Button>
        <Text as='span' scale='default' weight='bold'>
          {t('order:voucher.voucher-code')}
        </Text>
      </Header>
      <Content direction='column'>
        <Input
          type='text'
          name='voucher'
          placeholder={t('order:voucher.type-voucher-code')}
          err={!!error}
          value={voucher}
          onChange={e => setVoucher(e.target.value)}
        />
        {error ? (
          <ErrorContainer>
            <ExclamationIcon width={16} height={16} />
            <Text
              scale='caption'
              colorName='alert'
              colorWeight='main'
              numeric={false}
            >
              {error}
            </Text>
          </ErrorContainer>
        ) : (
          <div style={{height: 16}} />
        )}
        <Button block size='large' type='submit' isLoading={loading}>
          {t('order:voucher.check-voucher-code')}
        </Button>
      </Content>
    </CardContainer>
  )
}

export default VoucherCard
