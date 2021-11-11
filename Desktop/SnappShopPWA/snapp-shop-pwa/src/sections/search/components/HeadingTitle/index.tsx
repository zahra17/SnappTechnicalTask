import {useHeadingTitleContext} from '@contexts/HeadingTitle'
import {useRouter} from 'next/router'
import {rem} from 'polished'
import React from 'react'
import styled from 'styled-components'
const HeadText = styled.h1`
  margin-top: 32px;
  margin-right: 20px;
  margin-bottom: 0;
  color: #676a70;
  font-size: ${rem(20)};
`
const HeadingTitle = () => {
  const {title} = useHeadingTitleContext()
  const router = useRouter()
  const isNear = router.asPath.includes('near')
  return <div>{title && !isNear && <HeadText>{title}</HeadText>}</div>
}

export default HeadingTitle
