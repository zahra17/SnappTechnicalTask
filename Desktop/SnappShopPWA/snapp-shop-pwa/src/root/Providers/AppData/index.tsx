import React, {useEffect, useRef} from 'react'
import {useSelector} from 'react-redux'
import cookies from 'next-cookies'

import {useAppDispatch} from '@redux'
import {
  getLoadData,
  selectAddresses,
  selectAppData,
  selectUser,
} from '@slices/core'
import {SimplePageComponent} from '@root/types'
import {Modes} from '@schema/location'
import {setActive as setActiveAction} from '~growth/redux/location'

import {fetchServices} from '~search/redux/services'
import {getPendingOrders, selectPendingOrder} from '~order/redux/pendingOrders'
import {CookiesRecord, CookyLocation, isCookyLocation} from '@schema/location'
import {EVENT_TYPES} from '@utils'

const AppDataProvider: SimplePageComponent = ({children}) => {
  const dispatch = useAppDispatch()
  const appData = useSelector(selectAppData)
  const pendingOrder = useSelector(selectPendingOrder)
  const user = useSelector(selectUser)
  const isTokenResolved = useRef(false)

  useEffect(() => {
    if (!appData) dispatch(getLoadData({}))
    if (user && !pendingOrder) dispatch(getPendingOrders({}))
  }, [user])

  useEffect(() => {
    const handleTokenSuccessEvent = () => {
      if (!isTokenResolved.current) {
        if (!user || !appData) dispatch(getLoadData({}))
        if (user && !pendingOrder) dispatch(getPendingOrders({}))
        isTokenResolved.current = true
      }
    }
    window.addEventListener(EVENT_TYPES.TOKEN_SUCCESS, handleTokenSuccessEvent)
  }, [user])

  return <>{children}</>
}

AppDataProvider.getInitialProps = async ctx => {
  const {isServer, store} = ctx

  if (isServer) {
    const allCookies = cookies(ctx)
    const cookiesData = allCookies as CookiesRecord

    await store.dispatch(getLoadData({}))
    await store.dispatch(fetchServices({}))
    await store.dispatch(getPendingOrders({}))
    const addresses = selectAddresses(store.getState())
    let activeLocation: CookyLocation = {
      id: '-1',
      latitude: -1,
      longitude: -1,
      mode: Modes.Auto,
    }
    if (isCookyLocation(cookiesData.location)) {
      activeLocation = {
        id: cookiesData.location?.id || '',
        latitude: cookiesData.location?.latitude,
        longitude: cookiesData.location?.longitude,
        mode: cookiesData.location?.mode || Modes.Auto,
      }
      store.dispatch(setActiveAction(activeLocation))
    } else if (addresses) {
      const [firstAddress] = addresses
      activeLocation = {
        id: firstAddress.id,
        latitude: firstAddress.id,
        longitude: firstAddress.longitude,
        mode: Modes.Address,
      }
      store.dispatch(setActiveAction(activeLocation))
    }
    ctx.activeLocation = activeLocation
  }
  return {}
}

export default AppDataProvider
