import styled from 'styled-components'
import {rem} from 'polished'
import {bks, FlexBox} from '@sf/design-system'

export const SearchBox = styled(FlexBox)`
  position: absolute;
  right: 0;
  left: 0;
  box-sizing: border-box;
  width: 31vw;
  height: ${rem(48)};
  margin: auto;
  padding: ${({theme}) => theme.spacing[2]};
  background-color: ${({theme}) => theme.surface.dark};
  border-radius: ${rem(10)};

  ${bks.down('sm')} {
    width: ${rem(300)};
  }

  > * {
    margin-left: ${({theme}) => theme.spacing[1]};
  }
`
