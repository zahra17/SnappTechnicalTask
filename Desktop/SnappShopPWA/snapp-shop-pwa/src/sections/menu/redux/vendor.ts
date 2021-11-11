import axios from 'axios'

import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  EntityState,
  AnyAction,
} from '@reduxjs/toolkit'

import {isAPIResponse} from '@api'
import {Cookies} from '@root/types'
import {Coupon} from '@schema/coupon'
import {Vendor, VendorModel} from '@schema/vendor'
import {MenuCategory, ProductModel} from '@schema/product'
import {selectBasket} from '@slices/baskets'
import {StoreShape, RejectedAction, FulfilledAction} from '@redux'
import {sortVendorSchedules} from '@utils'
import {
  VendorStaticResponse,
  VendorCommentsResponse,
  CouponResponse,
  isCouponResponseType,
} from '~menu/types'

import requests from '~menu/endpoints'
import {COUPON_CATEGORY_ID, PREVIOUS_PURCHASES_ID} from '~menu/constants'

export type VendorState = EntityState<MenuCategory> & {
  isLoading: boolean
  vendor: Vendor | null
  vendorComments: Partial<VendorCommentsResponse['data'] & {isLoading: boolean}>
  locationCacheKey: string
  couponsList: {coupons: Coupon[]; count: number}
  cacheInfo: Record<string, string | number>
  searchCategories: MenuCategory[]
}

// insert one entity to first entities
const insertOneEntityToTop = (
  state: EntityState<MenuCategory>,
  catId: number
) => {
  const index = state.ids.findIndex(id => id === catId)
  if (index !== -1) {
    state.ids.splice(index, 1)
    state.ids.unshift(catId)
  }
}

const categoriesAdapter = createEntityAdapter<MenuCategory>({
  selectId: item => {
    return item.categoryId
  },
  // sortComparer: (cat1, cat2) => cat1.categoryId - cat2.categoryId,
})

const initialState: VendorState = {
  cacheInfo: {},
  ids: [],
  entities: {},
  isLoading: false,
  vendor: null,
  vendorComments: {},
  locationCacheKey: '',
  couponsList: {coupons: [], count: 0},
  searchCategories: [],
}

const isMenuAction = (action: AnyAction) => action.type.startsWith('menu/')
// Static Vendor Detail Fetcher
export const fetchDetailsStatic = createAsyncThunk<
  VendorStaticResponse['data'],
  Record<string, string | string[] | number | undefined>,
  {rejectValue: VendorStaticResponse['error']; extra: {cookies?: Cookies}}
>('menu/fetchDetailsStatic', async (args, {rejectWithValue, extra}) => {
  try {
    const response = await requests.vendorStaticDetails<VendorStaticResponse>({
      urlParams: {version: 'v2', type: 'restaurant'},
      params: args,
      cookies: extra.cookies,
    })

    if (isAPIResponse(response)) {
      if (response.data.data) return response.data.data
      else if (response.data.error) return rejectWithValue(response.data.error)
    }
    throw 'err'
  } catch (err) {
    return rejectWithValue({message: err, code: -1})
  }
})

// Dynamic Vendor Detail Fetcher
export const fetchDetailsDynamic = createAsyncThunk<
  VendorStaticResponse['data'],
  Record<string, string | string[] | number | undefined>,
  {rejectValue: string; extra: {cookies?: Cookies}}
