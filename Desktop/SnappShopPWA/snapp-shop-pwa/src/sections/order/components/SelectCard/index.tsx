import React from 'react'
import styled from 'styled-components'
import {Text, Checkbox, FlexBox, SVGIcon} from '@sf/design-system'
import {rem} from 'polished'

import {Address} from '@schema/address'
import {Img} from '@components/Img'

interface SelectCardProps {
  id: Address['id']
  title: string
  description?: string
  logo: string | SVGIcon
  isActive?: boolean
  disabled?: boolean
  disabledReason?: string
  onClick: (id: Address['id']) => void
}

const Container = styled(FlexBox)<{
  isActive: boolean | undefined
  disabled: boolean | undefined
}>`
  > {
    &:first-child {
      position: relative;
      justify-content: space-between;
      box-sizing: border-box;
      width: 100%;
      height: ${({theme}) => theme.spacing[9]};
      margin-bottom: ${({theme}) => theme.spacing[2]};
      padding: 0 ${({theme}) => theme.spacing[2]} 0
        ${({theme}) => theme.spacing[2]};
      background-color: ${({disabled, theme}) =>
        disabled ? theme.surface.dark : 'transparent'};
      border: 1px solid
        ${({isActive, disabled, theme}) =>
          disabled
            ? theme.surface.dark
            : isActive
            ? theme.accent2.main
            : theme.carbon.alphaLight};
      border-radius: ${rem(6)};
      cursor: ${({disabled}) => (disabled ? 'default' : 'pointer')};
      transition: border 0.3ms ease-in-out;
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
const DisabledMsg = styled(Text)`
  position: absolute;
  left: ${rem(12)};
  padding: ${rem(4)};
  background-color: ${({theme}) => theme.inactive.light};
  border-radius: ${rem(4)};
`

const Image = styled(Img)`
  width: 24px;
  height: 24px;
`

const SelectCard: React.FC<SelectCardProps> = (props: SelectCardProps) => {
  const {
    id,
    title,
    logo,
    description,
    isActive,
    disabled,
    disabledReason,
    onClick,
  } = props

  return (
    <Container
      alignItems='center'
      justify='space-between'
      isActive={isActive}
      disabled={disabled}
    >
      <Checkbox
        disabled={disabled}
        checked={isActive}
        name='description'
        onChange={() => !disabled && onClick(id)}
        round
        dir='ltr'
      >
        <Content alignItems='center'>
          {typeof logo === 'string' ? (
            <Image src={logo} />
          ) : (
            <props.logo width={24} height={24} />
          )}
          <FlexBox direction='column'>
            <Text scale='body' weight='bold' margin='0 0 5px 0'>
              {title}
            </Text>
            {description && (
              <Text
                scale='body'
                as='span'
                colorName='carbon'
                colorWeight='light'
              >
                {description}
              </Text>
            )}
          </FlexBox>
        </Content>
        {disabled && (
          <DisabledMsg
            scale='caption'
            as='span'
            colorName='inactive'
            colorWeight='dark'
          >
            {disabledReason}
          </DisabledMsg>
        )}
      </Checkbox>
    </Container>
  )
}

export default React.memo(SelectCard)
