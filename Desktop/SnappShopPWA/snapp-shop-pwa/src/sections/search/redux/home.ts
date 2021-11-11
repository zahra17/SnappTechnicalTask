import {
  Cities,
  CitiesResponse,
  ExtraSection,
  HomeResponse,
  HomeSection,
  ProductCollectionType,
  VendorCollectionType,
  VendorListResponse,
} from '~search/types'
import {
  EntityState,
  PayloadAction,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit'

import {Cookies} from '@root/types'
import {FetchParams} from './vendorsList'
import {Product} from '~order/types'
import {StoreShape} from '@redux'
import {Vendor} from '@schema/vendor'
import axios from 'axios'
import configs from '@configs'
import {isAPIResponse} from '@api'
import requests from '~search/endpoints'

export type SetSectionVisibilityAction = PayloadAction<{
  id: string
  visible: boolean
}>

export type HomeDataState = EntityState<HomeSection> & {
  isLoading: boolean
  error: string
  cacheKey: string
  citiesData?: Cities['data']
}

export type CollectionResponse = {
  status: boolean
  Status: boolean
  data: {
    finalResult: {data: Vendor | Product; type: string}[]
    extra_sections: ExtraSection
    count: number
    open_count: number
  }
}
const homeDataAdapter = createEntityAdapter<HomeSection>({
  selectId: item => {
    return item.front_id || item.id
  },
})

const initialState: HomeDataState = {
  entities: {},
  ids: [],
  isLoading: false,
  error: '',
  cacheKey: '',
}

export const getHomeData = createAsyncThunk<
  HomeResponse['data'],
  Record<string, string | number>,
  {rejectValue: string; extra: {cookies?: Cookies}}
>('home/getHomeData', async (args, {rejectWithValue, extra}) => {
  try {
    const {cacheKey: _, ...params} = args
    const response = await requests.getHomeData<HomeResponse>({
      urlParams: {version: 'v3'},
      params: {
        ...params,
        split_page: true,
        modern_render: true,
        lat: args.lat !== -1 ? args.lat : undefined,
        long: args.long !== -1 ? args.long : undefined,
      },
      cookies: extra.cookies,
    })
    if (isAPIResponse(response)) {
      console.log(response.data)
      if (response.data.status) {
        return response.data.data
      }
      throw response.data.data.error
    } else {
      throw Promise.reject(response)
    }
  } catch (err) {
    return rejectWithValue(err)
  }
})

export const fetchVendorCollection = createAsyncThunk<
  CollectionResponse,
  Record<string, string | number>,
  {rejectValue: string; extra: {cookies?: Cookies}}
>(
  'home/fetchVendorCollection',
  async (args, {rejectWithValue, signal, extra}) => {
    const source = axios.CancelToken.source()
    signal.addEventListener('abort', () => {
      source.cancel()
    })

    try {
      const {cacheKey: _, ...params} = args
      const response = await requests.vendorList<CollectionResponse>({
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
      return rejectWithValue(err)
    }
  }
)

export const fetchProductCollection = createAsyncThunk<
  CollectionResponse,
  Record<string, string | number>,
  {rejectValue: string; extra: {cookies?: Cookies}}
>(
  'home/fetchProductCollection',
  async (args, {rejectWithValue, signal, extra}) => {
    const source = axios.CancelToken.source()
    signal.addEventListener('abort', () => {
      source.cancel()
    })

    try {
      const {cacheKey: _, ...params} = args
      const response = await requests.productList<CollectionResponse>({
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
      return rejectWithValue(err)
    }
  }
)

export const getCities = createAsyncThunk<
  CitiesResponse['data'],
  Record<string, string | number>,
  {
    rejectValue: string
  }
>('home/getCities', async (args, {rejectWithValue}) => {
  try {
    const response = await requests.getCities<CitiesResponse>({
      params: args,
    })
    if (isAPIResponse(response)) {
      if (response.data.status) {
        return response.data.data
      }
      throw response.data.data.error
    } else {
      throw Promise.reject(response)
    }
  } catch (err) {
    return rejectWithValue(err)
  }
})
const homeSlice = createSlice({
  name: 'search/home',
  initialState: homeDataAdapter.getInitialState(initialState),
  reducers: {
    viewHome() {},
    setSectionVisibility(
      state,
      {payload: {visible, id}}: SetSectionVisibilityAction
    ) {
      homeDataAdapter.updateOne(state, {
        id,
        changes: {
          visible,
        },
      })
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getHomeData.fulfilled, (state, action) => {
        const {
          meta: {arg},
        } = action
        homeDataAdapter.setAll(state, action.payload.result)
        state.cacheKey = String(arg.cacheKey)
        state.isLoading = false
      })
      .addCase(getHomeData.pending, state => {
        state.isLoading = true
      })
      .addCase(getHomeData.rejected, state => {
        state.isLoading = false
      })
      .addCase(getCities.fulfilled, (state, action) => {
        state.citiesData = action.payload
      })
      .addCase(fetchVendorCollection.fulfilled, (state, action) => {
        const {
          meta: {arg},
        } = action

        const vendors = action.payload.data.finalResult.map(item => item.data)
        homeDataAdapter.updateOne(state, {
          id: arg.id,
          changes: {
            visible: true,
            data: {restaurants: vendors},
          } as VendorCollectionType,
        })
      })
      .addCase(fetchProductCollection.fulfilled, (state, action) => {
        const {
          meta: {arg},
        } = action

        const vendors = action.payload.data.finalResult.map(item => item.data)
        homeDataAdapter.updateOne(state, {
          id: arg.id,
          changes: {
            visible: true,
            data: {products: vendors},
          } as ProductCollectionType,
        })
      })
  },
})

export const selectSlice = (state: StoreShape) =>
  (state[homeSlice.name] as HomeDataState) || initialState
const globalizedSelectors = homeDataAdapter.getSelectors<StoreShape>(state =>
  selectSlice(state)
)

export const selectAllSections = globalizedSelectors.selectAll
export const selectHomeSclie = (state: StoreShape) =>
  (state[homeSlice.name] as HomeDataState) || initialState
export const selectCities = createSelector(
  selectHomeSclie,
  state => state.citiesData
)
export const {actions} = homeSlice

export default homeSlice
