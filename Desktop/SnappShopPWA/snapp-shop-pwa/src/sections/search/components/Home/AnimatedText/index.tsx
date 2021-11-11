import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {rem} from 'polished'
import {FlexBox, Text} from '@sf/design-system'
import useInterval from '@hooks/useInterval'

interface Props {
  texts: string[]
}

const TextsListView = styled(FlexBox)`
  --view-height: ${rem(60)};
  display: inline-block;
  height: var(--view-height);
  margin-right: ${({theme}) => theme.spacing[1]};
  overflow: hidden;
`
const TextsList = styled(FlexBox)`
  > * {
    display: flex;
    align-items: center;
    height: var(--view-height);
  }
`

export const AnimatedTexts: React.FC<Props> = ({texts = []}) => {
  const [textIndex, setTextIndex] = useState(0)

  useInterval(
    () => {
      setTextIndex((textIndex + 1) % texts.length)
    },
    textIndex === 0 ? 0 : 2000
  )

  return (
    <TextsListView alignItems='center'>
      <TextsList
        direction='column'
        style={{
          transform: `translateY(-${textIndex * 60}px)`,
          transition: `${
            textIndex === 0 ? '0ms' : '400ms'
          } cubic-bezier(0.64, 0.57, 0.67, 1.53) `,
        }}
      >
        {texts.map((text, idx) => (
          <Text
            as='p'
            key={String(text + idx)}
            scale='xlarge'
            weight='bold'
            colorName='accent'
            lh='xlarge'
            family='snapweb'
            style={{
              fontSize: '40px',
              opacity: idx === textIndex ? 1 : 0,
              transition: `${
                textIndex === 0 ? '0ms' : '200ms'
              } cubic-bezier(0.64, 0.57, 0.67, 1.53) `,
            }}
          >
            {text}
          </Text>
        ))}
      </TextsList>
    </TextsListView>
  )
}
