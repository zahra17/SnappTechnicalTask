import MockAdapter from 'axios-mock-adapter'

import APISecurity from '.'
import {CheckStatus} from '../CheckStatus'

jest.mock('../../utils/sodium.ts')

new MockAdapter(CheckStatus.instance.instance).onGet().reply(200, {isUp: true})

describe('API Security', () => {
  beforeEach(() => APISecurity.storage.clear())

  test('Disabled', () => {
    const apiSecurity = new APISecurity()

    apiSecurity.disabled = true
    const config = {}
    apiSecurity.setupHeaders(config)
    expect(config).toEqual({})
    apiSecurity.disabled = false
  })

  test('APi lock', async () => {
    const apiSecurity = new APISecurity()

    const spyResolveToken = jest
      .spyOn(apiSecurity, 'resolveToken')
      .mockImplementationOnce(jest.fn(async x => x))

    apiSecurity.lock.createLock()
    const config = {headers: {}}
    apiSecurity.setupHeaders(config)
    await Promise.resolve()
    expect(spyResolveToken).not.toHaveBeenCalled()

    apiSecurity.lock.resolveLock()
    await Promise.resolve()
    expect(spyResolveToken).toHaveBeenCalled()
  })

  test('Resolve token and requests optimization', async () => {
    const apiSecurity = new APISecurity()

    const mockTime = jest.fn(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve({data: {status: true, data: {time: 5}}}), 20)
      })
    })
    const mockToken = jest.fn(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({data: {status: true, data: {tokens: {}}}})
        }, 20)
      })
    })

    jest
      .spyOn(apiSecurity.instance.requests, 'status')
      .mockImplementation(mockTime)
    jest
      .spyOn(apiSecurity.instance.requests, 'token')
      .mockImplementation(mockToken)

    apiSecurity.resolveToken()
    apiSecurity.resolveToken()
    await new Promise(resolve => setTimeout(resolve, 20))

    expect(mockTime.mock.calls.length).toBe(1)
    expect(mockToken.mock.calls.length).toBe(1)
  })

  test('Access and refresh token', async () => {
    const apiSecurity = new APISecurity()

    let body = apiSecurity.setupGrantType({})
    expect(body).toEqual({grant_type: 'password'})

    const mockTokens = {access_token: '321', refresh_token: 'abc'}

    apiSecurity.tokens = mockTokens

    expect(apiSecurity.accessToken).toBe(mockTokens.access_token)
    expect(apiSecurity.refreshToken).toBe(mockTokens.refresh_token)

    apiSecurity.expired = true

    expect(apiSecurity.accessToken).toBe(undefined)
    expect(apiSecurity.refreshToken).toBe(mockTokens.refresh_token)

    body = apiSecurity.setupGrantType({})
    expect(body).toEqual({
      grant_type: 'refresh_token',
      refresh_token: mockTokens.refresh_token,
    })
  })

  test('Clint credentials grant type', async () => {
    const apiSecurity = new APISecurity()

    const mockAxios = new MockAdapter(apiSecurity.instance.instance)
    mockAxios.onAny().reply(200, {error: {code: 3010}, status: false})

    await apiSecurity.getToken()

    let body = apiSecurity.setupGrantType({})
    expect(body).toEqual({grant_type: 'client_credentials'})
  })

  test('Inspect', async () => {
    const apiSecurity = new APISecurity()

    const oauth2_token = {access_token: '123'}
    const mockRequest = jest.fn(x => x)
    const successResponse = {
      data: {status: true, data: {oauth2_token}},
      config: {headers: {}},
    }

    const instance = {request: mockRequest}

    let result = await apiSecurity.inspect(successResponse, instance)

    expect(apiSecurity.accessToken).toBe(oauth2_token.access_token)
    expect(result).toEqual(successResponse)
    expect(mockRequest.mock.calls.length).toBe(0)

    const mockNewTokens = {access_token: '321', refresh_token: 'abc'}
    const mockResolveToken = jest.fn(() => {
      apiSecurity.tokens = mockNewTokens
      apiSecurity.lock.resolveLock()
      return apiSecurity.accessToken
    })
    const spyResolveToken = jest.spyOn(apiSecurity, 'resolveToken')
    spyResolveToken.mockImplementation(mockResolveToken)

    const spyHandleError = jest.spyOn(apiSecurity, 'handleError')

    const failedResponse = {
      data: {status: false, error: {code: 3004}},
      config: {headers: {}},
    }

    result = await apiSecurity.inspect(failedResponse, instance)

    expect(spyHandleError).toHaveBeenCalled()
    expect(mockResolveToken.mock.calls.length).toBe(2)
    expect(apiSecurity.accessToken).toBe(mockNewTokens.access_token)
    expect(apiSecurity.refreshToken).toBe(mockNewTokens.refresh_token)
    expect(mockRequest.mock.calls.length).toBe(1)
    expect(mockRequest.mock.calls[0][0]).toMatchObject({
      headers: {Authorization: `Bearer ${mockNewTokens.access_token}`},
    })
  })

  test('Retry failed requests', async () => {
    const apiSecurity = new APISecurity()

    const spyRequest = jest.spyOn(apiSecurity.instance.instance, 'request')

    const mockAxios = new MockAdapter(apiSecurity.instance.instance)
    mockAxios.onGet('/status').reply(400)

    expect.hasAssertions()
    await apiSecurity.instance.requests.status().catch(error => {
      expect(error).toBeInstanceOf(Error)
      return error
    })

    expect(spyRequest).toHaveBeenCalledTimes(apiSecurity.maxRetry + 1)

    mockAxios.restore()
  })

  test('Invalid parameters', async () => {
    const apiSecurity = new APISecurity()

    const mockResolveToken = jest.fn()
    const spyResolveToken = jest.spyOn(apiSecurity, 'resolveToken')
    spyResolveToken.mockImplementation(mockResolveToken)

    const code = apiSecurity.CODES.INVALID_PARAMETERS

    await apiSecurity.handleError(code)

    expect(apiSecurity.accessToken).toBe(undefined)

    expect(spyResolveToken).toHaveBeenCalled()
  })

  test('Invalid token', async () => {
    const apiSecurity = new APISecurity()

    const mockResolveToken = jest.fn()
    const spyResolveToken = jest.spyOn(apiSecurity, 'resolveToken')
    spyResolveToken.mockImplementation(mockResolveToken)

    const code = apiSecurity.CODES.INVALID_TOKEN

    await apiSecurity.handleError(code)

    expect(apiSecurity.expired).toBe(true)

    expect(spyResolveToken).toHaveBeenCalled()
  })

  test('Invalid refresh token', async () => {
    const apiSecurity = new APISecurity()

    const mockResolveToken = jest.fn()
    const spyResolveToken = jest.spyOn(apiSecurity, 'resolveToken')
    spyResolveToken.mockImplementation(mockResolveToken)

    const code = apiSecurity.CODES.INVALID_PARAMETERS_REFRESH_TOKEN

    await apiSecurity.handleError(code)

    expect(apiSecurity.accessToken).toBe(undefined)

    expect(spyResolveToken).toHaveBeenCalled()
  })

  test('Token credentials expired', async () => {
    const apiSecurity = new APISecurity()

    const mockResolveToken = jest.fn()
    const spyResolveToken = jest.spyOn(apiSecurity, 'resolveToken')
    spyResolveToken.mockImplementation(mockResolveToken)

    const code = apiSecurity.CODES.TOKEN_CREDENTIALS_EXPIRED

    await apiSecurity.handleError(code)

    expect(apiSecurity.accessToken).toBe(undefined)

    expect(spyResolveToken).toHaveBeenCalled()
  })

  test('Proof time expired', async () => {
    const apiSecurity = new APISecurity()

    const mockResolveToken = jest.fn()
    const spyResolveToken = jest.spyOn(apiSecurity, 'resolveToken')
    spyResolveToken.mockImplementation(mockResolveToken)

    const code = apiSecurity.CODES.PROOF_TIME_EXPIRED

    await apiSecurity.handleError(code)

    expect(apiSecurity.diffTime).toBe(0)

    expect(spyResolveToken).toHaveBeenCalled()
  })

  test('Invalid grant type', async () => {
    const apiSecurity = new APISecurity()

    const mockResolveToken = jest.fn()
    const spyResolveToken = jest.spyOn(apiSecurity, 'resolveToken')
    spyResolveToken.mockImplementation(mockResolveToken)

    const code = apiSecurity.CODES.INVALID_GRANT_TYPE

    await apiSecurity.handleError(code)

    expect(apiSecurity.accessToken).toBe(undefined)

    expect(spyResolveToken).toHaveBeenCalled()
  })
})
