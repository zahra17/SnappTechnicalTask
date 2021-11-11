import {useCallback, useEffect} from 'react'
import {connect as connectToMQTT} from 'mqtt'

import {
  MQTT_CONNECTION_LINK,
  PRIMARY_STATE,
  SUBSCRIPTION_LINK,
} from '~order/constants'

interface params {
  orderCode: string
  primaryState?: number
  username?: string
  token?: string
}

const useMQTT = (
  getOrderStatus: Function,
  {orderCode, primaryState, token, username}: params
) => {
  const canSubscribe = useCallback(status => {
    return PRIMARY_STATE.FINISHED !== +status
  }, [])

  const subscribeToOrder = (username: string, password: string) => {
    const options = {
      username,
      password,
      clean: true,
      connectTimeout: 5000,
      keepalive: 60,
      maxAttempts: 10,
    }
    const client = connectToMQTT(MQTT_CONNECTION_LINK, options)

    const subscriptionLink = SUBSCRIPTION_LINK + orderCode
    const onError = (error: unknown) =>
      !!error && console.error('MQTT Error', error)

    client.on('connect', () => client.subscribe(subscriptionLink, onError))

    client.on('message', getOrderStatus)

    client.on('error', (_: unknown, error: unknown) => onError(error))
  }

  useEffect(() => {
    if (!primaryState) return

    if (canSubscribe(primaryState) && username && token)
      subscribeToOrder(username, token)
  }, [primaryState])
}

export default useMQTT
