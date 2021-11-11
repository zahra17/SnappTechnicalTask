import styled from 'styled-components'
import {rem} from 'polished'
import {fontStyles} from '@sf/design-system'

export const SearchInput = styled.input`
  box-sizing: border-box;
  width: 31vw;
  height: ${rem(48)};
  padding: ${rem(12)};
  padding-right: ${rem(40)};
  color: ${({theme}) => theme.carbon.main};
  border: ${rem(1)} solid ${({theme}) => theme.carbon.alphaHigh};
  border-radius: ${rem(10)};
  ${fontStyles({scale: 'default', weight: 'normal', lh: 'default'})}

  &::placeholder {
    color: ${({theme}) => theme.inactive.dark};
  }

  &:focus {
    outline: none;
  }
`
