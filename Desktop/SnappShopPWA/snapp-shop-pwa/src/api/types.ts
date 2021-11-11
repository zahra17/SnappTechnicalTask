import {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosInstance,
  AxiosError,
} from 'axios'

import {Cookies} from '@root/types'

export interface APIConfig extends AxiosRequestConfig {
  key?: string
  maxRetry?: number
  cookies?: Cookies
  sectionKey?: string
  showErrorMessage?: boolean
  urlParams?: Record<string, string | number>
  staticParams?: Record<string, string | number>
}

export interface APIResponse<D = any> extends AxiosResponse<D> {
  config: APIConfig
}

export interface APIError<D = any> extends AxiosError<D> {
  config: APIConfig
  response?: APIResponse<D>
}

export type Configurable<D = any> = APIError<D> | APIResponse<D>

export interface Fulfilled<T = AxiosInstance, D = any> {
  (response: APIResponse<D>, instance?: T):
    | APIResponse<D>
    | Promise<APIResponse<D>>
}

export interface Rejected<T = AxiosInstance, D = any> {
  (error: APIError<D>, instance?: T): Configurable<D> | Promise<Configurable<D>>
}

export type APIPromise<D = any> = Promise<
  APIResponse<D> | APIError<D> | undefined
>

export interface RequestInterceptor<T = AxiosInstance> {
  (config: APIConfig, instance?: T): APIConfig | Promise<APIConfig>
}
export type ResponseInterceptor<T = AxiosInstance, D = any> =
  | Fulfilled<T, D>
  | Rejected<T, D>

export interface Interceptors<T = AxiosInstance> {
  force?: boolean
  response?: ResponseInterceptor<T>[][]
  request?: RequestInterceptor<T>[][]
}

export interface Endpoints<T = AxiosInstance> {
  section: string
  apisConfig?: APIConfig[]
  interceptors?: Interceptors<T>
  defaults?: APIConfig
}

export interface SectionConfig<T = AxiosInstance> {
  section: string
  interceptors?: Interceptors<T>
  defaults?: APIConfig
}

export function isAPIResponse(
  result: APIResponse | APIError | undefined
): result is APIResponse {
  return (result as APIResponse)?.data !== undefined
}

export function isAPIError(
  result: APIResponse | APIError | undefined
): result is APIError {
  return (result as APIError)?.isAxiosError !== undefined
}
