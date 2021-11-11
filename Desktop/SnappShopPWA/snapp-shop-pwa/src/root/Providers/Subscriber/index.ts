import {AppStore} from '@redux'
import enrichSentry from '@extensions/sentry'
import ShellSDk from '@extensions/shellSDK/index'

const getSubscriber = () => {
  let initiated = false

  return (store: AppStore) => {
    if (initiated) return
    initiated = true

    enrichSentry(store)
    ShellSDk.setup(store)
    // kepler.setup(store)
    // chat.setup(store)
  }
}

export default getSubscriber
