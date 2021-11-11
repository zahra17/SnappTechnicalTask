import * as Sentry from '@sentry/react'
import enrichSentry from '.'

describe('enrich sentry events', () => {
  test('enrich sentry', () => {
    let callback

    const getState = jest.fn(() => ({core: {user: {id: 'user-id'}}}))
    const mockStore = {getState, subscribe: cb => (callback = cb)}

    const mockSetUser = jest.fn()
    jest.spyOn(Sentry, 'setUser').mockImplementation(mockSetUser)
    const mockSetContext = jest.fn()
    jest.spyOn(Sentry, 'setContext').mockImplementation(mockSetContext)

    enrichSentry(mockStore)

    callback()

    expect(mockSetUser.mock.calls[0][0]).toMatchObject({id: 'user-id'})
    expect(mockSetContext.mock.calls[0][0]).toBe('client')
  })
})
