import React, {useState} from 'react'
import styled from 'styled-components'
import {
  CircleCheckIcon,
  DeliveredIcon,
  DeliveryIcon,
  FlexBox,
  Weights,
  Scales,
  Text,
  VendorIcon,
  ColorNames,
  Button,
  Modal,
} from '@sf/design-system'
import {rem} from 'polished'
import {PRIMARY_STATE, SECONDARY_STATE} from '~order/constants'
import CountDown from '@components/Countdown'
import {useTranslation} from 'react-i18next'
import PreOrder from '~order/components/PreOrder'
import {preOrder as PreOrderType} from '~order/types'

interface OrderStatusProps {
  primaryState: number
  secondaryState: number
  isExpress: boolean
  counterConfig: {
    show: boolean
    deliveredAt: number
    newEstimate: boolean
    onExpire: Function
  }
  newTypeTitle: string
  isDelay: boolean
  isBase?: boolean
  preOrder?: PreOrderType
}

const Caption = styled(FlexBox)<{isBase: boolean}>`
  height: ${rem(80)};
  padding: 0
    ${({theme, isBase}) => (!isBase ? theme.spacing[4] : theme.spacing[2])};

  > {
    &:last-child {
      min-width: ${rem(80)};
    }
  }
`
const TextContainer = styled(FlexBox)`
  > * {
    margin: ${rem(4)} 0;
  }
`
const DelayReasonButton = styled(Button)`
  margin: 0 ${({theme}) => theme.spacing[4]};
`
const Status = styled(FlexBox)<{stateIndex: number; height: number}>`
  height: ${({height}) => `${rem(height)}`};
  padding: 0 ${({theme}) => theme.spacing[4]};

  > {
    * {
      width: ${rem(20)};
      height: ${rem(20)};
      fill: ${({theme}) => theme.inactive.light};
    }

    &:nth-child(${({stateIndex}) => `-n+${stateIndex}`}) {
      fill: ${({theme}) => theme.accent.main};
    }

    div:nth-child(${({stateIndex}) => `-n+${stateIndex}`}) {
      background: ${({theme}) => theme.accent.main};
    }
  }
`
const HorizontalLine = styled.div`
  flex: 1 1 auto;
  height: ${rem(2)};
  margin: 0 ${rem(12)};
  background: ${({theme}) => theme.surface.dark};
  border-radius: ${rem(2)};
`
const DelayCard = styled(FlexBox)`
  box-sizing: border-box;
  width: ${rem(480)};
  height: ${rem(240)};
  padding: ${({theme}) => theme.spacing[3]};
`

