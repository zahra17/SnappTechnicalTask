import {Service, ServicesResponse} from '~search/types'
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'

import {Cookies} from '@root/types'
import {StoreShape} from '@redux'
import {isAPIResponse} from '@api'
import requests from '~search/endpoints'

export type ServicesState = {
  services: Array<Service>
}

const initialState: ServicesState = {
  services: [],
}

export const fetchServices = createAsyncThunk<
  ServicesResponse['data'],
  Record<string, string | number>,
  {rejectValue: string; extra: {cookies?: Cookies}}
>('search/services/fetchServices', async (args, {rejectWithValue, extra}) => {
  try {
    const response = await requests.services<ServicesResponse>({
      urlParams: {version: 'v1'},
      params: args,
      cookies: extra.cookies,
    })

    if (isAPIResponse(response)) {
      return response.data.data
    }
    throw {message: 'error'}
  } catch (err) {
    return rejectWithValue(err)
  }
})

const servicesSlice = createSlice({
  name: 'search/services',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.services = action.payload.items
      })
      .addCase(fetchServices.pending, state => {
        // state.isLoading = true
      })
      .addCase(fetchServices.rejected, (state, action) => {})
  },
})

export const selectServicesSlice = (state: StoreShape) =>
  (state[servicesSlice.name] as ServicesState) || initialState

export const selectActiveService = (state: StoreShape) => (id: number) => {
  const services = (state[servicesSlice.name] as ServicesState).services
  const index = services.findIndex(item => item.id === id)
  return services[index]
}

export const {actions} = servicesSlice

export default servicesSlice
