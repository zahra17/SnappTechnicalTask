import React, {useEffect, useRef} from 'react'
import styled from 'styled-components'
import {Text, FlexBox} from '@sf/design-system'
import {Suggestion} from '@schema/location'
import {useRudderStack} from '@contexts/RudderStack'
import {eventTypes} from '@schema/rudderStack'
import debounce from 'lodash/debounce'

interface SuggestionListProps {
  suggestList: any
  onClick: (id: string) => void
  isActive: boolean
}

const Layout = styled(FlexBox)`
  position: absolute;
  left: 30px;
  z-index: 1100;
  width: calc(100% - 120px);
  height: auto;
  max-height: 40vh;
  padding: 0 0.5rem;
  overflow-y: scroll;
  background-color: #fff;
  box-shadow: ${({theme}) => theme.shadows.medium};
  transition: all 0.3s linear;
`

const Item = styled.button`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: 3.5rem;
  padding: 0 1rem;
  font-family: 'IRANSansMobile', Arial, Helvetica, sans-serif;
  background-color: unset;
  border: unset;
  border-bottom: 1px solid #ddd;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`

const SuggestionList = ({
  suggestList,
  onClick,
  isActive,
}: SuggestionListProps) => {
  const rudderStack = useRudderStack()
  const onItemClicked = (item: Suggestion) => {
    onClick(item.id)
    rudderStack.eventTrigger({
      type: eventTypes.track,
      eventName: 'Searched neighborhood',
      payload: {
        query: item.name,
      },
    })
  }

  return (
    <Layout direction='column' style={{height: isActive ? 'auto' : 0}}>
      {suggestList.map((item: Suggestion) => (
        <Item key={item.id} onClick={debounce(() => onItemClicked(item), 100)}>
          <Text
            scale='body'
            weight='bold'
            colorName='carbon'
            margin='0 0 0 0.5rem'
          >
            {item.name}
          </Text>
          <Text
            scale='body'
            weight='normal'
            colorName='inactive'
            colorWeight='dark'
            ellipsis
          >
            {item.description}
          </Text>
        </Item>
      ))}
    </Layout>
  )
}

export default React.memo(SuggestionList)
