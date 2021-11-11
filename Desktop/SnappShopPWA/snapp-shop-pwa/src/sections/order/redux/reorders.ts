import {createSlice, createAsyncThunk, createSelector} from '@reduxjs/toolkit'

import {Cookies} from '@root/types'
import {isAPIResponse} from '@api'
import {StoreShape} from '@redux'
import requests from '../endpoints'
import {Reorders, ReordersResponse} from '~order/types'

export const getReorders = createAsyncThunk<
  ReordersResponse['data'],
  Record<string, string | number>,
  {rejectValue: string; extra: {cookies?: Cookies}}
>('order/reorders', async (args, {rejectWithValue, extra: {cookies}}) => {
  try {
    const response = await requests.getReorders<ReordersResponse>({
      params: {...args, split_page: 1},
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

export type ReorderState = {
  orders?: Reorders[] | null
}

const initialState: ReorderState = {
  orders: null,
}

const reordersSlice = createSlice({
  name: 'order/reorders',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getReorders.fulfilled, (state, {payload}) => {
      state.orders = payload.orders
    })
  },
})

export const selectReorderSlice = (state: StoreShape) =>
  state[reordersSlice.name]

export const selectReorder = createSelector(
  selectReorderSlice,
  slice => slice.orders
)

export default reordersSlice
