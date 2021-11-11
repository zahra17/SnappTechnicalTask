import StoreRepo from '.'

describe('Store repository', () => {
  test('Create new store', () => {
    const spyOnCreate = jest.spyOn(StoreRepo, 'create')

    const initialState = {baskets: {}}
    const store1 = StoreRepo.initiate(initialState)

    expect(StoreRepo.initialState).toEqual(initialState)
    expect(spyOnCreate).toHaveBeenCalledTimes(1)

    const store2 = StoreRepo.initiate(initialState)
    expect(store2).toBe(store1)

    const store3 = StoreRepo.get(false)
    expect(store3).toBe(store1)

    const store4 = StoreRepo.get(true)
    expect(store4).not.toBe(store1)
  })
})
