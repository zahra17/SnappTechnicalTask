import React from 'react'
import {rem} from 'polished'
import {Img} from '@components/Img'
import styled from 'styled-components'
import {FlexBox} from '@sf/design-system'

interface Props {
  src?: string
  alt?: string
}
const Logo = styled(FlexBox)`
  position: relative;
  width: ${rem(88)};
  height: ${rem(88)};
  background-color: ${({theme}) => theme.surface.light};
  border-radius: ${rem(12)};
  box-shadow: ${({theme}) => theme.shadows.high};

  img {
    border: 1px solid ${({theme}) => theme.carbon.alphaLight};
    border-radius: ${rem(12)};
  }
`
export const VendorLogo: React.FC<Props> = ({src, alt, children, ...props}) => {
  return (
    <Logo justify='center' alignItems='center' {...props}>
      <Img src={src} alt={alt} width='80' height='80' />
      {children}
    </Logo>
  )
}
