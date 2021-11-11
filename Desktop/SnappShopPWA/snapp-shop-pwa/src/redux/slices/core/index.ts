import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction,
} from '@reduxjs/toolkit'

import {Cookies} from '@root/types'
import requests, {apiSecurity, isAPIResponse} from '@api'
import {StoreShape} from '@redux'
import {LoadData} from '@schema/load'
import {User} from '@schema/user'
import {Address} from '@schema/address'

export type CoreState = {
  appData: Omit<LoadData, 'user'> | null
  user: User | null
  isLoading: boolean
}

type SetUserAction = PayloadAction<User>
export type LoadActions = SetUserAction

const initialState: CoreState = {
  appData: null,
  user: null,
  isLoading: false,
}

interface LoadResponse {
  status: boolean
  data: LoadData
}
interface logoutResponse {
  status: boolean
  data: {status: boolean}
}

export const getLoadData = createAsyncThunk<
  LoadResponse['data'],
  Record<string, string | number>,
  {rejectValue: string; extra: {cookies?: Cookies}}
>('core/load', async (args, {rejectWithValue, extra: {cookies}}) => {
  try {
    const response = await requests.load<LoadResponse>({
      urlParams: {version: 'v2'},
      params: args,
      cookies,
    })
    if (isAPIResponse(response)) {
      return response.data.data
    }
    throw {message: response}
  } catch (err) {
    return rejectWithValue(err)
  }
})

export const logout = createAsyncThunk<
  logoutResponse['status'],
  Record<string, string | number>,
  {rejectValue: string}
>('core/logout', async (args, {rejectWithValue}) => {
  try {
    const response = await requests.logout<logoutResponse>({
      urlParams: {version: 'v2'},
      params: args,
    })
    if (isAPIResponse(response)) {
      return response.data.status
    }
    throw {message: response}
  } catch (err) {
    return rejectWithValue(err)
  }
})

const coreSlice = createSlice({
  name: 'core',
  initialState,
  reducers: {
    updateAddress: (state, action: PayloadAction<Address[]>) => {
      if (state.user) {
        state.user.addresses = action.payload
      }
    },
    setUser(state, action: SetUserAction) {
      state.user = action.payload
    },
  },
  extraReducers: builder => {
    builder.addCase(getLoadData.fulfilled, (state, action) => {
      if (action.payload) {
        const {user, ...appData} = action.payload
        state.appData = appData
        state.user = user
      }
    })
    // logout
    builder.addCase(logout.pending, state => {
      state.isLoading = true
    })
    builder.addCase(logout.fulfilled, state => {
      apiSecurity.tokens = ''
      state.isLoading = false
      state.user = null
    })
  },
})

export const selectSlice = (state: StoreShape) => state[coreSlice.name]
export const selectAppData = createSelector(selectSlice, slice => slice.appData)
export const selectUser = createSelector(selectSlice, slice => slice.user)
export const selectLoading = createSelector(
  selectSlice,
  slice => slice.isLoading
)

export const selectAddresses = createSelector(
  selectSlice,
  slice => slice.user?.addresses
)
export const selectAddress = (addressId?: Address['id']) =>
  createSelector(selectSlice, slice =>
    slice.user?.addresses.find(address => address.id === addressId)
  )

export const {actions} = coreSlice

export const {setUser, updateAddress} = coreSlice.actions

export default coreSlice