>(
  'menu/fetchDetailsDynamic',
  async (args, {rejectWithValue, signal, extra}) => {
    const source = axios.CancelToken.source()
    signal.addEventListener('abort', () => source.cancel())

    try {
      const response = await requests.vendorDynamicDetails<VendorStaticResponse>(
        {
          urlParams: {version: 'v2', type: 'restaurant'},
          params: args,
          cancelToken: source.token,
          cookies: extra.cookies,
        }
      )
      if (isAPIResponse(response)) {
        return response.data.data
      }
      throw {message: 'err'}
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

// Vendor Comment Fetcher
export const getVendorComments = createAsyncThunk<
  VendorCommentsResponse['data'],
  Record<string, string | number>,
  {rejectValue: string; extra: {cookies?: Cookies}}
>('menu/getVendorComments ', async (args, {rejectWithValue, extra}) => {
  try {
    const response = await requests.getVendorComments<VendorCommentsResponse>({
      urlParams: {version: 'v1'},
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

// Product Comment Fetcher
export const getProductComments = createAsyncThunk<
  VendorCommentsResponse['data'],
  Record<string, string | number>,
  {rejectValue: string; extra: {cookies?: Cookies}}
>('menu/getProductComments ', async (args, {rejectWithValue, extra}) => {
  try {
    const response = await requests.getProductComments<VendorCommentsResponse>({
      urlParams: {version: 'v2'},
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

// Dynamic Vendor Detail Fetcher
export const fetchCoupon = createAsyncThunk<
  {coupons: Coupon[]; count: number},
  void,
  {rejectValue: string; extra: {cookies?: Cookies}; state: StoreShape}
>(
  'menu/getCouponBasedOnBasket',
  async (_, {rejectWithValue, getState, extra}) => {
    try {
      const vendor = selectVendor(getState())
      const vendorModel = new VendorModel(vendor!)
      const {vendorCode} = vendorModel
      const basket = selectBasket(vendorCode)(getState())
      const products = basket?.products?.map(product => ({
        id: product.id,
        count: product.count,
        toppings: product.toppings?.map(topping => topping.id) ?? [],
      }))

      const params = {
        variable: vendorCode,
      }

      const data = {
        products: JSON.stringify(products ?? []),
        vendorCode,
      }

      const response = await requests.getCouponBasedOnBasket<CouponResponse>({
        urlParams: {
          version: 'v1',
          type: 'restaurant',
          variable: `${params.variable}`,
        },
        params,
        data,
        cookies: extra.cookies,
      })
      if (isAPIResponse(response) && isCouponResponseType(response.data.data)) {
        const {coupons} = response.data.data ?? {}
        const count = coupons?.reduce(
          (sum, coupon) => (coupon.is_earned ? (sum += 1) : sum),
          0
        )
        return {coupons: coupons ?? [], count: count ?? 0}
      }
      throw {message: 'err'}
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

const vendorSlice = createSlice({
  name: 'menu/vendor',
  initialState: categoriesAdapter.getInitialState(initialState),
  reducers: {
    clearCache(state) {
      state.cacheInfo = {}
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDetailsStatic.fulfilled, (state, action) => {
        if (action.payload) {
          const {vendor, menus} = action.payload
          state.vendor = vendor

          const sotredSchedules = sortVendorSchedules(vendor.schedules)
          state.vendor.sortedSchedules = sotredSchedules

          const newMenus = VendorModel.getMenusWithVariations(menus)
          state.searchCategories = VendorModel.filterSearchCaegories(newMenus)

          categoriesAdapter.setAll(state, newMenus)
        }
      })
      .addCase(fetchDetailsDynamic.fulfilled, (state, action) => {
        const {
          meta: {arg},
        } = action
        if (action.payload) {
          const {vendor, stocks, menus} = action.payload

          // Map over products and if has stock set stock number.
          state.ids.map(function (id) {
            const menuCategory = state.entities[id]

            menuCategory!.products = menuCategory!.products.map(product => {
              return {
                ...product,
                stock: ProductModel.hasStock(stocks, product.id),
              }
            })
          })

          state.vendor = {...state.vendor, ...vendor}
          state.locationCacheKey = String(arg.locationCacheKey)

          if (menus.length) {
            const newMenus = VendorModel.getMenusWithVariations(menus)

            categoriesAdapter.upsertMany(state, newMenus)
          }
        }
        // categoriesAdapter.setAll(state, menus)
      })
      .addCase(fetchCoupon.fulfilled, (state, action) => {
        const extraCategory = {
          category: '',
          categoryId: COUPON_CATEGORY_ID,
          description: '',
          image: null,
          products: [],
          productVariations: [],
        }

        if (action.payload.coupons.length) {
          categoriesAdapter.upsertOne(state, extraCategory)
          state.couponsList = action.payload
        }
      })
      .addCase(fetchCoupon.pending, state => {
        state.isLoading = true
      })
      .addCase(fetchDetailsStatic.pending, state => {
        state.isLoading = true
        state.vendor = null
        state.vendorComments = {}
        categoriesAdapter.removeAll(state)
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
      // .addMatcher<PendingAction>(
      //   (action): action is PendingAction =>
      //     isMenuAction(action) && action.type.endsWith('/pending'),
      //   state => {
      //     state.isLoading = true
      //   }
      // )
      .addMatcher<FulfilledAction>(
        (action): action is FulfilledAction =>
          isMenuAction(action) && action.type.endsWith('/fulfilled'),
        state => {
          // insert previous purchases and coupon to top entities
          insertOneEntityToTop(state, PREVIOUS_PURCHASES_ID)
          insertOneEntityToTop(state, COUPON_CATEGORY_ID)

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
  (state[vendorSlice.name] as VendorState) || initialState
const globalizedSelectors = categoriesAdapter.getSelectors<StoreShape>(state =>
  selectSlice(state)
)

export const selectCategories = globalizedSelectors.selectAll
export const selectIsLoading = createSelector(
  selectSlice,
  slice => slice?.isLoading
)
export const selectVendor = createSelector(selectSlice, slice => slice.vendor)
export const selectComments = createSelector(
  selectSlice,
  slice => slice.vendorComments
)
export const selectCouponsList = createSelector(
  selectSlice,
  slice => slice.couponsList
)

export const selectSearchCategories = createSelector(
  selectSlice,
  slice => slice.searchCategories
)

export const {
  actions: {clearCache},
} = vendorSlice

export default vendorSlice
