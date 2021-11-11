import React, {useEffect} from 'react'
import {useRouter} from 'next/router'
import {useSelector} from 'react-redux'

import {selectUser} from '@slices/core'
import {SimplePageComponent} from '../types'
import extractProps from '../helpers'

type PComponent<S> = SimplePageComponent<S | undefined>

function ProtectRoute<S>(Component: PComponent<S>) {
  const Protected: PComponent<S> = props => {
    const router = useRouter()
    const user = useSelector(selectUser)

    useEffect(() => {
      if (!user) router.push(`/?login=1&referrer=${router.asPath}`)
    }, [user])

    return <Component {...props} />
  }

  Protected.getInitialProps = async ctx => {
    const state = ctx.store.getState()
    const user = selectUser(state)
    if (ctx.isServer && !user) {
      ctx
        .res!.writeHead(301, {
          Location: `/?login=1&referrer=${ctx.req!.url}`,
        })
        .end()
      return
    }
    const props = await extractProps(Component, ctx)
    return props
  }

  return Protected
}

export default ProtectRoute
