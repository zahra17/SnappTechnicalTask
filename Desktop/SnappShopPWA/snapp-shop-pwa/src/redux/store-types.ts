import {
  Reducer,
  AnyAction,
  CombinedState,
  ReducersMapObject,
  AsyncThunk,
} from '@reduxjs/toolkit'
import {ThunkAction} from 'redux-thunk'

import {Cookies} from '@root/types'
import {CoreState} from './slices/core'
import {BasketsState, BasketsAction, BasketsAPI} from './slices/baskets'

import {VendorsListState} from '~search/redux/vendorsList'
import {VendorState} from '~menu/redux/vendor'
import {SearchState} from '~search/redux/search'
import {ProductsState} from '~search/redux/products'
import {ZooketState} from '~menu/redux/zooket'
import {LocationState, LocationActions} from '~growth/redux/location'
import {ServicesState} from '~search/redux/services'
import {HomeDataState} from '~search/redux/home'
import {PendingOrderState} from '~order/redux/pendingOrders'
import {ReorderState} from '~order/redux/reorders'

export type StoreShape = {
  core: CoreState
  baskets: BasketsState
  'baskets-api': BasketsAPI
  location: LocationState
  'search/services': ServicesState
  'order/pendingOrders': PendingOrderState
  'order/reorders': ReorderState
  'search/vendorsList': VendorsListState
  'search/search': SearchState
  'search/products': ProductsState
  'menu/vendor': VendorState
  'menu/zooket': ZooketState
  'search/home': HomeDataState
}

export type Reducers = {
  core: Reducer<CoreState, AnyAction>
  baskets: Reducer<BasketsState, BasketsAction>
  'baskets-api': Reducer<BasketsAPI, AnyAction>
  location: Reducer<LocationState, LocationActions>
  'order/pendingOrders': Reducer<PendingOrderState, AnyAction>
  'order/reorders': Reducer<ReorderState, AnyAction>
  'search/services': Reducer<ServicesState, AnyAction>
  'search/vendorsList': Reducer<VendorsListState, AnyAction>
  'search/search': Reducer<SearchState, AnyAction>
  'search/products': Reducer<ProductsState, AnyAction>
  'menu/vendor': Reducer<VendorState, AnyAction>
  'menu/zooket': Reducer<ZooketState, AnyAction>
  'search/home': Reducer<HomeDataState, AnyAction>
}

export type ReducersMap = ReducersMapObject<StoreShape, AnyAction>

export type NamespaceKey = keyof StoreShape

export type CombinedReducer = Reducer<CombinedState<StoreShape>, AnyAction>

export interface ReducerManager {
  getReducerMap: () => ReducersMap
  getCombinedReducer: () => CombinedReducer
  reduce: (state: any, action: AnyAction) => ReturnType<CombinedReducer>
  add: (reducers: Partial<Reducers>) => void
  remove: (keys: NamespaceKey[]) => void
}

export type ExtraArgs = {cookies?: Cookies}

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  StoreShape,
  ExtraArgs,
  AnyAction
>
export type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>
export type PendingAction = ReturnType<GenericAsyncThunk['pending']>
export type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
export type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>
