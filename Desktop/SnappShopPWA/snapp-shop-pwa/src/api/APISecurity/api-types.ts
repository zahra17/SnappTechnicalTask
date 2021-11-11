export enum GRANT_TYPES {
  REFRESH_TOKEN = 'refresh_token',
  CLIENT_CREDENTIALS = 'client_credentials',
  PASSWORD = 'password',
}

export interface TokenBody {
  time: number
  device_uid: string
  client_id: string
  client_secret: string
  scope: string
  grant_type?: GRANT_TYPES
  refresh_token?: string
}

export type Token = string | undefined

export interface StatusResponse {
  status: boolean
  data: {enabled: boolean; encryption: boolean; proof: boolean; time: number}
}

export type Tokens = {
  access_token: string
  refresh_token?: string
  expires_in: string
  token_type: 'Bearer'
}

export type Error = {
  code: number
  message: string
}

export interface TokenResponse {
  status: boolean
  data?: Tokens
  error?: Error
}
