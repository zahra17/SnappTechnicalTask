import baskets, {
  createBasket,
  clearBasket,
  addProduct,
  removeProduct,
  updateBasketByAPI,
  addDescription,
  updateBasket,
} from '.'

describe('baskets slice', () => {
  const vendor = {
    vendorCode: 'code1',
    vendorType: 'type1',
    vendorTypeTitle: 'type1-title',
    title: 'vendor name',
    logo: 'logo-url',
  }

  const productA = {
    id: 1,
    toppings: [{id: 100, count: 2}],
  }

  const productB = {
    id: 2,
    count: 2,
    toppings: [
      {id: 100, count: 2},
      {id: 101, count: 1},
    ],
  }

  const createPayload = {
    vendor,
    addressId: 5,
    basketType: ['fod-party'],
    paymentType: 'POS',
    expeditionType: 'DELIVERY',
    preOrder: {date: 'today', time: 10},
  }
  const updatePayload = {
    vendorCode: vendor.vendorCode,
    addressId: 10,
    basketType: ['market-party'],
    paymentType: 'CASH',
    expeditionType: 'ZF_EXPRESS',
    voucherCode: 'code-2',
    preOrder: {date: 'tomorrow', time: 10},
    bank: 'ap',
  }
  const addPayload = {
    count: 3,
    vendorCode: vendor.vendorCode,
    product: productA,
  }
  const addPayloadB = {
    count: 5,
    vendorCode: addPayload.vendorCode,
    product: productB,
  }

  const removePayload = {
    count: 2,
    vendorCode: vendor.vendorCode,
    product: productA,
  }

  const removePayloadB = {
    count: 5,
    vendorCode: vendor.vendorCode,
    product: productB,
  }

  const updateByAPIPayload = {
    vendorCode: vendor.vendorCode,
    data: {
      basket: {
        id: 'code',
        address: {id: 6},
        products: [{id: 1, name: 'product', count: 5}],
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
            is_show: false,
            value: 10000,
          },
        ],
        total: 100,
        used_credit: 50000,
        voucher_code: 'code-2',
      },
      stocks: {
        available_stocks: [
          {id: 1, stock: 20},
          {id: 2, stock: 15},
        ],
      },
      gateways: [{name: 'gate-1'}],
      payment_types: [1, 2, 3],
      pickup_availability: {},
      show_credit: true,
      show_voucher_field: true,
    },
  }

  const updateByAPIPayloadB = {
    vendorCode: vendor.vendorCode,
    data: {
      basket: {
        products: [
          {id: 2, name: 'product-2', count: 3},
          {id: 1, name: 'product-1', count: 5},
        ],
        pre_order: {date: null, time: -1},
        prices: [],
      },
      stocks: {available_stocks: []},
    },
  }

  const addDescriptionPayload = {
    vendorCode: vendor.vendorCode,
    description: 'description-1',
  }

  const createAction = createBasket(createPayload)
  const updateAction = updateBasket(updatePayload)
  const clearAction = clearBasket(vendor.vendorCode)
  const addAction = addProduct(addPayload)
  const addActionB = addProduct(addPayloadB)
  const removeAction = removeProduct(removePayload)
  const removeActionB = removeProduct(removePayloadB)
  const updateByAPIAction = updateBasketByAPI(updateByAPIPayload)
  const addDescriptionAction = addDescription(addDescriptionPayload)

  const paymentMap = {
    ONLINE: 1,
    CREDIT: 2,
    CASH: 3,
    POS: 4,
  }

  test('baskets actions', () => {
    expect(createAction.payload).toBe(createPayload)
    expect(addAction.payload).toBe(addPayload)
    expect(removeAction.payload).toBe(removePayload)
    expect(clearAction.payload).toBe(vendor.vendorCode)
    expect(updateByAPIAction.payload).toBe(updateByAPIPayload)
    expect(addDescriptionAction.payload).toBe(addDescriptionPayload)
  })

  test('create basket', () => {
    const state = baskets.reducer({}, createAction)
    expect(state).toMatchObject({[vendor.vendorCode]: createPayload})
    expect(state[vendor.vendorCode].verified).toBe(false)
    expect(state[vendor.vendorCode].createdAt).toBeLessThan(
      new Date().valueOf()
    )
  })

  test('update basket', () => {
    let state = baskets.reducer({}, createAction)
    state = baskets.reducer(state, updateAction)
    delete updatePayload.vendorCode
    delete updatePayload.voucherCode
    expect(state[vendor.vendorCode]).toMatchObject(updatePayload)
    expect(state[vendor.vendorCode].verified).toBe(false)
  })

  test('add product', () => {
    let state = baskets.reducer({}, createAction)

    // Add product A
    state = baskets.reducer(state, addAction)

    const {createdAt} = state[vendor.vendorCode]

    expect(state).toMatchObject({
      [vendor.vendorCode]: {
        ...createPayload,
        products: [{...productA, count: addPayload.count}],
        productsMap: {[productA.id]: addPayload.count},
      },
    })

    expect(state[vendor.vendorCode].createdAt).toBe(createdAt)

    // Add product A again
    state = baskets.reducer(state, addAction)

    expect(state).toMatchObject({
      [vendor.vendorCode]: {
        ...createPayload,
        products: [{...productA, count: addPayload.count * 2}],
        productsMap: {[productA.id]: addPayload.count * 2},
      },
    })

    // Add product B
    state = baskets.reducer(state, addActionB)

    expect(state).toMatchObject({
      [vendor.vendorCode]: {
        ...createPayload,
        products: [
          {...productA, count: addPayload.count * 2},
          {...productB, count: addPayloadB.count},
        ],
        productsMap: {
          [productA.id]: addPayload.count * 2,
          [productB.id]: addPayloadB.count,
        },
      },
    })
    expect(state[vendor.vendorCode].verified).toBe(false)
  })

  test('remove product', () => {
    let state = baskets.reducer({}, createAction)

    // Add product A
    state = baskets.reducer(state, addAction)
    // Add product B
    state = baskets.reducer(state, addActionB)

    // remove product A
    state = baskets.reducer(state, removeAction)

    expect(state).toMatchObject({
      [vendor.vendorCode]: {
        ...createPayload,
        products: [
          {...productA, count: addPayload.count - removePayload.count},
          {...productB, count: addPayloadB.count},
        ],
        productsMap: {
          [productA.id]: addPayload.count - removePayload.count,
          [productB.id]: addPayloadB.count,
        },
      },
    })

    // remove product A again
    state = baskets.reducer(state, removeAction)

    expect(state).toMatchObject({
      [vendor.vendorCode]: {
        ...createPayload,
        products: [{...productB, count: addPayloadB.count}],
        productsMap: {[productB.id]: addPayloadB.count},
      },
    })

    // remove product B
    state = baskets.reducer(state, removeActionB)

    expect(state[vendor.vendorCode].products).not.toBeDefined()
    expect(state[vendor.vendorCode].verified).toBe(false)
  })

  test('update local-basket by api', () => {
    let state = baskets.reducer({}, createAction)
    state = baskets.reducer(state, updateByAPIAction)
    const {data} = updateByAPIPayload
    const [product] = data.basket.products
    expect(state[vendor.vendorCode]).toMatchObject({
      id: data.basket.id,
      addressId: data.basket.address.id,
      products: data.basket.products,
      productsMap: {[product.id]: product.count},
      stocks: {1: 20, 2: 15},
      expeditionType: data.basket.expedition_type,
      bank: data.basket.bank,
      paymentType: paymentMap[data.basket.payment_type],
      preOrder: data.basket.pre_order,
      prices: data.basket.prices.filter(price => price.is_show),
      total: data.basket.total,
      usedCredit: data.basket.used_credit,
      discount: {
        type: data.basket.prices[1].discountType,
        amount: data.basket.prices[1].value,
        voucherCode: data.basket.voucher_code,
      },
      options: {
        gateways: data.gateways,
        paymentTypes: data.payment_types,
        showCredit: data.show_credit,
        showVoucherField: data.show_voucher_field,
        pickupAvailability: data.pickup_availability,
      },
    })
    expect(state[vendor.vendorCode].verified).toBe(true)
  })

  test('update local-basket by api - clear voucher', () => {
    let state = baskets.reducer({}, createAction)
    state = baskets.reducer(state, updateByAPIAction)
    state = baskets.reducer(state, updateBasketByAPI(updateByAPIPayloadB))
    expect(state[vendor.vendorCode].discount).not.toBeDefined()
  })

  test('conserve products order', () => {
    let state = baskets.reducer({}, createAction)
    state = baskets.reducer(state, updateByAPIAction)
    state = baskets.reducer(state, updateBasketByAPI(updateByAPIPayloadB))

    const {data} = updateByAPIPayloadB
    const [product2, product1] = data.basket.products
    expect(state[vendor.vendorCode]).toMatchObject({
      products: [product1, product2],
      productsMap: {
        [product1.id]: product1.count,
        [product2.id]: product2.count,
      },
    })
  })

  test('add description', () => {
    let state = baskets.reducer({}, createAction)
    state = baskets.reducer(state, addDescriptionAction)
    expect(state[vendor.vendorCode].description).toBe(
      addDescriptionPayload.description
    )
  })

  test('stock - add product', () => {
    let state = baskets.reducer({}, createAction)
    state = baskets.reducer(state, updateByAPIAction)

    // Add product A
    state = baskets.reducer(state, addAction)

    expect(state).toMatchObject({
      [vendor.vendorCode]: {
        stocks: {[productA.id]: 20 - addPayload.count, 2: 15},
      },
    })

    // Add product A again
    state = baskets.reducer(state, addAction)

    expect(state).toMatchObject({
      [vendor.vendorCode]: {
        stocks: {[productA.id]: 20 - addPayload.count * 2, 2: 15},
      },
    })

    // Add product B
    state = baskets.reducer(state, addActionB)

    expect(state).toMatchObject({
      [vendor.vendorCode]: {
        stocks: {
          [productA.id]: 20 - addPayload.count * 2,
          [productB.id]: 15 - addPayloadB.count,
        },
      },
    })
    expect(state[vendor.vendorCode].verified).toBe(false)
  })

  test('stock - remove product', () => {
    let state = baskets.reducer({}, createAction)
    state = baskets.reducer(state, updateByAPIAction)

    const removeProductA = count =>
      removeProduct({
        count,
        vendorCode: vendor.vendorCode,
        product: {...productA, toppings: []},
      })

    // remove product A
    state = baskets.reducer(state, removeProductA(2))

    expect(state).toMatchObject({
      [vendor.vendorCode]: {
        stocks: {[productA.id]: 20 + 2, 2: 15},
      },
    })

    // remove product A again
    state = baskets.reducer(state, removeProductA(30))

    expect(state).toMatchObject({
      [vendor.vendorCode]: {
        stocks: {[productA.id]: 20 + 5, 2: 15},
      },
    })
  })
})
