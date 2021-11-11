import React from 'react'
import styled from 'styled-components'
import {Text, FlexBox, Switch} from '@sf/design-system'
import {rem} from 'polished'

interface RadioCardProps {
  title: string
  description?: string
  logo: any
  isActive?: boolean
  onClick: Function
}

const Container = styled(FlexBox)<{description: string | undefined}>`
  box-sizing: border-box;
  width: 100%;
  height: ${({theme, description}) =>
    description ? theme.spacing[8] : theme.spacing[7]};
  border-radius: ${rem(6)};

  > {
    &:first-child {
      margin-left: 12px;
    }
  }
`
const Content = styled(FlexBox)`
  > {
    &:first-child {
      margin-left: ${({theme}) => theme.spacing[2]};
    }
  }
`

const RadioCard: React.FC<RadioCardProps> = (props: RadioCardProps) => {
  const {title, description, isActive, onClick} = props

  return (
    <Container
      alignItems='center'
      justify='space-between'
      description={description}
    >
      <Content alignItems='center'>
        <props.logo width={24} height={24} />
        <FlexBox direction='column'>
          <Text scale='body' weight='bold' margin='0 0 5px 0'>
            {title}
          </Text>
          {description && (
            <Text scale='body' as='span' colorName='carbon' colorWeight='light'>
              {description}
            </Text>
          )}
        </FlexBox>
      </Content>

      <Switch
        onChange={() => onClick()}
        name='description'
        checked={isActive}
      />
    </Container>
  )
}

export default React.memo(RadioCard)
