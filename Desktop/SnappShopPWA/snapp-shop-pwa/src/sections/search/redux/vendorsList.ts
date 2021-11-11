import {
  EntityState,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit'
import {
  ExtraSection,
  SearchVendorsResponse,
  VendorListResponse,
} from '~search/types'
import {PendingAction, StoreShape} from '@redux'

import {Cookies} from '@root/types'
import {Vendor} from '@schema/vendor'
import axios from 'axios'
import configs from '@configs'
import {actions as homeActions} from './home'
import {isAPIResponse} from '@api'
import requests from '~search/endpoints'

type APIResponse = VendorListResponse | SearchVendorsResponse

const isVendorSearchResponse = (
  data: APIResponse
): data is SearchVendorsResponse =>
  Boolean((data as SearchVendorsResponse).data?.term)

export type VendorsListState = EntityState<Vendor> & {
  count: number
  extra_sections: ExtraSection
  isLoading: boolean
  cacheKey: string
}

export type FetchParams = {
  page: number
  page_size: number
  query: string
  filters: {
    filters: (string | null)[] | null | undefined
    sortings: (string | null)[] | null | undefined
    superType: (number | null)[] | null | undefined
    services: (string | null)[] | null | undefined
  }
  category: {
    value: number | null | undefined
    sub: Array<number> | null | undefined
  } | null
  sp_alias: string | null
  city_name: string | null
  area_name: string | null
  chain_name: string | null
  superType: string
  vc: string | null
  lat: number | string | null
  long: number | string | null
  cacheKey: string
  'extra-filter': string
  section?: string | null
}

const listAdapter = createEntityAdapter<Vendor>({
  selectId: item => {
    return item.id
  },
})

const initialState: VendorsListState = {
  count: -1,
  ids: [],
  entities: {},
  extra_sections: {} as ExtraSection,
  isLoading: false,
  cacheKey: '',
}

export const fetchList = createAsyncThunk<
  APIResponse,
  FetchParams,
  {rejectValue: string; extra: {cookies?: Cookies}}
>('vendorsList/fetchList', async (args, {rejectWithValue, signal, extra}) => {
  const source = axios.CancelToken.source()
  signal.addEventListener('abort', () => {
    source.cancel()
  })

  try {
    const {cacheKey: _, ...params} = args
    const response = await requests[
      params.query ? 'searchVendors' : 'vendorList'
    ]<VendorListResponse>({
      params: {
        ...params,
        vendor_title: params.query,
        lat: params.lat !== -1 ? params.lat : configs.LAT,
        long: params.long !== -1 ? params.long : configs.LONG,
      },
      cancelToken: source.token,
      cookies: extra.cookies,
    })
    if (isAPIResponse(response)) {
      if (response.data.Status ?? response.data.status) return response.data
      else throw 'error'
    }
    throw {message: 'err'}
  } catch (err) {
    return rejectWithValue('404')
  }
})

export const fetchMore = createAsyncThunk<
  APIResponse,
  FetchParams,
  {
    rejectValue: string
  }
>('vendorsList/fetchMore', async (args, {rejectWithValue}) => {
  try {
    const response = await requests[
      args.query ? 'searchVendors' : 'vendorList'
    ]<VendorListResponse>({
      params: {
        ...args,
        lat: args.lat !== -1 ? args.lat : configs.LAT,
        long: args.long !== -1 ? args.long : configs.LONG,
      },
    })
    if (isAPIResponse(response)) return response.data
    throw {message: 'err'}
  } catch (err) {
    return rejectWithValue(err)
  }
})

const vendorsListSlice = createSlice({
  name: 'search/vendorsList',
  initialState: listAdapter.getInitialState(initialState) as VendorsListState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchList.fulfilled, (state, action) => {
        const {
          meta: {arg},
        } = action
        state.isLoading = false
        state.cacheKey = arg.cacheKey
        if (isVendorSearchResponse(action.payload)) {
          const {total, result} = action.payload.data
          state.count = total
          listAdapter.setAll(state, result)
        } else {
          const {finalResult, count, extra_sections} = action.payload.data
          state.count = count
          state.extra_sections = extra_sections
          listAdapter.setAll(
            state,
            finalResult
              .filter(item => item.type === 'VENDOR')
              .map(item => item.data)
          )
        }
      })
      .addCase(fetchMore.fulfilled, (state, action) => {
        const {
          meta: {arg},
        } = action

        state.isLoading = false
        state.cacheKey = arg.cacheKey
        if (isVendorSearchResponse(action.payload)) {
          const {total, result} = action.payload.data
          state.count = total
          listAdapter.addMany(state, result)
        } else {
          const {finalResult, count} = action.payload.data
          state.count = count
          listAdapter.addMany(
            state,
            finalResult
              .filter(item => item.type === 'VENDOR')
              .map(item => item.data)
          )
        }
      })
      .addCase(fetchMore.pending, state => {
        state.isLoading = true
      })
      .addMatcher<PendingAction>(
        (action): action is PendingAction =>
          action.type === fetchList.pending.type ||
          action.type === homeActions.viewHome.type,
        (state, action) => {
          state.isLoading = true
          state.count = -1
          listAdapter.removeAll(state)
          if (
            action.meta &&
            (action.meta.arg as Record<string, string>).query
          ) {
            state.extra_sections = {} as ExtraSection
          }
        }
      )
  },
})

export const selectSlice = (state: StoreShape) =>
  (state[vendorsListSlice.name] as VendorsListState) || initialState
const globalizedSelectors = listAdapter.getSelectors<StoreShape>(state =>
  selectSlice(state)
)

export const selectAllList = globalizedSelectors.selectAll
export const selectCount = createSelector(selectSlice, slice => slice?.count)
export const selectIsLoading = createSelector(
  selectSlice,
  slice => slice?.isLoading
)
export const selectExtraSections = createSelector(
  selectSlice,
  slice => slice.extra_sections
)
export const {actions} = vendorsListSlice

export default vendorsListSlice
