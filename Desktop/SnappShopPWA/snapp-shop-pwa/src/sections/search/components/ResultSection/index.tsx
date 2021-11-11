import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import {rem} from 'polished'
import {Text, FlexBox} from '@sf/design-system'
import {Anchor} from '@components/Anchor'
interface Props {
  heading: string
  moreText?: string
  moreLink?: string
  hasMoreItems: boolean
}
const Section = styled.section`
  > :last-child {
    margin-top: ${rem(25)};
  }
`
const Header = styled(FlexBox).attrs({as: 'header'})`
  > :last-child {
    cursor: pointer;
    user-select: none;
  }
`

export const ResultSection: React.FC<Props> = ({
  heading,
  moreText,
  moreLink,
  hasMoreItems = false,
  children,
  ...props
}) => {
  return (
    <Section {...props}>
      <Header justify='space-between'>
        <Text as='h2' scale='body' weight='bold' colorWeight='light'>
          {heading}
        </Text>
        {Boolean(moreLink && moreText && hasMoreItems) && (
          <Link href={moreLink!} passHref>
            <Anchor>
              <Text scale='body' weight='bold' colorName='accent2'>
                {moreText}
              </Text>
            </Anchor>
          </Link>
        )}
      </Header>
      {children}
    </Section>
  )
}
