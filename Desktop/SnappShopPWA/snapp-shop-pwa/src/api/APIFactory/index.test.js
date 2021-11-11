import MockAdapter from 'axios-mock-adapter'

import APIFactory from '.'

const responseSuccess = jest.fn(x => x)
const responseError = jest.fn(x => Promise.reject(x))

const requestBefore = jest.fn(x => x)
const requestError = jest.fn(x => Promise.reject(x))

const endpointsA = {
  section: 'testA',
  apisConfig: [
    {
      key: 'jest',
      url: '/repos/facebook/jest',
      baseURL: 'https://api.github.com',
      method: 'GET',
      withCredentials: false,
    },
    {
      key: 'gitHubRepo',
      url: '/repos/:compony/:repoName',
      baseURL: 'https://api.github.com',
      method: 'GET',
    },
  ],
  interceptors: {
    force: true,
    response: [[responseSuccess, responseError]],
    request: [],
  },
  defaults: {
    timeout: 100,
    withCredentials: true,
  },
}
const endpointsB = {
  section: 'testB',
  apisConfig: [
    {
      key: 'react',
      url: '/repos/facebook/react',
      baseURL: 'https://api.github.com',
      method: 'GET',
      timeout: 50,
      maxRetry: 4,
      headers: {'Content-Type': 'application/json'},
      withCredentials: false,
    },
    {
      key: 'customAPI',
    },
  ],
  interceptors: {
    force: false,
    response: [],
    request: [[requestBefore, requestError]],
  },
}

