import {APIConfig} from './types'
import configs from '@configs'
import qs from 'querystring'

const isServer = typeof window === 'undefined'

const maxRetry = isServer ? 1 : +process.env.API_MAX_RETRY!
const timeout = isServer
  ? +process.env.SERVER_API_MAX_TIMEOUT!
  : +process.env.API_MAX_TIMEOUT!

const apiConfig: APIConfig = {
  baseURL: configs.BASE_URL,
  maxRetry,
  timeout,
  withCredentials: true,
  transformRequest: [data => qs.stringify(data)],
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  validateStatus: status => status >= 200 && status <= 400,
  staticParams: {
    lat: configs.LAT,
    long: configs.LONG,
    optionalClient: configs.CLIENT!,
    client: configs.CLIENT!,
    deviceType: configs.CLIENT!,
    appVersion: configs.VERSION!,
    UDID: configs.UUID,
  },
}

export const simpleConfig: APIConfig = {
  baseURL: configs.BASE_URL,
  maxRetry,
  timeout,
}

export default apiConfig
