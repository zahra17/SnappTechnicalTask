import React from 'react'
import styled from 'styled-components'
import {rem} from 'polished'
import {Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore, {Navigation} from 'swiper'

import {Button, ChevronRightIcon, ChevronLeftIcon} from '@sf/design-system'

const List = styled.div`
  position: relative;

  > * {
    padding-bottom: ${rem(32)};
  }
`
const Handle = styled.div<{visible: boolean}>`
  position: absolute;
  top: 55%;
  bottom: 0;
  z-index: 3;
  height: ${rem(32)};
  transform: ${({visible}) => (visible ? 'scale(1)' : 'scale(0)')};
  opacity: ${({visible}) => (visible ? 1 : 0)};
  transition: all 500ms ease-in-out;
`

const RightHandle = styled(Handle)`
  right: ${rem(-24)};
`
const LeftHandle = styled(Handle)`
  left: ${rem(-24)};
`

SwiperCore.use([Navigation])

export const ListView: React.FC<{listId: string; showMore?: boolean}> = ({
  children,
  listId = 'something',
  showMore = true,
}) => {
  const [showHandle, setShowHandle] = React.useState({
    right: false,
    left: showMore,
  })
  return (
    <List>
      <Swiper
        dir='rtl'
        navigation={{
          prevEl: `${RightHandle.toString()}.${listId}`,
          nextEl: `${LeftHandle.toString()}.${listId}`,
        }}
        breakpoints={{
          0: {
            slidesPerView: 3,
            slidesPerGroup: 3,
          },
          1288: {
            slidesPerView: 4,
            slidesPerGroup: 4,
          },
        }}
        spaceBetween={16}
        slidesPerView={4}
        slidesPerGroup={4}
        loopFillGroupWithBlank
        onSlideChange={swiper => {
          const {isBeginning, isEnd} = swiper
          if (showMore)
            setShowHandle({
              right: !isBeginning,
              left: !isEnd,
            })
        }}
      >
        {React.Children.map(children, (child, idx) => (
          <SwiperSlide key={idx}>{child}</SwiperSlide>
        ))}
      </Swiper>
      <RightHandle visible={showHandle.right} className={listId}>
        <Button appearance='outline' float round size='large'>
          <ChevronRightIcon fill='var(--sf-accent-main)' />
        </Button>
      </RightHandle>
      <LeftHandle visible={showHandle.left} className={listId}>
        <Button appearance='outline' float round size='large'>
          <ChevronLeftIcon fill='var(--sf-accent-main)' />
        </Button>
      </LeftHandle>
    </List>
  )
}
