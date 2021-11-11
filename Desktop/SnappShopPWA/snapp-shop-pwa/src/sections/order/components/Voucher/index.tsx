import React, {FC, useEffect, useState} from 'react'
import {rem} from 'polished'
import styled from 'styled-components'
import {useRudderStack} from '@contexts/RudderStack'
import {eventTypes} from '@schema/rudderStack'
import {useTranslation} from 'react-i18next'
import {
  Button,
  Text,
  FlexBox,
  RemoveIcon,
  VoucherIcon,
  Modal,
} from '@sf/design-system'

import VoucherCard from '~order/components/VoucherCard'

interface VoucherFieldProps {
  setVoucher: (code: string) => void
  clearErrors: () => void
  voucherCode?: string
  amount?: number
  error?: string
  loading: boolean
}

const DiscountContainer = styled(FlexBox)`
  height: ${({theme}) => theme.spacing[7]};

  > {
    &:first-child {
      > {
        &:first-child {
          margin-left: ${({theme}) => theme.spacing[2]};
        }
      }
    }

    &.import-voucher {
      min-width: ${rem(70)};
    }
  }
`

const VoucherField: FC<VoucherFieldProps> = ({
  setVoucher,
  clearErrors,
  voucherCode,
  amount,
  error,
  loading,
}) => {
  const {t} = useTranslation()
  const rudderStack = useRudderStack()
  const [isOpen, setIsOpen] = useState(false)

  const onCloseModal = () => {
    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: 'Checkout Coupon Modal Close',
    })
    setIsOpen(!isOpen)
    clearErrors()
  }

  const handleOpenVoucher = () => {
    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: 'Checkout Coupon clicked',
    })
    setIsOpen(true)
  }

  useEffect(() => {
    if (voucherCode) setIsOpen(false)
  }, [voucherCode])

  return (
    <>
      <DiscountContainer justify='space-between' alignItems='center'>
        <FlexBox alignItems='center'>
          <VoucherIcon
            fill={
              voucherCode ? 'var(--sf-accent2-main)' : 'var(--sf-carbon-light)'
            }
          />
          <FlexBox direction='column'>
            <Text as='span' scale='body' numeric={false}>
              {voucherCode
                ? t('order:voucher.discount-code', {voucherCode})
                : t('order:voucher.voucher-description')}
            </Text>
            {voucherCode && (
              <Text as='span' scale='body'>
                {t('order:voucher.discount', {discount: amount})}
              </Text>
            )}
          </FlexBox>
        </FlexBox>
        {voucherCode ? (
          <Button
            round
            size='body'
            appearance='naked'
            colorName='carbon'
            onClick={() => setVoucher('')}
          >
            <RemoveIcon />
          </Button>
        ) : (
          <Button
            className='import-voucher'
            appearance='outline'
            colorName='accent2'
            size='body'
            onClick={handleOpenVoucher}
          >
            {t('order:voucher.import-voucher')}
          </Button>
        )}
      </DiscountContainer>
      <Modal
        isOpen={isOpen}
        onClose={onCloseModal}
        animation={'slideUp'}
        backdropColor='var(--modal-backdrop)'
      >
        <VoucherCard
          error={error}
          loading={loading}
          onClose={onCloseModal}
          submitVoucher={setVoucher}
        />
      </Modal>
    </>
  )
}

export default VoucherField
