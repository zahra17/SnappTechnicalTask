import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  EntityState,
  AnyAction,
  createSelector,
} from '@reduxjs/toolkit'

import {isAPIResponse} from '@api'
import {Cookies} from '@root/types'

import {Vendor} from '@schema/vendor'
import {StoreShape, RejectedAction, FulfilledAction} from '@redux'
import {VendorCommentsResponse} from '~menu/types'
import {
  ZooketCategory,
  ZooketDetailResponse,
  ZooketPagination,
  ZooketProductsResponse,
  ZooketSection,
  ZooketSectionType,
  ZooketProductDetailsResponse,
  ZooketProductDetailsData,
} from '~menu/types/zooket'

import requests from '~menu/endpoints'
import {sortVendorSchedules} from '@utils'

export type ZooketState = EntityState<ZooketCategory> & {
  isLoading: boolean
  vendor: Vendor | null
  vendorComments: Partial<VendorCommentsResponse['data'] & {isLoading: boolean}>
  sections: Array<ZooketSection>
  productSections: Array<ZooketSection>
  cacheInfo: Record<string, string | number>
  pagination: ZooketPagination
  locationCacheKey: string
  selectedProduct?: ZooketProductDetailsData | null
}

const initialState: ZooketState = {
  ids: [],
  entities: {},
  isLoading: false,
  vendor: null,
  vendorComments: {},
  sections: [],
  productSections: [],
  cacheInfo: {},
  pagination: {
    size: 20,
    total: -1,
    page: 0,
  },
  locationCacheKey: '',
  selectedProduct: null,
}
const categoriesAdapter = createEntityAdapter<ZooketCategory>({
  selectId: item => {
    return item.id
  },
})
const isMenuAction = (action: AnyAction) => action.type.startsWith('menu/')
// Static Vendor Detail Fetcher
export const fetchZooketDetail = createAsyncThunk<
  ZooketDetailResponse['data'],
  Record<string, number | string | string[] | number | undefined>,
  {rejectValue: string; extra: {cookies?: Cookies}}
>('menu/fetchZooketDetail', async (args, {rejectWithValue, extra}) => {
  try {
    const response = await requests.getZooketDetail<ZooketDetailResponse>({
      urlParams: {version: 'v2'},
      params: {...args, isPickup: 0},
      cookies: extra.cookies,
    })
    if (isAPIResponse(response)) {
      return response.data.data
    }
    throw {message: 'err'}
  } catch (err) {
    return rejectWithValue(err)
  }
})

export const fetchZooketProducts = createAsyncThunk<
  ZooketProductsResponse['data'],
  Record<string, number | string | string[] | undefined>,
  {rejectValue: string; extra: {cookies?: Cookies}}
>('menu/fetchZooketProducts', async (args, {rejectWithValue, extra}) => {
  try {
    const response = await requests.getZooketProducts<ZooketProductsResponse>({
      urlParams: {version: 'v2'},
      params: args,
      cookies: extra.cookies,
    })

    if (isAPIResponse(response)) {
      return response.data.data
    }
    throw {message: 'err'}
  } catch (err) {
    return rejectWithValue(err)
  }
})

// Vendor Comment Fetcher
export const getVendorComments = createAsyncThunk<
  VendorCommentsResponse['data'],
  Record<string, string | number>,
  {rejectValue: string; extra: {cookies?: Cookies}}
>('menu/getVendorZooketComments ', async (args, {rejectWithValue, extra}) => {
  try {
    const response = await requests.getVendorComments<VendorCommentsResponse>({
      urlParams: {version: 'v1', type: 'restaurant'},
      params: args,
      cookies: extra.cookies,
    })
    if (isAPIResponse(response)) {
      if (response.data.status) return response.data.data
      else throw {message: 'err'}
    }
    throw {message: 'err'}
  } catch (err) {
    return rejectWithValue(err)
  }
})

// Product Details Fetcher
export const getZooketProductDetails = createAsyncThunk<
  ZooketProductDetailsResponse['data'],
  Record<string, string | number>,
  {rejectValue: string; extra: {cookies?: Cookies}}
