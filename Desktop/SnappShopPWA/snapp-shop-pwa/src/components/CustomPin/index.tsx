import React, {FC} from 'react'
import styled from 'styled-components'

const Container = styled.div`
  &:hover {
    > {
      &:last-child {
        max-width: initial;
      }
    }
  }
`
const SVG = styled.svg`
  position: relative;
`
const VendorName = styled.p`
  position: absolute;
  top: -9px;
  right: 6px;
  box-sizing: border-box;
  max-width: 120px;
  height: 32px;
  padding: 5px 33px 5px 3px;
  overflow: hidden;
  color: #3a3d42;
  font-weight: 700;
  font-size: 14px;
  font-family: 'IRANSansMobile', Arial, Helvetica, sans-serif;
  white-space: nowrap;
  text-align: center;
  text-overflow: ellipsis;
  background: var(--white);
  border-radius: 8px;
`

const CustomPin: FC<{vendorName: string}> = ({vendorName}) => {
  return (
    <Container>
      <SVG
        width='132'
        height='57'
        viewBox='0 0 132 57'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <rect
          opacity='0.1'
          x='105'
          y='47'
          width='10'
          height='10'
          rx='5'
          fill='#181B1F'
        />
        <path
          d='M109 22C109 21.4477 109.448 21 110 21C110.552 21 111 21.4477 111 22V52C111 52.5523 110.552 53 110 53C109.448 53 109 52.5523 109 52V22Z'
          fill='#181B1F'
        />
        <g filter='url(#filter0_d)'>
          {/* <rect x='6' y='5' width='120' height='32' rx='7' fill='white' /> */}
          <rect x='96' y='7' width='28' height='28' rx='5' fill='#FF00A6' />
          <path
            d='M116.01 13.5351C119.33 16.9153 119.33 22.3957 116.01 25.7759L111.503 30.3662C110.673 31.2113 109.327 31.2113 108.497 30.3662L103.99 25.7759C100.67 22.3957 100.67 16.9153 103.99 13.5351C107.309 10.155 112.691 10.155 116.01 13.5351ZM110 15.8369C107.929 15.8369 106.25 17.5466 106.25 19.6555C106.25 21.7645 107.929 23.4742 110 23.4742C112.071 23.4742 113.75 21.7645 113.75 19.6555C113.75 17.5466 112.071 15.8369 110 15.8369Z'
            fill='white'
          />
        </g>
        <defs>
          <filter
            id='filter0_d'
            x='0'
            y='0'
            width='132'
            height='44'
            filterUnits='userSpaceOnUse'
            colorInterpolationFilters='sRGB'
          >
            <feFlood floodOpacity='0' result='BackgroundImageFix' />
            <feColorMatrix
              in='SourceAlpha'
              type='matrix'
              values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'
            />
            <feOffset dy='1' />
            <feGaussianBlur stdDeviation='3' />
            <feColorMatrix
              type='matrix'
              values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0'
            />
            <feBlend
              mode='normal'
              in2='BackgroundImageFix'
              result='effect1_dropShadow'
            />
            <feBlend
              mode='normal'
              in='SourceGraphic'
              in2='effect1_dropShadow'
              result='shape'
            />
          </filter>
        </defs>
      </SVG>
      <VendorName>{vendorName}</VendorName>
    </Container>
  )
}

export default CustomPin
