import useTimer from '@hooks/useTime'
import {FlexBox, Text, TimeIcon, toPersian} from '@sf/design-system'
import React, {FC} from 'react'
import styled from 'styled-components'
import {rem} from 'polished'
import {useTranslation} from 'react-i18next'
interface CountDownsProps {
  counterConfig: {
    show: boolean
    deliveredAt: number
    newEstimate: boolean
    onExpire: Function
  }
}

const Container = styled(FlexBox)<{newEstimate: boolean}>`
  > {
    * {
      fill: ${({theme, newEstimate}) =>
        newEstimate ? theme.accent2.main : theme.carbon.light};

      /*  every numbers of the timer ==> 12:34 */
      > * {
        width: ${({theme}) => theme.spacing[3]};
        color: ${({theme, newEstimate}) =>
          newEstimate ? theme.accent2.main : theme.carbon.main};
        text-align: center;
        /*  it is for : in the clock */
        &:nth-child(2n) {
          width: ${({theme}) => theme.spacing[1]};
        }
      }
      /*  timer container ==> 12:34 */
      &:first-child {
        min-width: ${rem(42)};
      }
    }
  }
`

const CountDown: FC<CountDownsProps> = ({counterConfig}) => {
  const {t} = useTranslation()
  const {seconds, minutes, hours} = useTimer({
    expiry: counterConfig.deliveredAt,
    onExpire: counterConfig.onExpire,
  })
  if (seconds === '00' && minutes === '00' && hours === '00') return <></>
  if (seconds === 'NaN' && minutes === 'NaN' && hours === 'NaN') return <></>
  return (
    <FlexBox direction='column' justify='center' alignItems='center'>
      {counterConfig.newEstimate && (
        <Text scale='caption' colorWeight='light'>
          {t('order:followOrder.new_estimate')}
        </Text>
      )}
      <Container
        alignItems='center'
        justify='center'
        newEstimate={counterConfig.newEstimate}
      >
        <FlexBox justify='center'>
          <Text scale='large' weight='bold' as='span'>
            {toPersian(seconds)}
          </Text>
          <Text scale='large' weight='bold' as='span'>
            :
          </Text>
          <Text scale='large' weight='bold' as='span'>
            {toPersian(minutes)}
          </Text>
          {hours !== '00' && (
            <Text scale='large' weight='bold' as='span'>
              :
            </Text>
          )}
          {hours !== '00' && (
            <Text scale='large' weight='bold' as='span'>
              {toPersian(hours)}
            </Text>
          )}
        </FlexBox>
        <TimeIcon />
      </Container>
    </FlexBox>
  )
}

export default CountDown
