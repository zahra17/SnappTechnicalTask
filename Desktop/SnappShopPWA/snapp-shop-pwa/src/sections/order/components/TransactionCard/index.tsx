import React, {FC} from 'react'
import styled from 'styled-components'
import {rem} from 'polished'
import {useTranslation} from 'react-i18next'
import {
  Text,
  FlexBox,
  TimeIcon,
  Price,
  CalendarIcon,
  CircleCheckIcon,
  CircleCloseIcon,
} from '@sf/design-system'
import {payment, transactionStatus} from '~order/types'
import {HEAD_STATES, REASON_STATES, TRANSACTIONS} from '~order/constants'
import {formatDate, formatTime} from '@utils'

interface Props {
  backgroundColor?: transactionStatus
}

const TransactionCard: FC<{payment: payment}> = ({payment}) => {
  const Container = styled(FlexBox)`
    height: ${rem(86)};
    border-bottom: ${({theme}) => `1px solid ${theme.carbon.alphaLight}`};

    > * {
      padding: ${({theme}) => `0 ${theme.spacing[2]}`};
    }
  `
  const TextWithIcon = styled(FlexBox).attrs({
    justify: 'center',
    alignItems: 'center',
  })<Props>`
    margin-right: ${({theme}) => theme.spacing[1]};
    padding: ${rem(4)};
    background-color: ${({theme, backgroundColor}) =>
      backgroundColor === TRANSACTIONS.status.COMPLETED
        ? theme.accent2.alphaLight
        : backgroundColor === TRANSACTIONS.status.REJECTED ||
          backgroundColor === TRANSACTIONS.status.PENDING
        ? theme.carbon.alphaLight
        : 'transparent'};
    border-radius: ${({theme}) => theme.spacing[2]};

    svg {
      width: ${rem(13.3)};
      height: ${rem(13.3)};
      margin-left: ${rem(4)};
      fill: ${({theme, backgroundColor}) =>
        backgroundColor === TRANSACTIONS.status.COMPLETED
          ? theme.accent2.dark
          : backgroundColor === TRANSACTIONS.status.REJECTED
          ? theme.inactive.dark
          : backgroundColor === TRANSACTIONS.status.PENDING
          ? theme.carbon.main
          : theme.inactive.light};
    }

    p {
      color: ${({theme, backgroundColor}) =>
        backgroundColor === TRANSACTIONS.status.COMPLETED
          ? theme.accent2.dark
          : backgroundColor === TRANSACTIONS.status.REJECTED
          ? theme.inactive.dark
          : backgroundColor === TRANSACTIONS.status.PENDING
          ? theme.carbon.main
          : theme.carbon.light};
    }
  `

  const {t} = useTranslation()

  const {
    title,
    type,
    amount,
    status,
    isDeltaSettlement,
    transactionReason,
    ipgType,
    updatedAt,
  } = payment

  const handleHead = (
    type: string,
    ipgType: string,
    transactionReason: string | undefined
  ): string => {
    if (type === TRANSACTIONS.types.IPG) {
      if (ipgType === TRANSACTIONS.ipgType.online) {
        return HEAD_STATES.IPG_ONLINE
      } else if (ipgType === TRANSACTIONS.ipgType.IPG_AP_DEBIT) {
        return HEAD_STATES.IPG_AP_DEBIT
      } else if (ipgType === TRANSACTIONS.ipgType.IPG_SNAPP_CREDIT) {
        return HEAD_STATES.IPG_SNAPP_CREDIT
      } else {
        return HEAD_STATES.IPG
      }
    } else if (type === TRANSACTIONS.types.WALLET) {
      if (
        transactionReason === TRANSACTIONS.reasons.REASON_1 ||
        transactionReason === TRANSACTIONS.reasons.REASON_2 ||
        transactionReason === TRANSACTIONS.reasons.EMPTY
      ) {
        return HEAD_STATES.WALLET_WITHDRAW
      } else {
        return HEAD_STATES.WALLET_DEPOSIT
      }
    } else {
      return HEAD_STATES.NOT_SET
    }
  }

  const handleReason = (
    type: string,
    transactionReason: string | undefined
  ): string => {
    if (type === TRANSACTIONS.types.IPG) {
      if (+isDeltaSettlement) {
        return REASON_STATES.ORDER_LEFT_OVER
      } else {
        return REASON_STATES.ORDER
      }
    } else if (type === TRANSACTIONS.types.WALLET) {
      if (
        transactionReason === TRANSACTIONS.reasons.EMPTY ||
        transactionReason === TRANSACTIONS.reasons.REASON_2
      ) {
        return REASON_STATES.ORDER
      } else if (transactionReason === TRANSACTIONS.reasons.REASON_1) {
        return REASON_STATES.ORDER_LEFT_OVER
      } else if (transactionReason === TRANSACTIONS.reasons.REASON_3) {
        return REASON_STATES.INCREASE_WALLET
      } else {
        return REASON_STATES.RETURN_TO_WALLET
      }
    } else {
      return REASON_STATES.NOT_SET
    }
  }

  const handleIcon = (status: transactionStatus) => {
    switch (status) {
      case TRANSACTIONS.status.COMPLETED:
        return <CircleCheckIcon />
      case TRANSACTIONS.status.REJECTED:
        return <CircleCloseIcon />
      case TRANSACTIONS.status.PENDING:
        return <TimeIcon />
      default:
        return ''
    }
  }

  // check if transaction type exists
  if (!(type in TRANSACTIONS.types)) return null

  return (
    <Container justify='space-between'>
      <FlexBox direction='column' justify='space-evenly'>
        <Text scale='body' weight='bold'>
          {t(`order:transactions.${handleReason(type, transactionReason)}`, {
            title,
          })}
        </Text>
        <FlexBox>
          <Text scale='body'>
            {t(
              `order:transactions.${handleHead(
                type,
                ipgType,
                transactionReason
              )}`
            )}
          </Text>
          <TextWithIcon backgroundColor={status}>
            {handleIcon(status)}
            <Text scale='caption'>{t(`order:transactions.${status}`)}</Text>
          </TextWithIcon>
        </FlexBox>
      </FlexBox>
      <FlexBox direction='column' justify='space-evenly' alignItems='flex-end'>
        <FlexBox>
          <TextWithIcon>
            <CalendarIcon />
            <Text scale='caption'>{formatDate(new Date(updatedAt.date))}</Text>
          </TextWithIcon>

          <TextWithIcon>
            <TimeIcon />
            <Text scale='caption'>{formatTime(new Date(updatedAt.date))}</Text>
          </TextWithIcon>
        </FlexBox>
        <Price value={amount} isZeroVisible />
      </FlexBox>
    </Container>
  )
}

export default TransactionCard
