import {AxiosInstance} from 'axios'
import cookies from 'js-cookie'

import APPConfig from '@configs'
import {Sodium, Lock, EVENT_TYPES} from '@utils'

import APIFactory from '../APIFactory'
import apiConfig from '../api.config'
import {Cookies} from '@root/types'
import {
  APIError,
  APIConfig,
  Endpoints,
  APIPromise,
  APIResponse,
  isAPIResponse,
} from '../types'

import {
  StatusResponse,
  Tokens,
  Token,
  TokenBody,
  GRANT_TYPES,
  TokenResponse,
} from './api-types'
import {CheckStatus} from '../CheckStatus'

const PUBLIC_KEY: string = process.env.APP_KEY!

class APISecurity {
  CODES = {
    DISABLED: 3001,
    WRONG_PROOF: 3002,
    INVALID_PARAMETERS: 3003,
    INVALID_TOKEN: 3004,
    INVALID_PARAMETERS_REFRESH_TOKEN: 3007,
    TOKEN_CREDENTIALS_EXPIRED: 3008,
    PROOF_TIME_EXPIRED: 3009,
    INVALID_GRANT_TYPE: 3010,
  }

  CONFIG: APIConfig = {
    withCredentials: true,
    baseURL: APPConfig.BASE_URL,
    timeout: apiConfig.timeout,
  }

  ENDPOINTS: Endpoints = {
    section: 'api-security',
    apisConfig: [
      {
        key: 'token',
        url: '/oauth2/default/token',
        method: 'POST',
      },
      {
        key: 'status',
        url: '/oauth2/default/status',
        method: 'GET',
      },
      {
        key: 'proof',
        url: '/oauth2/default/proof',
        method: 'POST',
      },
    ],
    interceptors: {
      response: [
        this.getInterceptors(),
        [CheckStatus.onSuccess, CheckStatus.onError],
      ],
    },
  }

  private diffTime: number = 0

  private hasDiffTime: boolean = false

  private expired: boolean = false

  private tokenPromise?: APIPromise<TokenResponse>

  private timePromise?: APIPromise<StatusResponse>

  private disabled: boolean = false

  private instance: APIFactory

  private lock: Lock

  private maxRetry: number = 10

  private retryMap: {[key: string]: number} = {}

  private defaultGrantType: GRANT_TYPES = GRANT_TYPES.PASSWORD

  private isServer: boolean = typeof window === 'undefined'

  constructor() {
    this.instance = new APIFactory(this.CONFIG)
    this.instance.addEndpoints(this.ENDPOINTS)

    this.lock = new Lock()
  }

  public getInspector() {
    return this.inspect.bind(this)
  }

  public getSetupHeaders() {
    return this.setupHeaders.bind(this)
  }

  private static storage = {
    tokenKeys: ['access_token', 'refresh_token', 'token_type', 'expires_in'],
    getTokenKey: (name: string) => {
      const base = 'jwt'
      return `${base}-${name}`
    },
    set(data: any) {
      this.tokenKeys.forEach(key => {
        cookies.set(this.getTokenKey(key), data[key], {expires: 365})
      })
    },
    get() {
      const tokens: any = {}
      this.tokenKeys.forEach(key => {
        tokens[key] = cookies.get(this.getTokenKey(key))
      })
      return tokens
    },
    clear() {
      this.tokenKeys.forEach(key => {
        cookies.remove(this.getTokenKey(key))
      })
    },
  }

  get accessToken(): Token {
    if (this.expired) return undefined
    const tokens = APISecurity.storage.get()
    const accessToken = tokens.access_token ?? undefined
    return accessToken
  }

  set tokens(tokens: Tokens | string | undefined) {
    this.expired = false
    if (tokens) {
      APISecurity.storage.set(tokens)
    } else APISecurity.storage.clear()
  }

  get refreshToken(): Token {
    if (this.disabled) return undefined
    const tokens = APISecurity.storage.get()
    const refreshToken = tokens.refresh_token ?? undefined
    return refreshToken
  }

  private extractToken(cookies: Cookies = {}): Partial<Tokens> {
    const tokens: any = {}
    APISecurity.storage.tokenKeys.forEach(key => {
      tokens[key] = cookies[APISecurity.storage.getTokenKey(key)]
    })
    return tokens
  }

  private async resolveToken(): Promise<Token> {
    const token = this.accessToken
    if (token) return token

    await this.setDiffTime()

    //   await this._getAndSolveProof()

    await this.getToken()

    this.lock.resolveLock()
    // dispatch token success event
    if (!this.isServer) {
      const tokenSuccessEvent = new CustomEvent(EVENT_TYPES.TOKEN_SUCCESS, {
        detail: this.accessToken,
      })
      window.dispatchEvent(tokenSuccessEvent)
    }

    return this.accessToken
  }

