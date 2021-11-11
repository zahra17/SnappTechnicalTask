import MockAdapter from 'axios-mock-adapter'

import {api, apiSecurity, CheckStatus} from '@api'
import Store from '@redux'
import requests from '../endpoints'
import {getAggregator, callBasketAPI, selectBasketsAPI, clearErrors} from '.'

describe('test basket api', () => {
  const store = Store.get()

  let mockAPI
  apiSecurity.tokens = {access_token: 'token-1'}

  beforeEach(() => {
    jest.useFakeTimers()
    mockAPI = new MockAdapter(api.instance)
  })

  afterEach(() => {
    jest.clearAllTimers()
    mockAPI.restore()
  })

  const flushPromises = () => new Promise(resolve => setImmediate(resolve))

  const vendorCode = 'code-1'
  const mockAddProduct = {
    action: 'setProducts',
    argument: {id: 1, toppings: []},
  }

  test('basket batch handler', async () => {
    let resolveAPI = () => {}
    const mockBasketAPI = jest.fn(async () => {
      await new Promise(resolve => (resolveAPI = resolve))
    })

    jest
      .spyOn(requests, 'updateBasket')
      .mockImplementationOnce(mockBasketAPI)
      .mockImplementationOnce(mockBasketAPI)

    const aggregator = getAggregator()

    store.dispatch(aggregator(vendorCode, mockAddProduct))
    store.dispatch(aggregator(vendorCode, mockAddProduct))

    expect(mockBasketAPI).not.toBeCalled()

    jest.runAllTimers()
    await flushPromises()

    expect(mockBasketAPI).toBeCalled()
    for (let i = 0; i < 20; i++) {
      store.dispatch(aggregator(vendorCode, mockAddProduct))
    }

    expect(mockBasketAPI).toBeCalledTimes(1)

    resolveAPI()
    await flushPromises()
    jest.runAllTimers()

    expect(mockBasketAPI).toBeCalledTimes(2)
  })

  test('basket api error', async () => {
    mockAPI.onPost().reply(404)
    new MockAdapter(CheckStatus.instance.instance)
      .onGet()
      .reply(200, {isUp: true})

    const result = await store.dispatch(
      callBasketAPI({actions: [], id: '', vendorCode: 'code-2'})
    )

    expect(result.type).toBe('baskets-api/call-api/rejected')
    expect(result.error.name).toBe('Error')
  })

  test('delete basket', async () => {
    const basketId = 'basket-id'

    mockAPI.onAny().reply(200, {
      data: {
        basket: {
          id: basketId,
          products: [],
          pre_order: {date: 'tomorrow', time: 20},
          prices: [],
        },
      },
    })
    const mockDeleteBasket = jest.fn()
    jest
      .spyOn(requests, 'deleteBasket')
      .mockImplementationOnce(mockDeleteBasket)

    const aggregator = getAggregator()

    store.dispatch(aggregator(vendorCode, mockAddProduct))

    jest.runAllTimers()
    await flushPromises()

    store.dispatch(aggregator.deleteBasket(vendorCode))

    expect(mockDeleteBasket.mock.calls[0][0]).toMatchObject({
      urlParams: {id: basketId},
    })
  })

  test('basket api error', async () => {
    mockAPI.onAny().reply(200, {
      data: {basket: {id: 'basket-id'}},
      error: {message: 'message-1', errorCodes: [1, 2, 3]},
    })

    const aggregator = getAggregator()

    store.dispatch(aggregator(vendorCode, mockAddProduct))

    jest.runAllTimers()
    await flushPromises()

    const api = selectBasketsAPI(store.getState())
    expect(api[vendorCode].error).toEqual({
      message: 'message-1',
      errorCodes: [1, 2, 3],
      isNetworkError: false,
      actions: ['setProducts'],
    })
  })

  test('clear basket api error', async () => {
    mockAPI.onAny().reply(200, {
      data: {basket: {id: 'basket-id'}},
      error: {message: 'message-1', errorCodes: [1, 2, 3]},
    })

    const aggregator = getAggregator()

    store.dispatch(aggregator(vendorCode, mockAddProduct))

    jest.runAllTimers()
    await flushPromises()

    store.dispatch(clearErrors(vendorCode))

    const api = selectBasketsAPI(store.getState())

    expect(api[vendorCode].error).toEqual({
      message: '',
      errorCodes: [],
      isNetworkError: false,
      actions: [],
    })
  })
})