const OrderStatus: React.FC<OrderStatusProps> = ({
  counterConfig,
  primaryState,
  secondaryState,
  newTypeTitle,
  isExpress,
  isDelay,
  isBase = false,
  preOrder,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const {t} = useTranslation()

  const isPreOrder = SECONDARY_STATE.PRE_ORDER === secondaryState

  function findStateIndex(state: number): number {
    switch (state) {
      case PRIMARY_STATE.PENDING:
        return 1
      case PRIMARY_STATE.PREPARATION:
        return 3
      case PRIMARY_STATE.BIKER_IN_ROUTE:
        return 5
      case PRIMARY_STATE.FINISHED:
      case PRIMARY_STATE.HAS_REVIEWED:
        return 7
      case PRIMARY_STATE.CANCELED:
      default:
        return 0
    }
  }

  function findStateStatus(state: number): Array<string> {
    switch (state) {
      case SECONDARY_STATE.CANCELED:
        return [t('order:followOrder:state_titles.canceled')]
      case SECONDARY_STATE.PRE_ORDER:
        return [t('order:followOrder:state_titles.pre_order')]
      case SECONDARY_STATE.PENDING:
        return [t('order:followOrder:state_titles.pending')]
      case SECONDARY_STATE.PREPARATION:
        return [t('order:followOrder:state_titles.preparation')]
      case SECONDARY_STATE.BIKER_TO_VENDOR:
        return [
          t('order:followOrder:state_titles.biker_to_vendor', {
            vendorType: newTypeTitle,
          }),
        ]
      case SECONDARY_STATE.BIKER_AT_VENDOR:
        return [
          t('order:followOrder:state_titles.biker_at_vendor', {
            vendorType: newTypeTitle,
          }),
        ]
      case SECONDARY_STATE.BIKER_IN_ROUTE:
        return [t('order:followOrder:state_titles.biker_in_route')]
      case SECONDARY_STATE.MAYBE_ARRIVED:
        return [t('order:followOrder:state_titles.maybe_arrived')]
      case SECONDARY_STATE.FINISHED:
        return [t('order:followOrder:state_titles.finished')]
      case SECONDARY_STATE.DELAYED:
        return t('order:followOrder:state_titles.delayed').split('&')
      case SECONDARY_STATE.DELAYED_SENDING:
        return [t('order:followOrder:state_titles.delayed_sending')]
      case SECONDARY_STATE.REVIEW:
        return [t('order:followOrder:state_titles.review')]
      case SECONDARY_STATE.MESSAGE:
        return [t('order:followOrder:state_titles.message')]
      case SECONDARY_STATE.DELTA_SETTLEMENT_BLOCK:
        return [t('order:followOrder:state_titles.delta_settlement_block')]
      case SECONDARY_STATE.LOOKING_FOR_BIKER:
        return [t('order:followOrder:state_titles.looking_for_biker')]
      case SECONDARY_STATE.BIKER_NEED_FOR_CALL:
        return [t('order:followOrder:state_titles.biker_need_for_call')]
      case SECONDARY_STATE.NEW_ORDER:
        return t('order:followOrder:state_titles.new_order', {
          vendorType: newTypeTitle,
        }).split('&')
      case SECONDARY_STATE.BIKER_REACHED_CUSTOMER:
        return t('order:followOrder:state_titles.biker_reached_customer').split(
          '&'
        )
      case SECONDARY_STATE.ERROR:
        return [t('order:followOrder:state_titles.error')]
      case SECONDARY_STATE.HAS_REVIEWED:
        return [t('order:followOrder:state_titles.has_reviewed')]
      default:
        return ['']
    }
  }

  function findSubStateStatus(state: number): Array<string> {
    switch (state) {
      case PRIMARY_STATE.CANCELED:
        return [t('order:followOrder:state_titles.canceled')]
      case PRIMARY_STATE.PENDING:
        return [t('order:followOrder:state_titles.pending')]
      case PRIMARY_STATE.PREPARATION:
        return [t('order:followOrder:state_titles.preparation')]
      case PRIMARY_STATE.BIKER_IN_ROUTE:
        return [t('order:followOrder:state_titles.biker_in_route')]
      case PRIMARY_STATE.FINISHED:
        return [t('order:followOrder:state_titles.finished')]
      case PRIMARY_STATE.HAS_REVIEWED:
        return [t('order:followOrder:state_titles.has_reviewed')]
      default:
        return ['']
    }
  }

  function handleStatus(
    primaryState: number,
    secondaryState: number,
    isDelay: boolean,
    isExpress: boolean,
    newEstimate: boolean
  ): {
    statuses: Array<string>
    weights: Array<Weights>
    scales: Array<Scales>
    colors: Array<ColorNames>
  } {
    if (
      findSubStateStatus(primaryState)[0] === findStateStatus(secondaryState)[0]
    ) {
      // special case for "Express" BIKER_IN_ROUTE which has isDelay
      if (
        primaryState === PRIMARY_STATE.BIKER_IN_ROUTE &&
        secondaryState === SECONDARY_STATE.BIKER_IN_ROUTE &&
        isDelay
      )
        return {
          statuses: [
            findStateStatus(secondaryState)[0],
            t('order:followOrder.delay_message'),
          ],
          weights: ['bold', 'normal'],
          scales: ['large', 'caption'],
          colors: ['carbon', 'carbon'],
        }
      return {
        statuses: findSubStateStatus(primaryState),
        weights: ['bold'],
        scales: ['large'],
        colors: ['carbon'],
      }
    } else {
      if (findStateStatus(secondaryState).length === 2) {
        return {
          statuses: findStateStatus(secondaryState),
          weights: ['normal', 'bold'],
          scales: ['caption', 'large'],
          colors: ['carbon', 'carbon'],
        }
      }
      if (isDelay && isExpress) {
        return {
          statuses: [
            findStateStatus(secondaryState)[0],
            t('order:followOrder.delay_message'),
          ],
          weights: ['bold', 'normal'],
          scales: ['large', 'caption'],
          colors: ['carbon', newEstimate ? 'carbon' : 'alert'],
        }
      } else {
        // special case for "Express" PREPARATION
        if (
          primaryState === PRIMARY_STATE.PREPARATION &&
          secondaryState === SECONDARY_STATE.LOOKING_FOR_BIKER
        )
          return {
            statuses: findSubStateStatus(primaryState),
            weights: ['bold'],
            scales: ['large'],
            colors: ['carbon'],
          }
        // special case for "restaurant biker's" MAYBE_ARRIVED
        if (
          primaryState === PRIMARY_STATE.PREPARATION &&
          secondaryState === SECONDARY_STATE.MAYBE_ARRIVED
        )
          return {
            statuses: findSubStateStatus(primaryState),
            weights: ['bold'],
            scales: ['large'],
            colors: ['carbon'],
          }
        // special case for "Express" MAYBE_ARRIVED
        if (
          primaryState === PRIMARY_STATE.FINISHED &&
          secondaryState === SECONDARY_STATE.MAYBE_ARRIVED
        )
          return {
            statuses: findSubStateStatus(primaryState),
            weights: ['bold'],
            scales: ['large'],
            colors: ['carbon'],
          }
        // special case for "restaurant biker's" user said it has delay
        if (
          primaryState === PRIMARY_STATE.PREPARATION &&
          secondaryState === SECONDARY_STATE.DELAYED_SENDING &&
          !isExpress
        )
          return {
            statuses: [findStateStatus(primaryState)[0]],
            weights: ['bold'],
            scales: ['large'],
            colors: ['carbon'],
          }
        if (isDelay) {
          return {
            statuses: [
              findStateStatus(secondaryState)[0],
              t('order:followOrder.delay_message'),
            ],
            weights: ['bold', 'normal'],
            scales: ['large', 'caption'],
            colors: ['carbon', newEstimate ? 'carbon' : 'alert'],
          }
        }
        return {
          statuses: [
            findStateStatus(secondaryState)[0],
            findSubStateStatus(primaryState)[0],
          ],
          weights: ['bold', 'normal'],
          scales: ['large', 'caption'],
          colors: ['carbon', 'carbon'],
        }
      }
    }
  }

  const {statuses, weights, scales, colors} = handleStatus(
    primaryState,
    secondaryState,
    isDelay,
    isExpress,
    counterConfig.newEstimate
  )

  return (
    <>
      {/* STATUS LIGHTS */}
      <Status
        justify='space-between'
        alignItems='center'
        stateIndex={findStateIndex(primaryState)}
        height={!isBase ? 64 : 48}
      >
        {/*  1- Order has been Registered  */}
        <CircleCheckIcon />
        <HorizontalLine />
        {/*  2- Preparing */}
        <VendorIcon />
        <HorizontalLine />
        {/* 3- Biker has been assigned */}
        {isExpress && (
          <>
            <DeliveryIcon />
            <HorizontalLine />
          </>
        )}
        {/* 4- Delivered */}
        <DeliveredIcon />
      </Status>
      <Caption justify='space-between' alignItems='center' isBase={isBase}>
        <TextContainer direction='column'>
          {/* Delivery State top */}
          {statuses.length > 1 && (
            <Text
              scale={scales[1]}
              as='span'
              weight={weights[1]}
              colorName={colors[1]}
            >
              {statuses[1]}
            </Text>
          )}

          {/* Delivery State bottom */}
          <Text
            scale={!isBase ? scales[0] : 'body'}
            as='span'
            weight={weights[0]}
            colorName={colors[0]}
          >
            {statuses[0]}
          </Text>
        </TextContainer>

        {/* NEW_ESTIMATE TITLE && CountDown */}
        {counterConfig.show && <CountDown counterConfig={counterConfig} />}
      </Caption>
      {/* DELAY_BUTTON Button */}
      {!isBase &&
        primaryState === PRIMARY_STATE.PREPARATION &&
        secondaryState === SECONDARY_STATE.LOOKING_FOR_BIKER &&
        isDelay && (
          <DelayReasonButton
            appearance='outline'
            colorName='accent2'
            onClick={() => setIsOpen(!isOpen)}
          >
            {t('order:followOrder.delay_button')}
          </DelayReasonButton>
        )}
      {/* DELAY_REASON Modal */}
      {!isBase && (
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(!isOpen)}
          animation={'slideUp'}
          backdropColor='var(--modal-backdrop)'
        >
          <DelayCard direction='column' justify='space-between'>
            <Text scale='default' align='justify'>
              {t('order:followOrder.delay_reason')}
            </Text>
            <Button
              colorName='carbon'
              appearance='ghost'
              size='large'
              onClick={() => setIsOpen(!isOpen)}
            >
              {t('order:followOrder.got_it')}
            </Button>
          </DelayCard>
        </Modal>
      )}
      {isPreOrder && preOrder && <PreOrder preOrder={preOrder} />}
    </>
  )
}

export default OrderStatus
