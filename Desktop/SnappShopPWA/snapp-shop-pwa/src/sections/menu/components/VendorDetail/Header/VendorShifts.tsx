import React from 'react'
import styled from 'styled-components'
import {rem} from 'polished'
import {Card, Text, FlexBox} from '@sf/design-system'
import {SortedSchedules} from '@schema/vendor'
import {getWeekDayName, sortBaseOnHours} from '@utils'

interface Props {
  shifts: SortedSchedules[]
  isVisible: boolean
}

const ShiftCard = styled(Card)`
  max-height: auto;
  margin: ${({theme}) => theme.spacing[2]} ${({theme}) => theme.spacing[3]};
  padding: ${({theme}) => theme.spacing[1]};
  border: ${rem(1)} solid ${({theme}) => theme.surface.dark};
  transition: all 0.2s linear;
`

const DayContainer = styled(FlexBox)`
  > * {
    margin-bottom: ${({theme}) => theme.spacing[1]};
  }
`
const TimeRange = styled(FlexBox)`
  margin-top: 0.3rem;

  :first-child {
    margin-bottom: 0.5rem;
  }

  > :nth-child(2) {
    margin: 0 ${rem(4)};
  }
`
const VendorShifts: React.FC<Props> = ({shifts, isVisible}) => {
  return (
    <ShiftCard
      style={{
        height: isVisible ? 'auto' : 0,
        padding: isVisible ? '0.5rem' : ' 0 0.5rem',
        margin: isVisible ? '1rem 1.5rem' : '0 1.5rem',
        opacity: isVisible ? 1 : 0,
      }}
    >
      {shifts.map(shift => (
        <DayContainer
          justify='end'
          alignItems='center'
          direction='column'
          key={shift.weekday}
        >
          <Text scale='tiny' colorWeight='light'>
            {getWeekDayName(shift.weekday)}
          </Text>
          <section>
            {shift.schedules.map((item, index) => (
              <TimeRange key={index} justify='center'>
                <Text scale='caption' as='span'>
                  {item.stopHour}
                </Text>
                <Text
                  scale='caption'
                  as='span'
                  colorName='inactive'
                  colorWeight='light'
                >
                  -
                </Text>
                <Text scale='caption' as='span'>
                  {item.startHour}
                </Text>
              </TimeRange>
            ))}
          </section>
        </DayContainer>
      ))}
    </ShiftCard>
  )
}

export default React.memo(VendorShifts)
