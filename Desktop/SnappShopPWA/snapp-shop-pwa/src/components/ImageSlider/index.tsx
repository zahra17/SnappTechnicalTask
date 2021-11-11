import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {rem} from 'polished'
import {FlexBox} from '@sf/design-system'
import {Image} from '@schema/image'
import {Img} from '@components/Img'

interface Props {
  width: number
  height: number
  alt: string
  images?: Image[]
}

const ImageSliderWrapper = styled.div`
  max-width: ${rem(280)};

  img {
    border-radius: ${rem(8)};
  }
`

const ImageItem = styled.div<{isActive: boolean}>`
  margin: ${rem(6)} 0 0 ${rem(8)};
  cursor: pointer;

  &:nth-child(6n) {
    margin-left: 0;
  }

  img {
    opacity: ${({isActive}) => (isActive ? '1' : '0.7')};
  }
`

export const ImageSlider: React.FC<Props> = ({width, height, images, alt}) => {
  const [productImage, setProductImage] = useState<Partial<Image>>({})

  useEffect(() => {
    if (images && images.length) {
      setProductImage(images[0])
    }
  }, [])

  const showProductImage = (img: Image) => {
    setProductImage(img)
  }

  return (
    <ImageSliderWrapper>
      <Img
        src={productImage.imageSrc}
        alt={alt}
        width={width}
        height={height}
      />
      <FlexBox wrap='wrap'>
        {!!images &&
          images.length > 1 &&
          images.map(imgThumb => (
            <ImageItem
              isActive={imgThumb.imageId === productImage.imageId}
              key={imgThumb.imageId}
            >
              <Img
                onClick={() => showProductImage(imgThumb)}
                src={imgThumb.imageSrc}
                id={String(imgThumb.imageId)}
                alt={alt}
                width='40'
                height='40'
              />
            </ImageItem>
          ))}
      </FlexBox>
    </ImageSliderWrapper>
  )
}
