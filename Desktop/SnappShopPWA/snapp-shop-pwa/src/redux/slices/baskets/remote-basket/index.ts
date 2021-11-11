import axios from 'axios'
import {
  AnyAction,
  createAsyncThunk,
  createSelector,
  createAction,
  createSlice,
} from '@reduxjs/toolkit'

import {Cookies} from '@root/types'
import {Address} from '@schema/address'
import {StoreShape, AppThunk} from '@redux'
import {isAPIResponse, APIError} from '@api'
import {selectAddresses} from '@slices/core'
import {BasketAction, BasketAPIResponse} from '@schema/basket'
import {getProductUniqueId} from '@utils'

import requests from '../endpoints'
import {clearBasket, updateBasketByAPI} from '../local-basket'
import {BasketsAPI, ClearBasketAPIError} from '..'
export {baseActions} from './base-actions'

type BaseAddress = Pick<Address, 'id' | 'longitude' | 'latitude'>

export const callBasketAPI = createAsyncThunk<
  BasketAPIResponse | undefined,
  {actions: BasketAction[]; id?: string; vendorCode: string},
  {state: StoreShape; extra: {cookies?: Cookies}}
>('baskets-api/call-api', async ({actions, id, vendorCode}, thunkAPI) => {
  const {dispatch, signal, extra} = thunkAPI
  const source = axios.CancelToken.source()

  signal.addEventListener('abort', () => source.cancel())

  const response = await requests
    .updateBasket<BasketAPIResponse>({
      data: {actions},
      ...(id && {urlParams: {id}}),
      cancelToken: source.token,
      cookies: extra.cookies,
    })
    .catch(async (error: APIError) => {
      if (error?.response?.status === 404) {
        await dispatch(rebuildBasket(vendorCode))
      }
      return error
    })

  if (isAPIResponse(response)) {
    if (response.status === 200) {
      dispatch(updateUserAddresses(response.data.data.basket.address))
      return response.data
    } else return Promise.reject(response)
  }
  return Promise.reject(response)
})

export const deleteBasketAPI = createAsyncThunk<
  void,
  string,
  {state: StoreShape}
>('baskets-api/delete-basket', async (vendorCode, {getState}) => {
  const basket = selectBasketAPI(vendorCode)(getState())
  const basketId = basket?.response?.basket.id

  if (basketId) {
    requests.deleteBasket({urlParams: {id: basketId}}).catch(e => e)
  }
})

const initialState: BasketsAPI = {}

