import React from 'react'
import styled from 'styled-components'
import {rem} from 'polished'
import {Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore, {Navigation} from 'swiper'

import {
  Button,
  ChevronRightIcon,
  ChevronLeftIcon,
  ButtonSizes,
} from '@sf/design-system'

interface Props {
  listId: string
  showMore?: boolean
  slidesPerView?: number | 'auto'
  buttonSize?: ButtonSizes
}

const List = styled.div`
  position: relative;
`
const Handle = styled.div<{visible: boolean}>`
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 3;
  height: ${rem(32)};
  margin: auto 0;
  transform: ${({visible}) => (visible ? 'scale(1)' : 'scale(0)')};
  opacity: ${({visible}) => (visible ? 1 : 0)};
  transition: all 500ms ease-in-out;
`

const RightHandle = styled(Handle)`
  right: ${rem(-8)};
`
const LeftHandle = styled(Handle)`
  left: ${rem(2)};
`

SwiperCore.use([Navigation])

export const ListView: React.FC<Props> = ({
  children,
  listId = 'something',
  showMore = true,
  slidesPerView = 4,
  buttonSize = 'default',
}) => {
  const [showHandle, setShowHandle] = React.useState({
    right: false,
    left:
      typeof slidesPerView === 'number'
        ? showMore && React.Children.count(children) > Math.floor(slidesPerView)
        : showMore,
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
          },
          1288: {
            slidesPerView: slidesPerView,
          },
        }}
        spaceBetween={16}
        slidesPerView={slidesPerView}
        loopFillGroupWithBlank
        onSlideChange={swiper => {
          const {isBeginning, isEnd} = swiper
          if (showMore)
            setShowHandle({
              right: !isBeginning,
              left: !isEnd,
            })
        }}
        onReachEnd={swiper => {
          if (slidesPerView === 'auto') {
            const {isBeginning} = swiper
            setShowHandle({
              right: !isBeginning,
              left: false,
            })
          }
        }}
      >
        {React.Children.map(children, (child, idx) => (
          <SwiperSlide
            key={idx}
            style={slidesPerView === 'auto' ? {width: 'auto'} : {}}
          >
            {child}
          </SwiperSlide>
        ))}
      </Swiper>
      <RightHandle visible={showHandle.right} className={listId}>
        <Button appearance='outline' float round size={buttonSize}>
          <ChevronRightIcon fill='var(--sf-accent2-main)' />
        </Button>
      </RightHandle>
      <LeftHandle visible={showHandle.left} className={listId}>
        <Button appearance='outline' float round size={buttonSize}>
          <ChevronLeftIcon fill='var(--sf-accent2-main)' />
        </Button>
      </LeftHandle>
    </List>
  )
}
