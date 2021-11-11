import React, {FC} from 'react'
import {rem} from 'polished'
import styled from 'styled-components'
import {useTranslation} from 'react-i18next'
import {Text, FlexBox} from '@sf/design-system'
import {preOrder as preOrderProps} from '~order/types'
import {PRE_ORDER_STATE} from '~order/constants'

const Container = styled(FlexBox)`
  height: ${rem(40)};
  padding: ${({theme}) => theme.spacing[2]};
  line-height: ${rem(40)};
`
const GreenTitle = styled(Text)`
  position: relative;
  min-width: ${rem(83)};
  height: 100%;
  color: ${({theme}) => theme.accent2.overlay};
  line-height: inherit;
  background-color: ${({theme}) => theme.accent2.dark};
  border-radius: 0 ${rem(6)} ${rem(6)} 0;

  &::after {
    position: absolute;
    top: 0;
    right: 100%;
    border-top: 20px solid transparent;
    border-right: 13px solid ${({theme}) => theme.accent2.dark};
    border-bottom: 20px solid transparent;
    content: '';
  }
`
const GreenTimer = styled(Text)`
  width: 100%;
  height: 100%;
  color: ${({theme}) => theme.accent2.dark};
  line-height: inherit;
  background-color: ${({theme}) => theme.accent2.alphaLight};
  border-radius: ${rem(6)} 0 0 ${rem(6)};
`

const PreOrder: FC<{preOrder: preOrderProps}> = ({preOrder}) => {
  const {t} = useTranslation()
  const {day, interval} = preOrder
  let dateOrder
  switch (day) {
    case PRE_ORDER_STATE.TODAY:
      dateOrder = t('order:followOrder.today')
      break
    case PRE_ORDER_STATE.TOMORROW:
      dateOrder = t('order:followOrder.tomorrow')
      break
    case PRE_ORDER_STATE.AFTER_TOMORROW:
    case PRE_ORDER_STATE.TOMORROW1DAY:
      dateOrder = t('order:followOrder.day_after_tomorrow')
      break
    default:
      dateOrder = t('order:followOrder.today')
      break
  }

  const timeOrder = interval && interval.join(t('order:followOrder.until'))

  return (
    <Container alignItems='center'>
      <GreenTitle scale='caption' align='center'>
        {t('order:followOrder.pre_order')}
      </GreenTitle>
      <GreenTimer scale='body' align='center'>
        {`${dateOrder} ${timeOrder}`}
      </GreenTimer>
    </Container>
  )
}

export default PreOrder