const basketsAPISlice = createSlice({
  name: 'baskets-api',
  initialState,
  reducers: {
    clearErrors(state, {payload: vendorCode}: ClearBasketAPIError) {
      if (state[vendorCode]) {
        state[vendorCode].error = {
          isNetworkError: false,
          errorCodes: [],
          message: '',
          actions: [],
        }
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(callBasketAPI.fulfilled, (state, {payload, meta: {arg}}) => {
        const {vendorCode} = arg
        if (!payload?.data) return onAPIError(state, vendorCode, arg.actions)

        const {error, data} = payload

        state[vendorCode].response = data
        state[vendorCode].loading = {actions: [], status: false}
        state[vendorCode].error = {
          isNetworkError: false,
          errorCodes: error?.errorCodes ?? [],
          message: error?.message ?? '',
          actions: error?.message ? arg.actions.map(a => a.action) : [],
        }
      })
      .addCase(callBasketAPI.rejected, (state, {meta: {arg}}) => {
        const {vendorCode} = arg
        onAPIError(state, vendorCode, arg.actions)
      })
      .addCase(callBasketAPI.pending, (state, {meta: {arg}}) => {
        const {vendorCode} = arg

        const newState = {
          loading: {actions: arg.actions.map(a => a.action), status: true},
          error: {
            isNetworkError: false,
            errorCodes: [],
            message: '',
            actions: [],
          },
        }

        if (!state[vendorCode]) {
          state[vendorCode] = {response: undefined, ...newState}
        } else {
          state[vendorCode] = {
            response: state[vendorCode].response,
            ...newState,
          }
        }
      })
    builder.addCase(deleteBasketAPI.fulfilled, (state, {meta: {arg}}) => {
      const vendorCode = arg
      delete state[vendorCode]
    })
  },
})

const onAPIError = (
  state: BasketsAPI,
  vendorCode: string,
  actions: BasketAction[]
) => {
  const newState = {
    loading: {actions: [], status: false},
    error: {
      isNetworkError: true,
      errorCodes: [],
      message: '',
      actions: actions.map(a => a.action),
    },
  }
  if (!state[vendorCode]) state[vendorCode] = {response: undefined, ...newState}
  else state[vendorCode] = {response: state[vendorCode].response, ...newState}
}

export const selectBasketsAPI = (state: StoreShape) =>
  state[basketsAPISlice.name]
export const selectBasketAPI = (vendorCode?: string) =>
  createSelector(selectBasketsAPI, baskets =>
    vendorCode ? baskets[vendorCode] : undefined
  )

const mergeActions = (actions: BasketAction[]) => {
  const mergedActions = [...actions]
  const bag: {[key: string]: boolean} = {}
  const indices: number[] = []

  for (let i = actions.length - 1; i >= 0; i--) {
    const action = actions[i]
    if (action.action !== 'setProducts') {
      if (action.action in bag) indices.push(i)
      else bag[action.action] = true
    } else {
      const id = getProductUniqueId(action.argument)
      const key = `setProducts-${id}`
      if (key in bag) indices.push(i)
      else bag[key] = true
    }
  }

  indices.forEach(index => {
    mergedActions.splice(index, 1)
  })

  return mergedActions
}

export const updateLocalBasket = (vendorCode: string): AppThunk => (
  dispatch,
  getState
) => {
  const basketAPI = selectBasketAPI(vendorCode)(getState())
  const response = basketAPI?.response
  if (response) {
    dispatch(updateBasketByAPI({data: response, vendorCode}))
  }
}

const rebuildBasket = (vendorCode: string): AppThunk => dispatch => {
  dispatch(clearBasket(vendorCode))
}

const updateUserAddresses = (newAddress: BaseAddress | null): AppThunk => (
  dispatch,
  getState
) => {
  const state = getState()
  const userAddresses = selectAddresses(state)
  if (userAddresses?.find(address => address.id == newAddress?.id)) {
    dispatch(updateUserAddressesAction(newAddress))
  }
}

export const getAggregator = () => {
  let actions: BasketAction[] = []

  let isPending = false

  let timeoutId = 0

  let promise: Promise<AnyAction> & {abort: (reason?: string) => void}

  const BATCH_TIMEOUT = +process.env.BASKET_API_BATCH_TIMEOUT!

  const aggregate = (
    vendorCode: string,
    basketAction?: BasketAction[] | BasketAction
  ): AppThunk => (dispatch, getState) => {
    if (basketAction) actions = actions.concat(basketAction)

    if (isPending || !actions.length) return

    clearTimeout(timeoutId)

    timeoutId = window.setTimeout(() => {
      isPending = true

      const handleResolveAPI = () => {
        isPending = false
        if (actions.length) dispatch(aggregate(vendorCode))
        else dispatch(updateLocalBasket(vendorCode))
      }

      const basket = selectBasketAPI(vendorCode)(getState())

      const id = basket?.response?.basket.id

      const merged = mergeActions(actions)

      promise = dispatch(callBasketAPI({actions: merged, id, vendorCode}))

      promise.then(handleResolveAPI).catch(() => (isPending = false))

      actions = []
    }, BATCH_TIMEOUT)
  }

  aggregate.deleteBasket = (vendorCode: string): AppThunk => dispatch => {
    clearTimeout(timeoutId)
    isPending = false

    promise?.abort()

    dispatch(deleteBasketAPI(vendorCode))
  }

  return aggregate
}

export const updateUserAddressesAction = createAction<BaseAddress | null>(
  'baskets-api/update-basket'
)

export const {clearErrors} = basketsAPISlice.actions

export default basketsAPISlice
