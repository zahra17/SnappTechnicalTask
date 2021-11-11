import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'

import {isAPIResponse} from '@api'
import {Cookies} from '@root/types'

import {StoreShape} from '@redux'

import requests from '~search/endpoints'
import {SearchSection, SearchResponse, SECTION_TYPE} from '~search/types'

export type SearchState = {
  results: SearchSection[]
  hasResult: boolean
  isLoading: boolean
  cacheInfo: Record<string, string | number>
}

const initialState: SearchState = {
  results: [],
  hasResult: false,
  isLoading: false,
  cacheInfo: {
    superType: -1,
    query: '',
  },
}

export const searchQuery = createAsyncThunk<
  SearchResponse['data'],
  Record<string, string | number>,
  {rejectValue: string; extra: {cookies?: Cookies}}
>('search/searchQuery', async (args, {rejectWithValue, extra}) => {
  try {
    const response = await requests.search<SearchResponse>({
      params: {
        ...args,
        product_page_size: 8,
        vendor_page_size: 4,
      },
      cookies: extra.cookies,
    })
    if (isAPIResponse(response)) {
      return response.data.data
    }
    throw {message: response}
  } catch (err) {
    return rejectWithValue(err)
  }
})

const searchSlice = createSlice({
  name: 'search/search',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(searchQuery.fulfilled, (state, action) => {
        const {
          meta: {arg},
        } = action
        const {product_variation, vendor} = action.payload
        product_variation.type = SECTION_TYPE.PRODUCTS
        vendor.type = SECTION_TYPE.VENDORS
        const results = [product_variation, vendor]
          .sort((a, b) => a.order - b.order)
          .filter(item => item.total && item.items.length)
        const hasResult = Boolean(results.length)
        state.isLoading = false
        state.hasResult = hasResult
        state.results = results
        state.cacheInfo = {
          ...state.cacheInfo,
          query: arg.query,
          superType: String(arg.superType),
          lat: arg.lat,
          long: arg.long,
        }
      })
      .addCase(searchQuery.pending, state => {
        state.isLoading = true
        state.hasResult = false
        state.results = []
      })
  },
})

export const selectSlice = (state: StoreShape) =>
  (state[searchSlice.name] as SearchState) || initialState

export const {actions} = searchSlice

export default searchSlice