  private getInterceptors() {
    const onRejected = this.errorHandler.bind(this)
    const onFulfilled = (response: APIResponse) => response
    return [onFulfilled, onRejected]
  }

  private async errorHandler(error: APIError, instance?: AxiosInstance) {
    const {config} = error

    if (this.retryMap[config.url!] === undefined) this.retryMap[config.url!] = 1
    else this.retryMap[config.url!] += 1

    if (this.retryMap[config.url!] > this.maxRetry) {
      return Promise.reject(error)
    }

    await new Promise(resolve => setTimeout(resolve, 100))

    return instance!.request(config)
  }

  private async setupHeaders(config: APIConfig): Promise<APIConfig> {
    if (this.disabled) return config

    let accessToken: Token

    if (this.isServer) {
      accessToken = this.extractToken(config.cookies).access_token
    } else {
      await this.lock.promise
      accessToken = await this.resolveToken()
    }

    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`

    return config
  }

  private async inspect(res: APIResponse, instance?: AxiosInstance) {
    const {data, config} = res

    let response = res

    if (data?.status) {
      if (data.data?.oauth2_token) this.tokens = data.data.oauth2_token
    } else if (data?.error?.code) {
      const {code} = data.error
      if (Object.values(this.CODES).includes(+code)) {
        this.lock.createLock()

        await this.handleError(+code)

        await this.setupHeaders(config)

        config.transformRequest = data => data

        response = await instance!.request(config)
      }
    }

    return response
  }

  private async handleError(code: number) {
    let newToken: Token

    switch (code) {
      case this.CODES.DISABLED:
        this.disabled = true
        break

      case this.CODES.PROOF_TIME_EXPIRED:
        this.hasDiffTime = false
        newToken = await this.resolveToken()
        break

      case this.CODES.INVALID_TOKEN:
        this.expired = true
        newToken = await this.resolveToken()
        break

      case this.CODES.INVALID_GRANT_TYPE:
        this.defaultGrantType = GRANT_TYPES.CLIENT_CREDENTIALS
        newToken = await this.resolveToken()
        break

      case this.CODES.INVALID_PARAMETERS_REFRESH_TOKEN:
      case this.CODES.TOKEN_CREDENTIALS_EXPIRED:
      case this.CODES.INVALID_PARAMETERS:
        this.tokens = undefined
        newToken = await this.resolveToken()
        break

      default:
        break
    }

    return newToken
  }

  private static getTime() {
    return Math.floor(new Date().getTime() / 1000)
  }

  private async setDiffTime(): Promise<void> {
    if (this.timePromise) await this.timePromise

    if (this.hasDiffTime) return

    this.timePromise = this.instance.requests.status<StatusResponse>()

    const response = await this.timePromise

    if (isAPIResponse(response)) {
      if (response.data.status) {
        const deviceTime = APISecurity.getTime()
        const serverTime = response.data.data.time
        this.diffTime = serverTime - deviceTime
        this.hasDiffTime = true
      }
    }
  }

  private async getAndSolveProof() {
    const body = {
      device_uid: APPConfig.UUID,
      time: APISecurity.getTime() + this.diffTime,
    }
    const sealed = new Sodium(PUBLIC_KEY).seal(body)

    const response = await this.instance.requests.proof({data: {data: sealed}})

    if (isAPIResponse(response)) {
      if (response.status) {
        // const result = this.solve(response.data.proof)
        // console.log(result)
      } else {
        // console.log(response.error.code)
      }
    }
  }

  private async getToken() {
    if (this.tokenPromise) await this.tokenPromise

    const token = this.accessToken

    if (token) return

    const body = {
      time: APISecurity.getTime() + this.diffTime,
      device_uid: APPConfig.UUID,
      client_id: process.env.CLIENT_ID!,
      client_secret: process.env.CLIENT_SECRET!,
      scope: 'mobile_v2 mobile_v1 webview',
    }
    const sealed = new Sodium(PUBLIC_KEY).seal(this.setupGrantType(body))

    this.tokenPromise = this.instance.requests.token<TokenResponse>({
      data: {data: sealed},
    })

    const response = await this.tokenPromise

    if (isAPIResponse(response)) {
      if (response.data.status) {
        const tokens = response.data.data!
        this.tokens = tokens
      } else {
        this.handleError(+response.data.error!.code)
      }
    }
  }

  private setupGrantType(body: TokenBody): TokenBody {
    const newBody = {...body}
    const {refreshToken} = this
    if (refreshToken) {
      newBody.grant_type = GRANT_TYPES.REFRESH_TOKEN
      newBody.refresh_token = refreshToken
    } else {
      newBody.grant_type = this.defaultGrantType
    }
    return newBody
  }

  public logout() {
    this.tokens = undefined
    this.hasDiffTime = false
    this.resolveToken()
  }
}

export default APISecurity