describe('API Client', () => {
  beforeEach(() => jest.clearAllMocks())

  test('Add endpoints', () => {
    const api = new APIFactory()

    const spyAddEndpoints = jest.spyOn(api, 'addEndpoints')
    const spyAddInterceptors = jest.spyOn(api, 'addInterceptors')

    api.addEndpoints(endpointsA)

    expect(api.apisConfig).toEqual({
      [endpointsA.section]: endpointsA.apisConfig,
    })
    expect(api.sectionsMap).toEqual([endpointsA.section])

    const requestsB = api.addEndpoints(endpointsB)

    expect(Object.keys(requestsB.requests)).toEqual([
      ...endpointsA.apisConfig.map(endpoint => endpoint.key),
      ...endpointsB.apisConfig.map(endpoint => endpoint.key),
    ])

    expect(spyAddEndpoints).toHaveBeenCalledTimes(2)

    expect(api.apisConfig).toEqual({
      [endpointsA.section]: endpointsA.apisConfig,
      [endpointsB.section]: endpointsB.apisConfig,
    })
    expect(api.sectionsMap).toEqual([endpointsA.section, endpointsB.section])

    expect(spyAddInterceptors).toHaveBeenCalledTimes(2)
    expect(api.interceptorWhitList).toEqual([api.key, endpointsA.section])
    expect(api.interceptorsMap).toEqual([
      api.key,
      endpointsA.section,
      endpointsB.section,
    ])
  })

  test('Section request creator', async () => {
    const section = {section: 'section-1'}
    const api = new APIFactory()
    const creator = api.requestCreator(section)

    const jestAPI = endpointsA.apisConfig[0]
    const jest = creator(jestAPI)

    expect(api.sectionsMap).toEqual([section.section])

    new MockAdapter(api.instance).onAny().reply(200)

    expect(jest()).toMatchObject(api.requests.jest())

    const apiResponse = await jest()

    jestAPI.method = jestAPI.method.toLocaleLowerCase()
    expect(apiResponse).toMatchObject({config: jestAPI})

    const gitHubRepoAPI = endpointsA.apisConfig[1]
    const gitHubRepo = creator(gitHubRepoAPI)
    const urlParams = {compony: 'facebook', repoName: 'react'}

    expect(gitHubRepo({urlParams})).toMatchObject(
      api.requests.gitHubRepo({urlParams})
    )
  })

  test('Interceptors', async () => {
    const api = new APIFactory().addEndpoints(endpointsA)
    const mockAxios = new MockAdapter(api.instance)

    const jestRepo = endpointsA.apisConfig[0]
    mockAxios.onGet(jestRepo.url, {baseURL: jestRepo.baseURL}).reply(200)

    await api.requests.jest()

    expect(responseSuccess.mock.calls.length).toBe(1)
    expect(responseError.mock.calls.length).toBe(0)

    expect(requestBefore.mock.calls.length).toBe(0)
    expect(requestError.mock.calls.length).toBe(0)
  })

  test('Timeout', async () => {
    const api = new APIFactory()
      .addEndpoints(endpointsB)
      .addInterceptors(endpointsA.key, endpointsA.interceptors)
    const mockAxios = new MockAdapter(api.instance)

    const mockAPIError = jest.fn(x => x)
    const spyShowApiErrorMessage = jest.spyOn(api, 'showAPIErrorMessage')
    spyShowApiErrorMessage.mockImplementationOnce(mockAPIError)

    const reactRepo = endpointsB.apisConfig[0]
    mockAxios.onGet(reactRepo.url, {baseURL: reactRepo.baseURL}).timeout()

    expect.hasAssertions()
    await api.requests.react().catch(error => {
      expect(error).toBeInstanceOf(Error)
    })

    const {url: reactUrl, maxRetry} = reactRepo

    expect(api.errorMap).toEqual({[reactUrl]: maxRetry + 1})
    expect(responseError.mock.calls.length).toBe(maxRetry)

    expect(requestBefore.mock.calls.length).toBe(maxRetry)

    expect(mockAPIError.mock.calls.length).toBe(1)
    expect(mockAPIError.mock.calls[0][0]).toBe('ECONNABORTED')
    expect(mockAPIError.mock.calls[0][1]).toBe(reactUrl)
  })

  test('Rejected request', async () => {
    const api = new APIFactory().addEndpoints(endpointsA)

    new MockAdapter(api.instance).onAny().reply(404)

    expect.hasAssertions()
    const result = await api.requests.jest().catch(error => {
      expect(error).toBeInstanceOf(Error)
      return error
    })

    expect(result).toMatchObject({response: {status: 404}})
  })

  test('Fulfilled request', async () => {
    const api = new APIFactory().addEndpoints(endpointsA)

    new MockAdapter(api.instance).onAny().reply(200)

    const result = await api.requests.jest()

    expect(result).toMatchObject({status: 200})
  })

  test('URL params', async () => {
    const api = new APIFactory().addEndpoints(endpointsA)

    new MockAdapter(api.instance).onAny().reply(200)

    const result = await api.requests.gitHubRepo({
      urlParams: {compony: 'facebook', repoName: 'react'},
    })

    expect(result).toMatchObject({config: {url: '/repos/facebook/react'}})
  })

  test('Section defaults and configs priority', async () => {
    const baseConfig = {maxRetry: '19', baseURL: 'https://google.com'}
    const api = new APIFactory(baseConfig).addEndpoints(endpointsA)

    new MockAdapter(api.instance).onAny().reply(400)

    expect.hasAssertions()
    const result = await api.requests.jest({method: 'POST'}).catch(error => {
      expect(error).toBeInstanceOf(Error)
      return error
    })

    expect(result).toMatchObject({
      config: {
        maxRetry: '19',
        timeout: 100,
        withCredentials: false,
        method: 'post',
        baseURL: 'https://api.github.com',
      },
    })
  })

  test('Custom API', async () => {
    const api = new APIFactory().addEndpoints(endpointsB)

    new MockAdapter(api.instance).onAny().reply(200)

    const result = await api.requests.customAPI({
      baseURL: 'https://api.github.com/repos/facebook/react',
      method: 'GET',
    })

    expect(result).toMatchObject({config: {url: ''}})
  })

  test('Headers content type', async () => {
    const headerJson = {'Content-Type': 'application/json'}
    const headerForm = {'Content-Type': 'application/x-www-form-urlencoded'}

    const apiForm = new APIFactory({headers: headerForm}).addEndpoints(
      endpointsA
    )

    new MockAdapter(apiForm.instance).onAny().reply(200)

    const defaultFormA = await apiForm.requests.jest()
    const defaultFormB = await apiForm.requests.jest({headers: headerJson})

    expect(defaultFormA).toMatchObject({config: {headers: headerForm}})
    expect(defaultFormB).toMatchObject({config: {headers: headerJson}})

    const apiJson = new APIFactory().addEndpoints(endpointsB)

    new MockAdapter(apiJson.instance).onAny().reply(200)

    const defaultJsonA = await apiJson.requests.react()
    const defaultJsonB = await apiJson.requests.react({headers: headerForm})

    expect(defaultJsonA).toMatchObject({config: {headers: headerJson}})
    expect(defaultJsonB).toMatchObject({config: {headers: headerForm}})
  })

  test('Static params', async () => {
    const staticParams = {param: 'param'}
    const apiWithParam = new APIFactory({staticParams}).addEndpoints(endpointsA)

    new MockAdapter(apiWithParam.instance).onAny().reply(200)

    const withParamA = await apiWithParam.requests.jest()
    const withParamB = await apiWithParam.requests.jest({staticParams: {}})

    expect(withParamA).toMatchObject({config: {params: staticParams}})
    expect(withParamB).toMatchObject({config: {params: {}}})

    const apiWithoutParam = new APIFactory().addEndpoints(endpointsB)

    new MockAdapter(apiWithoutParam.instance).onAny().reply(200)

    const withoutParamA = await apiWithoutParam.requests.react()
    const withoutParamB = await apiWithoutParam.requests.react({staticParams})

    expect(withoutParamA).toMatchObject({config: {params: {}}})
    expect(withoutParamB).toMatchObject({config: {params: staticParams}})
  })
})
