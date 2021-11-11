import {createSlice, createAsyncThunk, createSelector} from '@reduxjs/toolkit'

import {Cookies} from '@root/types'
import {isAPIResponse} from '@api'
import {StoreShape} from '@redux'
import requests from '../endpoints'
import {PendingOrder, PendingOrderResponse} from '~order/types'

export const getPendingOrders = createAsyncThunk<
  PendingOrderResponse['data'],
  Record<string, string | number>,
  {rejectValue: string; extra: {cookies?: Cookies}}
>('order/pendingOrders', async (args, {rejectWithValue, extra: {cookies}}) => {
  try {
    const response = await requests.getPendingOrders<PendingOrderResponse>({
      params: args,
      cookies,
    })
    if (isAPIResponse(response)) {
      return response.data.data
    }
    throw {message: 'error'}
  } catch (err) {
    return rejectWithValue(err)
  }
})

export type PendingOrderState = {
  orders?: PendingOrder[]
  pub_sub_token: string
}

const initialState: PendingOrderState = {
  orders: undefined,
  pub_sub_token: '',
}

const pendingOrdersSlice = createSlice({
  name: 'order/pendingOrders',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getPendingOrders.fulfilled, (state, {payload}) => {
      state.orders = payload.orders
      state.pub_sub_token = payload.pub_sub_token
    })
  },
})

export const selectPendingOrderSlice = (state: StoreShape) =>
  state[pendingOrdersSlice.name]

export const selectPendingOrder = createSelector(
  selectPendingOrderSlice,
  slice => slice.orders
)

export const selectPubSubToken = createSelector(
  selectPendingOrderSlice,
  slice => slice.pub_sub_token
)

export default pendingOrdersSlice
