import React from 'react'
import cookies from 'next-cookies'
import {Provider} from 'react-redux'

import StoreRepo from '@redux'
import {ReduxComponent} from '@root/types'
import getSubscriber from '../Subscriber'

const subscribeStore = getSubscriber()

const Redux: ReduxComponent = ({initialState, children}) => {
  const store = StoreRepo.initiate(initialState)
  subscribeStore(store)
  return <Provider store={store}>{children}</Provider>
}

Redux.getInitialProps = async ctx => {
  const {isServer} = ctx

  const allCookies = isServer ? cookies(ctx) : undefined
  const store = StoreRepo.get(isServer, allCookies)
  ctx.store = store
}

export default Redux
