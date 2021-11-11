import React from 'react'
import styled from 'styled-components'
import {ChevronLeftIcon, FlexBox, Text} from '@sf/design-system'
import Link, {LinkProps} from 'next/link'
import {useRudderStack} from '@contexts/RudderStack'
import {eventTypes} from '@schema/rudderStack'
import {Anchor} from '@components/Anchor'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  heading: string
  moreText?: string
  linkProps?: LinkProps
  promotionId: number
}

const Section = styled(FlexBox)`
  > :first-child {
    margin-bottom: ${({theme}) => theme.spacing[3]};
  }
`
const MoreLink = styled(FlexBox)`
  cursor: pointer;

  > :last-child {
    margin-right: ${({theme}) => theme.spacing[2]};
  }
`
export const SectionItem: React.FC<Props> = ({
  children,
  heading,
  promotionId,
  moreText,
  linkProps,
  ...props
}) => {
  const rudderStack = useRudderStack()
  const onShowMoreClicked = () => {
    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: 'Promotion Clicked',
      payload: {
        promotion_id: String(promotionId),
        creative: heading,
        name: heading,
        position: 'home_middle',
      },
    })
  }

  return (
    <Section as='section' direction='column' {...props}>
      <FlexBox justify='space-between'>
        <Text scale='xlarge' weight='bold'>
          {heading}
        </Text>
        {Boolean(linkProps) && (
          <Link {...linkProps!} passHref>
            <Anchor>
              <MoreLink
                alignItems='center'
                onClick={() => {
                  onShowMoreClicked()
                }}
              >
                <Text scale='large' weight='bold' colorName='accent2'>
                  {moreText}
                </Text>
                <ChevronLeftIcon fill='var(--sf-accent2-main)' />
              </MoreLink>
            </Anchor>
          </Link>
        )}
      </FlexBox>
      {children}
    </Section>
  )
}
