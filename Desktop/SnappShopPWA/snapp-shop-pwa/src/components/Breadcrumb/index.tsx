import {ChevronLeftIcon, FlexBox, Text} from '@sf/design-system'
import Link from 'next/link'
import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {rem} from 'polished'
import {useBreadcrumb} from '@contexts/Breadcrumb'
import {IBreadcrumb} from '~search/types/breadcrumb'

const BreadcrumbWrapper = styled(FlexBox)`
  margin-top: ${rem(25)};
  padding-right: ${rem(20)};
`
const BreadCrumbLink = styled(FlexBox)`
  margin-left: ${rem(10)};
  cursor: pointer;
`
const BreadCrumbText = styled(Text)`
  margin-left: ${rem(4)};
`
function Breadcrumb() {
  const [crumbs, setCrumbs] = useState<(IBreadcrumb | undefined)[]>([])
  const breadcrumbs = useBreadcrumb()
  useEffect(() => {
    setCrumbs(breadcrumbs.crumbs.filter(item => item?.title))
  }, [breadcrumbs])
  return (
    <BreadcrumbWrapper alignItems='center'>
      {crumbs.length > 1
        ? crumbs.map((item, index) =>
            index < crumbs.length - 1 ? (
              <Link href={item?.path ?? '/'} key={index}>
                <BreadCrumbLink alignItems='center'>
                  <BreadCrumbText
                    scale='tiny'
                    colorName='inactive'
                    colorWeight='dark'
                  >
                    {item?.title}
                  </BreadCrumbText>
                  <ChevronLeftIcon width={5} fill='var(--sf-inactive-dark)' />
                </BreadCrumbLink>
              </Link>
            ) : (
              <FlexBox key={index}>
                <Text scale='tiny' colorName='carbon' colorWeight='light'>
                  {item?.title}
                </Text>
              </FlexBox>
            )
          )
        : null}
    </BreadcrumbWrapper>
  )
}

export default Breadcrumb
