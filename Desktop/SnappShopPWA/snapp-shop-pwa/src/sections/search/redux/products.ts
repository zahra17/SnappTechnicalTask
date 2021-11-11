import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  EntityState,
} from '@reduxjs/toolkit'
import {v4} from 'uuid'

import {isAPIResponse} from '@api'
import {Cookies} from '@root/types'

import {StoreShape} from '@redux'

import requests from '~search/endpoints'
import {SearchProductsResponse} from '~search/types'
import {Product} from '@schema/product'

export type ProductsState = EntityState<Product> & {
  count: number
  isLoading: boolean
  cacheInfo: Record<string, string | string[] | number | undefined>
}
const productsAdapter = createEntityAdapter<Product>({
  selectId: item => {
    return item.id + v4()
  },
})

const initialState: ProductsState = {
  entities: {},
  ids: [],
  isLoading: false,
  count: -1,
  cacheInfo: {
    query: '',
  },
}

export const searchProducts = createAsyncThunk<
  SearchProductsResponse,
  Record<string, string | string[] | number | undefined>,
  {rejectValue: string; extra: {cookies?: Cookies}}
>('products/search-products', async (args, {rejectWithValue, extra}) => {
  try {
    const response = await requests[
      args.product_list === 'true' ? 'productListDesktop' : 'searchProducts'
    ]<SearchProductsResponse>({
      params: args,
      cookies: extra.cookies,
    })
    if (isAPIResponse(response)) {
      let {result} = response.data?.data
      if (args.product_list === 'true') {
        result = result.map(item => item.data)
      }
      return {...response.data, data: {...response.data?.data, result}}
    }
    throw {message: response}
  } catch (err) {
    return rejectWithValue(err)
  }
})

const productsSlice = createSlice({
  name: 'search/products',
  initialState: productsAdapter.getInitialState(initialState),
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(searchProducts.fulfilled, (state, action) => {
        const {total, count, term, result} = action.payload.data
        console.log(1)
        const {
          meta: {arg},
        } = action
        if (arg.page) {
          productsAdapter.addMany(state, result)
        } else {
          productsAdapter.setAll(state, result)
        }

        state.cacheInfo.query = term || ''
        state.cacheInfo.lat = arg.lat
        state.cacheInfo['extra-filter'] = arg['extra-filter']
        state.cacheInfo.long = arg.long
        state.count = total || count || 0
        state.isLoading = false
      })
      .addCase(searchProducts.pending, state => {
        console.log(2)
        state.isLoading = true
      })
  },
})

export const selectSlice = (state: StoreShape) =>
  (state[productsSlice.name] as ProductsState) || initialState
const globalizedSelectors = productsAdapter.getSelectors<StoreShape>(state =>
  selectSlice(state)
)

export const selectAllProducts = globalizedSelectors.selectAll
export const {actions} = productsSlice

export default productsSlice
