import * as Sentry from '@sentry/react'

import {AppStore} from '@redux'
import {selectUser} from '@slices/core'
import appConfig from '@configs'

const enrichSentry = (store: AppStore) => {
  // setup user id
  store.subscribe(() => {
    const state = store.getState()
    const user = selectUser(state)
    if (user) Sentry.setUser({id: `${user.id}`})
    else Sentry.configureScope(scope => scope.setUser(null))
  })

  //set client
  Sentry.setContext('client', {
    version: appConfig.VERSION,
    client: appConfig.CLIENT,
    uuid: appConfig.UUID,
  })
}

export default enrichSentry
