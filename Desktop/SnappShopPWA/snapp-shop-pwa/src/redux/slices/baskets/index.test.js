import MockAdapter from 'axios-mock-adapter'

import Store from '@redux'
import {api, apiSecurity} from '@api'

import {basketActions, recreateBasket} from '.'
import requests from './endpoints'
import {selectBasket, selectBaskets} from './local-basket'
import {selectBasketAPI} from './remote-basket'

describe('test basket', () => {
  let store

  let mockAPI = new MockAdapter(api.instance)
  apiSecurity.tokens = {access_token: 'token-1'}

  beforeEach(() => {
    store = Store.get()
    mockAPI = new MockAdapter(api.instance)
    jest.useFakeTimers()
  })

  afterEach(() => {
    mockAPI.restore()
    jest.clearAllTimers()
  })

  const flushPromises = () => new Promise(resolve => setImmediate(resolve))

  const mockBasket = {
    id: '1234',
    vendor: {vendorCode: 'code-1'},
    addressId: '1',
    preOrder: {date: 'TODAY', time: 10},
    basketType: ['food-party', 'e-commerce'],
    paymentType: 'CREDIT',
    expeditionType: 'PICKUP',
    voucherCode: '',
    useCredit: true,
  }

  const mockUpdateBasket = {
    vendorCode: 'code-1',
    addressId: 10,
    preOrder: {date: 'TODAY', time: 20},
    basketType: ['normal'],
    paymentType: 'CASH',
    expeditionType: 'DELIVERY',
    voucherCode: 'voucher-1',
    bank: 'ap',
  }

  const mockProduct = {
    id: 1,
    count: 1,
    toppings: [{id: 100, count: 1}],
  }

  const mockProductB = {
    id: 1,
    count: 1,
    toppings: [{id: 101, count: 1}],
  }

  const paymentMap = {
    ONLINE: 1,
    CREDIT: 2,
    CASH: 3,
    POS: 4,
  }

  test('create basket', async () => {
    const mockBasketAPI = jest.fn()

    const {vendorCode} = mockBasket.vendor

    jest.spyOn(requests, 'updateBasket').mockImplementationOnce(mockBasketAPI)

    store.dispatch(basketActions.createBasket(mockBasket))

    const baskets = selectBaskets(store.getState())

    expect(baskets).toMatchObject({[vendorCode]: mockBasket})

    jest.runAllTimers()

    const result = mockBasketAPI.mock.calls[0][0].data.actions

    expect(result).toContainEqual({
      action: 'setVendor',
      argument: {vendor_code: vendorCode},
    })
    expect(result).toContainEqual({
      action: 'setAddress',
      argument: {address_id: Number(mockBasket.addressId)},
    })
    expect(result).toContainEqual({
      action: 'setType',
      argument: {type: 'daily_deal'},
    })
    expect(result).toContainEqual({
      action: 'setPreOrder',
      argument: mockBasket.preOrder,
    })
    expect(result).toContainEqual({
      action: 'setPaymentType',
      argument: {payment_type: paymentMap[mockBasket.paymentType]},
    })
    expect(result).toContainEqual({
      action: 'setExpeditionType',
      argument: {expedition_type: 'PICKUP'},
    })
    expect(result).toContainEqual({
      action: 'useCredit',
      argument: true,
    })
  })

  test('update basket', async () => {
    const mockBasketAPI = jest.fn()

    jest
      .spyOn(requests, 'updateBasket')
      .mockImplementationOnce(mockBasketAPI)
      .mockImplementationOnce(mockBasketAPI)

    store.dispatch(basketActions.createBasket(mockBasket))

    jest.runAllTimers()
    await flushPromises()

    store.dispatch(basketActions.updateBasket(mockUpdateBasket))

    jest.runAllTimers()

    const result = mockBasketAPI.mock.calls[1][0].data.actions

    expect(result).toContainEqual({
      action: 'setAddress',
      argument: {address_id: mockUpdateBasket.addressId},
    })
    expect(result).toContainEqual({
      action: 'setType',
      argument: {type: 'normal'},
    })
    expect(result).toContainEqual({
      action: 'setPreOrder',
      argument: mockUpdateBasket.preOrder,
    })
    expect(result).toContainEqual({
      action: 'setPaymentType',
      argument: {payment_type: paymentMap[mockUpdateBasket.paymentType]},
    })
    expect(result).toContainEqual({
      action: 'setExpeditionType',
      argument: {expedition_type: mockUpdateBasket.expeditionType},
    })
    expect(result).toContainEqual({
      action: 'setBank',
      argument: {bank: mockUpdateBasket.bank},
    })
  })

  test('clear basket', async () => {
    const mockDeleteAPI = jest.fn()

    const {vendorCode} = mockBasket.vendor

    mockAPI.onPost().reply(200, {
      data: {
        basket: {
          id: 'basket-id',
          products: [],
          pre_order: {date: 'tomorrow', time: 20},
          prices: [],
        },
      },
    })

    jest.spyOn(requests, 'deleteBasket').mockImplementationOnce(mockDeleteAPI)

    store.dispatch(basketActions.createBasket(mockBasket))

    jest.runAllTimers()
    await flushPromises()

    store.dispatch(basketActions.clearBasket(vendorCode))
    const baskets = selectBaskets(store.getState())

    expect(baskets).not.toHaveProperty(vendorCode)

    expect(mockDeleteAPI).toBeCalled()
  })

  test('add product', async () => {
    const mockBasketAPI = jest.fn()

    const {vendorCode} = mockBasket.vendor
    const count = 5

    jest.spyOn(requests, 'updateBasket').mockImplementationOnce(mockBasketAPI)

    store.dispatch(basketActions.createBasket(mockBasket))
    store.dispatch(
      basketActions.addProduct({product: mockProduct, vendorCode, count})
    )

    const basket = selectBasket(vendorCode)(store.getState())

    expect(basket.products).toContainEqual({...mockProduct, count})

    jest.runAllTimers()

    const result = mockBasketAPI.mock.calls[0][0].data.actions

    expect(result).toContainEqual({
      action: 'setProducts',
      argument: {...mockProduct, count},
    })
  })

  test('remove product', async () => {
    const mockBasketAPI = jest.fn()

    const {vendorCode} = mockBasket.vendor

    jest.spyOn(requests, 'updateBasket').mockImplementationOnce(mockBasketAPI)

    store.dispatch(basketActions.createBasket(mockBasket))
    store.dispatch(
      basketActions.addProduct({product: mockProduct, vendorCode, count: 5})
    )
    store.dispatch(
      basketActions.removeProduct({product: mockProduct, vendorCode, count: 3})
    )

    const basket = selectBasket(vendorCode)(store.getState())

    expect(basket.products).toContainEqual({...mockProduct, count: 2})

    jest.runAllTimers()
    await flushPromises()

    const result = mockBasketAPI.mock.calls[0][0].data.actions

    expect(result).toContainEqual({
      action: 'setProducts',
      argument: {...mockProduct, count: 2},
    })
  })

  test('update basket after call basket API', async () => {
    const payload = {
      basket: {
        id: 'code',
        address: {id: 6},
        products: [{id: 1, name: 'product'}],
        expedition_type: 'DELIVERY',
        bank: 'ap',
        payment_type: 'ONLINE',
        pre_order: {date: 'tomorrow', time: 20},
        prices: [
          {id: 1, title: 'title-1', is_show: true},
          {
            id: 2,
            title: 'title-2',
            tag: 'voucher',
            is_show: true,
            discountType: 'VOUCHER',
            value: 10000,
          },
          {
            id: 3,
            title: 'title-3',
            is_show: true,
            alias: 'VAT_PRICE',
            value: 12000,
          },
          {
            id: 4,
            title: 'title-4',
            is_show: true,
            alias: 'DELIVERY_PRICE',
            value: 2000,
          },
          {
            id: 5,
            title: 'title-5',
            is_show: true,
            alias: 'TOTAL_DISCOUNT_PRICE',
            value: 500,
          },
          {
            id: 6,
            title: 'title-6',
            is_show: true,
            alias: 'CONTAINER_PRICE',
            value: 15000,
          },
        ],
        total: 100,
        used_credit: 50000,
        use_credit: true,
        voucher_code: 'code-2',
      },
      stocks: {available_stocks: [{id: 5, stock: 20}]},
      gateways: [{name: 'gate-1'}],
      payment_types: [1, 2, 3],
      pickup_availability: {},
      show_credit: true,
      show_voucher_field: true,
    }
    mockAPI.onAny().reply(200, {data: payload})

    store.dispatch(basketActions.createBasket(mockBasket))

    jest.runAllTimers()
    await flushPromises()

    const {vendorCode} = mockBasket.vendor
    const basket = selectBasket(vendorCode)(store.getState())

    expect(basket).toMatchObject({
      id: payload.basket.id,
      addressId: payload.basket.address.id,
      products: payload.basket.products,
      stocks: {5: 20},
      expeditionType: payload.basket.expedition_type,
      bank: payload.basket.bank,
      paymentType: paymentMap[payload.basket.payment_type],
      preOrder: payload.basket.pre_order,
      prices: payload.basket.prices,
      total: payload.basket.total,
      usedCredit: payload.basket.used_credit,
      useCredit: payload.basket.use_credit,
      vat: 12000,
      deliveryFee: 2000,
      totalDiscount: 500,
      containerPrice: 15000,
      discount: {
        type: payload.basket.prices[1].discountType,
        amount: payload.basket.prices[1].value,
        voucherCode: payload.basket.voucher_code,
      },
      options: {
        gateways: payload.gateways,
        paymentTypes: payload.payment_types,
        showCredit: payload.show_credit,
        showVoucherField: payload.show_voucher_field,
        pickupAvailability: payload.pickup_availability,
      },
    })
  })

  test('select id in api', async () => {
    const mockBasketAPI = jest.fn()

    jest.spyOn(requests, 'updateBasket').mockImplementationOnce(mockBasketAPI)

    store.dispatch(basketActions.createBasket(mockBasket))

    jest.runAllTimers()

    const basket = selectBasketAPI(mockBasket.vendor.vendorCode)(
      store.getState()
    )

    const {urlParams} = mockBasketAPI.mock.calls[0][0]

    expect(urlParams).toMatchObject({id: basket.response.basket.id})
  })

  test('merge actions', async () => {
    const mockBasketAPI = jest.fn()

    const {vendorCode} = mockBasket.vendor

    jest.spyOn(requests, 'updateBasket').mockImplementationOnce(mockBasketAPI)

    store.dispatch(basketActions.createBasket(mockBasket))
    store.dispatch(basketActions.updateBasket(mockUpdateBasket))
    store.dispatch(basketActions.updateBasket(mockUpdateBasket))
    store.dispatch(
      basketActions.addProduct({product: mockProduct, vendorCode, count: 1})
    )
    store.dispatch(
      basketActions.addProduct({product: mockProduct, vendorCode, count: 3})
    )
    store.dispatch(
      basketActions.addProduct({product: mockProductB, vendorCode, count: 2})
    )

    jest.runAllTimers()
    await flushPromises()

    const result = mockBasketAPI.mock.calls[0][0].data.actions

    // automatic add setSource action => + 1
    expect(result.length).toBe(11 + 1)
    expect(result).toContainEqual({
      action: 'setVendor',
      argument: {vendor_code: 'code-1'},
    })
    expect(result).toContainEqual({
      action: 'setAddress',
      argument: {address_id: mockUpdateBasket.addressId},
    })
    expect(result).toContainEqual({
      action: 'setType',
      argument: {type: 'normal'},
    })
    expect(result).toContainEqual({
      action: 'setPreOrder',
      argument: mockUpdateBasket.preOrder,
    })
    expect(result).toContainEqual({
      action: 'setPaymentType',
      argument: {payment_type: paymentMap[mockUpdateBasket.paymentType]},
    })
    expect(result).toContainEqual({
      action: 'setExpeditionType',
      argument: {expedition_type: mockUpdateBasket.expeditionType},
    })
    expect(result).toContainEqual({
      action: 'setVoucher',
      argument: {voucher_code: mockUpdateBasket.voucherCode},
    })
    expect(result).toContainEqual({
      action: 'setBank',
      argument: {bank: mockUpdateBasket.bank},
    })
    expect(result).toContainEqual({
      action: 'setProducts',
      argument: {...mockProduct, count: 4},
    })
    expect(result).toContainEqual({
      action: 'setProducts',
      argument: {...mockProductB, count: 2},
    })
    expect(result).toContainEqual({
      action: 'useCredit',
      argument: true,
    })
    expect(result.find(action => action.action === 'setSource')).toBeDefined()
  })

  test('clear products', async () => {
    const mockBasketAPI = jest.fn()

    jest.spyOn(requests, 'updateBasket').mockImplementationOnce(mockBasketAPI)

    store.dispatch(
      basketActions.createBasket({...mockBasket, clearProducts: true})
    )

    jest.runAllTimers()
    await flushPromises()

    const result = mockBasketAPI.mock.calls[0][0].data.actions

    expect(result).toContainEqual({
      action: 'clearProducts',
      argument: null,
    })
  })

  test('recreate basket', async () => {
    const mockBasketAPI = jest.fn()

    jest.spyOn(requests, 'updateBasket').mockImplementationOnce(mockBasketAPI)

    const {vendorCode} = mockBasket.vendor
    store.dispatch(recreateBasket(mockBasket, [mockProduct, mockProductB]))

    const basket = selectBasket(vendorCode)(store.getState())

    expect(basket.products).toContainEqual(mockProduct)
    expect(basket.products).toContainEqual(mockProductB)

    jest.runAllTimers()
    await flushPromises()

    const result = mockBasketAPI.mock.calls[0][0].data.actions

    expect(result).toContainEqual({
      action: 'clearProducts',
      argument: null,
    })
    expect(result).toContainEqual({
      action: 'setVendor',
      argument: {vendor_code: vendorCode},
    })
    expect(result).toContainEqual({
      action: 'setAddress',
      argument: {address_id: Number(mockBasket.addressId)},
    })
    expect(result).toContainEqual({
      action: 'setAddress',
      argument: {address_id: Number(mockBasket.addressId)},
    })
    expect(result).toContainEqual({
      action: 'setProducts',
      argument: mockProduct,
    })
    expect(result).toContainEqual({
      action: 'setProducts',
      argument: mockProductB,
    })
  })
})