>('menu/getZooketProductDetails ', async (args, {rejectWithValue, extra}) => {
  try {
    const response = await requests.getZooketProductDetails<ZooketProductDetailsResponse>(
      {
        urlParams: {version: 'v2'},
        params: args,
        cookies: extra.cookies,
      }
    )
    if (isAPIResponse(response)) {
      if (response.data.status) return response.data.data
      else throw {message: 'err'}
    }
    throw {message: 'err'}
  } catch (err) {
    return rejectWithValue(err)
  }
})

const zooketSlice = createSlice({
  name: 'menu/zooket',
  initialState: categoriesAdapter.getInitialState(initialState),
  reducers: {
    clearCache(state) {
      state.cacheInfo = {}
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchZooketDetail.pending, state => {
        state.isLoading = true
        state.vendor = null
        state.vendorComments = {}
        state.sections = []
        categoriesAdapter.removeAll(state)
      })
      .addCase(fetchZooketDetail.fulfilled, (state, action) => {
        const {
          meta: {arg},
        } = action
        if (action.payload) {
          const {vendor, sections} = action.payload
          state.sections = sections.filter(section => {
            if (section.type === ZooketSectionType.Categories) {
              categoriesAdapter.setAll(state, section.data.items)
              return false
            } else {
              return true
            }
          })
          state.vendor = vendor
          state.locationCacheKey = String(arg.locationCacheKey)
          const sotredSchedules = sortVendorSchedules(vendor.schedules)
          state.vendor.sortedSchedules = sotredSchedules
        }
      })
      .addCase(fetchZooketProducts.pending, state => {
        state.isLoading = true
      })
      .addCase(fetchZooketProducts.fulfilled, (state, action) => {
        const {
          payload,
          meta: {
            arg: {menu_category_id, page},
          },
        } = action
        const {
          categories,
          product_variations,
          meta: {pagination},
        } = payload
        if (!page) {
          categoriesAdapter.updateOne(state, {
            id: Number(menu_category_id),
            changes: {
              sub: categories,
            },
          })
          state.productSections = [
            {
              type: ZooketSectionType.Products,
              data: {
                backgroundColor: '',
                color: '',
                deepLink: '',
                total: product_variations.length,
                link: '',
                items: product_variations,
                title: '',
              },
              id: Math.random(),
            },
          ]
          state.cacheInfo.menu_category_id = Number(menu_category_id)
          state.pagination = pagination
        } else if (
          state.productSections[0] &&
          state.productSections[0].type === ZooketSectionType.Products
        ) {
          const {items, total} = state.productSections[0].data
          state.productSections[0].data.items = items.concat(product_variations)
          state.productSections[0].data.total = total + items.length
          state.pagination = pagination
        }
      })
      .addCase(getVendorComments.pending, state => {
        state.vendorComments.isLoading = true
      })
      .addCase(getVendorComments.fulfilled, (state, action) => {
        const {
          meta: {arg},
          payload,
        } = action
        if (arg.page > 0 && state.vendorComments) {
          state.vendorComments.isLoading = false
          state.vendorComments.comments = state.vendorComments.comments?.concat(
            payload.comments
          )
        } else {
          state.vendorComments = {
            ...payload,
            isLoading: false,
          }
        }
      })
      .addCase(getZooketProductDetails.fulfilled, (state, action) => {
        const {
          meta: {arg},
          payload,
        } = action
        state.selectedProduct = payload
      })
      .addMatcher<FulfilledAction>(
        (action): action is FulfilledAction =>
          isMenuAction(action) && action.type.endsWith('/fulfilled'),
        state => {
          state.isLoading = false
        }
      )
      .addMatcher<RejectedAction>(
        (action): action is RejectedAction =>
          isMenuAction(action) && action.type.endsWith('/rejected'),
        state => {
          state.isLoading = false
        }
      )
  },
})

export const selectSlice = (state: StoreShape) =>
  state[zooketSlice.name] || initialState
const globalizedSelectors = categoriesAdapter.getSelectors<StoreShape>(state =>
  selectSlice(state)
)
export const selectZooketVendor = createSelector(
  selectSlice,
  slice => slice.vendor
)

export const selectProduct = createSelector(
  selectSlice,
  slice => slice.selectedProduct
)
export const selectCategories = globalizedSelectors.selectAll
export const {
  actions: {clearCache},
} = zooketSlice

export default zooketSlice
