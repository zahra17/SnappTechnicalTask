import React from 'react'
import styled from 'styled-components'
import {rem} from 'polished'
import {FlexBox, Text, ChevronLeftIcon} from '@sf/design-system'
import {Img} from '@components/Img'
import {Cuisine} from '~search/types'
interface Props {
  cuisine: Cuisine
}
const CuisineBox = styled(FlexBox)`
  position: relative;
  height: ${rem(95)};
  padding: ${rem(3)};
  background-color: ${({theme}) => theme.surface.light};
  border: 1px solid ${({theme}) => theme.surface.light};
  border-radius: ${rem(12)};
  box-shadow: ${({theme}) => theme.shadows.high};
  cursor: pointer;
  transition: all 200ms ease-in-out;

  &:hover {
    box-shadow: ${({theme}) => theme.shadows.medium};
  }

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
  }
`
const CuisineText = styled(FlexBox)`
  position: absolute;
  right: 0;
  bottom: 0;
  padding: ${rem(4)} ${rem(16)} ${rem(4)} ${rem(13)};
  background-color: inherit;
  border-top-left-radius: ${rem(12)};
  border-bottom-right-radius: ${rem(12)};
  transition: all 200ms ease-in-out;

  > *:not(svg) {
    margin-left: ${rem(13)};
  }

  > svg {
    transform: translateX(0);
    transition: all 200ms ease-in-out;
  }

  &:hover {
    svg {
      transform: translateX(-2px);
    }
  }
`

export const CuisineItem: React.FC<Props> = ({cuisine}) => (
  <CuisineBox>
    <Img src={cuisine.icon} alt={cuisine.title} />
    <CuisineText alignItems='center'>
      <Text scale='default'>{cuisine.title}</Text>
      <ChevronLeftIcon
        width='6.58'
        height='11.17'
        fill='var(--sf-accent-main)'
      />
    </CuisineText>
  </CuisineBox>
)
