import React, {memo, useMemo} from 'react'
import {useRouter} from 'next/router'
import {QueryParamProvider as ContextProvider} from 'use-query-params'
import {QueryComponent} from '@root/types'

const QueryParamProviderComponent: QueryComponent = (props: {
  children?: React.ReactNode
}) => {
  const {children, ...rest} = props
  const router = useRouter()
  const match = router.asPath.match(/[^?]+/)
  const pathname = match ? match[0] : router.asPath

  const location = useMemo(
    () =>
      process.browser
        ? window.location
        : ({
            search: router.asPath.replace(/[^?]+/u, ''),
          } as Location),
    [router.asPath, router.query]
  )

  const history = useMemo(
    () => ({
      push: ({search}: Location) => {
        router.push(
          {pathname: router.pathname, query: router.query},
          {search: search, pathname},
          {shallow: true}
        )
      },
      replace: ({search}: Location) => {
        router.replace(
          {pathname: router.pathname, query: router.query},
          {search: search, pathname},
          {shallow: true}
        )
      },
    }),
    [pathname, router.pathname, router.query, location.pathname]
  )

  return (
    <ContextProvider
      key={String(Object.values(router.query || {}))}
      {...rest}
      history={history}
      location={location}
    >
      {children}
    </ContextProvider>
  )
}

export const QueryParamProvider = memo(
  QueryParamProviderComponent
) as QueryComponent

QueryParamProvider.getInitialProps = async ctx => {}
