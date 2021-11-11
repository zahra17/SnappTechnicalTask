import {createSlice} from '@reduxjs/toolkit'

import getStore, {helpers} from '.'

describe('Store factory', () => {
  const mockSlice = createSlice({
    name: 'test',
    initialState: 0,
    reducers: {increment: (state, action) => state + action.payload},
  })
  test('Create new store', () => {
    const mockResolveModule = jest.fn(() => ({reducer: mockSlice.reducer}))
    jest.spyOn(helpers, 'resolveModule').mockImplementation(mockResolveModule)

    const mockSection = 'section/name'
    const initialState = {[mockSlice.name]: 0, [mockSection]: null}
    const rootReducer = {[mockSlice.name]: mockSlice.reducer}
    const store = getStore({rootReducer, initialState})

    expect(store.reducerManager.getReducerMap()).toEqual({
      ...rootReducer,
      [mockSection]: mockSlice.reducer,
    })
    expect(mockResolveModule.mock.calls[0][0]).toBe('section')
    expect(mockResolveModule.mock.calls[0][1]).toBe('name')
  })

  test('Reducer manager', () => {
    const initialState = {[mockSlice.name]: 0}
    const rootReducer = {[mockSlice.name]: mockSlice.reducer}
    const {reducerManager} = getStore({rootReducer, initialState})

    const mockSection = 'section/name'
    const newReducers = {...rootReducer, [mockSection]: mockSlice.reducer}

    reducerManager.add(newReducers)

    expect(reducerManager.getReducerMap()).toEqual(newReducers)

    reducerManager.remove([mockSlice.name, mockSection])

    expect(reducerManager.getReducerMap()).toEqual({})
  })
})
