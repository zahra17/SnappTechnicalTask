import React, {FC} from 'react'
import {FlexBox, Text} from '@sf/design-system'
import {Img} from '@components/Img'
import styled from '@emotion/styled'
import {rem} from 'polished'

interface Props {
  title: string
  description: string
  Icon: FC
}

const Container = styled(FlexBox)`
  > svg {
    width: ${rem(48)};
    height: ${rem(48)};
    margin-left: ${rem(8)};
  }
`

const OptionWrapper = styled(FlexBox)`
  padding-left: ${rem(16)};

  > * {
    margin-bottom: ${rem(2)};
  }
`

const Image = styled(Img)`
  width: ${rem(96)};
  height: ${rem(96)};
`

export const ShopOptions: FC<Props> = ({title, description, Icon}) => {
  return (
    <Container direction='row' alignItems='center'>
      <Icon />
      <OptionWrapper
        direction='column'
        justify='center'
        alignItems='flex-start'
      >
        <Text scale='caption' weight='bold' align='right'>
          {title}
        </Text>
        <Text scale='tiny' weight='normal' align='right'>
          {description}
        </Text>
      </OptionWrapper>
    </Container>
  )
}
