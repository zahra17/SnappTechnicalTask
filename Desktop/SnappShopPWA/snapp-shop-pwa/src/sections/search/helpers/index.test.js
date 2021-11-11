import vendorsList from '~search/redux/vendorsList'

import searchSideEffects from '.'

describe('Search side effects', () => {
  test("Add search's reducer", () => {
    const mockAddReducer = jest.fn()
    const ctx = {store: {reducerManager: {add: mockAddReducer}}}

    searchSideEffects(ctx)

    // expect(mockAddReducer.mock.calls[0][0]).toMatchObject({
    //   'search/vendorsList': vendorsList.reducer,
    // })
  })
})
