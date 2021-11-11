import {compareProducts, getProductUniqueId, getUUID} from '.'

describe('Utils', () => {
  test('Get UUID', () => {
    const id1 = getUUID()
    const id2 = getUUID()
    expect(id1).toBe(id2)
  })

  test('get product unique id', () => {
    const mockProduct = {
      id: '6',
      toppings: [
        {id: '110', count: 2},
        {id: 109, count: 10},
        {id: 5, count: 0},
      ],
    }

    const id = getProductUniqueId(mockProduct)
    expect(id).toEqual([6, 5, 109, 110])
  })

  test('compare products', () => {
    const mockProductA = {
      id: 6,
      toppings: [
        {id: 110, count: 2},
        {id: 109, count: 10},
        {id: 5, count: 0},
      ],
    }

    const mockProductB = {
      id: 7,
      toppings: [
        {id: 110, count: 2},
        {id: 109, count: 10},
        {id: 5, count: 0},
      ],
    }

    const mockProductC = {
      id: 6,
      toppings: [
        {id: 110, count: 2},
        {id: 5, count: 0},
        {id: 109, count: 10},
      ],
    }

    const mockProductD = {
      id: 6,
      toppings: [
        {id: 110, count: 2},
        {id: 108, count: 10},
        {id: 5, count: 0},
      ],
    }

    expect(compareProducts(mockProductA, mockProductA)).toBe(true)
    expect(compareProducts(mockProductA, mockProductB)).toBe(false)
    expect(compareProducts(mockProductA, mockProductC)).toBe(true)
    expect(compareProducts(mockProductA, mockProductD)).toBe(false)
  })
})
