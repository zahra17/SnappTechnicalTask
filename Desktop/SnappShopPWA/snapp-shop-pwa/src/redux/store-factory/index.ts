import * as Sentry from '@sentry/react'
import {
  Reducer,
  configureStore,
  combineReducers,
  AnyAction,
} from '@reduxjs/toolkit'

import {Cookies} from '@root/types'
import {
  Reducers,
  ReducersMap,
  NamespaceKey,
  ReducerManager,
  StoreShape,
} from '../store-types'

type StoreArgs = {
  rootReducer: Reducers
  initialState?: StoreShape
  cookies?: Cookies
}

export const helpers = {
  resolveModule(section: string, name: string) {
    // const module = require(`../../sections/${section}/redux/${name}`)
    const module = {default: {reducer: null}}
    return module.default as any
  },
  syncReducersWithState(reducers: Reducers, state?: StoreShape) {
    for (const key in state) {
      if (!(key in reducers)) {
        const [section, name] = key.split('/')
        const module = this.resolveModule(section, name)
        const reducer = module.reducer as Reducer
        reducers[key as NamespaceKey] = reducer
      }
    }
    return reducers as ReducersMap
  },
}

const createStore = ({rootReducer, initialState, cookies}: StoreArgs) => {
  let keysToRemove: string[] = []

  const reducers = helpers.syncReducersWithState(rootReducer, initialState)

  let combinedReducer = combineReducers(reducers)

  const reduce = (state: any, action: AnyAction) => {
    const newState = {...state}
    if (keysToRemove.length > 0) {
      for (const key of keysToRemove) {
        delete newState[key as keyof StoreShape]
      }
      keysToRemove = []
    }

    return combinedReducer(newState, action)
  }

  const store = configureStore({
    reducer: reduce,
    preloadedState: initialState,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({thunk: {extraArgument: {cookies}}}),
    enhancers: defaultEnhancers =>
      defaultEnhancers.concat(Sentry.createReduxEnhancer({})),
  })

  const reducerManager: ReducerManager = {
    getReducerMap: () => reducers,

    getCombinedReducer: () => combinedReducer,

    reduce: (state, action) => reduce(state, action),

    add: newReducers => {
      for (const key in newReducers) {
        if (!reducers[key as NamespaceKey]) {
          const newReducer = newReducers[key as NamespaceKey]!
          reducers[key as NamespaceKey] = newReducer as any
        }
      }
      combinedReducer = combineReducers(reducers)
    },

    remove: keys => {
      keys.forEach(key => {
        const stateKey = key
        if (!key || !reducers[stateKey]) return
        delete reducers[stateKey]
        keysToRemove.push(stateKey)
      })
      combinedReducer = combineReducers(reducers)
    },
  }

  return {store, reducerManager}
}

function setupReducerManager<Store>(store: Store, manager: ReducerManager) {
  const storeWithManager: Store & {reducerManager?: ReducerManager} = store
  storeWithManager.reducerManager = manager
  return storeWithManager
}

const getStore = (args: StoreArgs) => {
  const {store, reducerManager} = createStore(args)
  return setupReducerManager(store, reducerManager)
}

export default getStore
