import React, {useEffect, useRef} from 'react'

const placeholderSrc = '/static/images/placeholder.png'
export const Img: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({
  src,
  alt,
  ...props
}) => {
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    // catch error event once
    imgRef.current?.addEventListener(
      'error',
      () => {
        if (imgRef.current) {
          imgRef.current.src = placeholderSrc
        }
      },
      {once: true}
    )
  }, [])

  return <img ref={imgRef} alt={alt} src={src || placeholderSrc} {...props} />
}
