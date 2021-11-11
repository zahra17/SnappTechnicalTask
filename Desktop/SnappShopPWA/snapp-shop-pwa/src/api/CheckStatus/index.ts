import APIFactory from '../APIFactory'
import {APIError, APIResponse, isAPIResponse} from '../types'

interface CheckStatusResponse {
  isUp: boolean
  message: string
  status: boolean
}

const baseURL = process.env.CHECK_STATUS_BASE_URL

export class CheckStatus {
  private static instance = new APIFactory({baseURL: baseURL}).addEndpoints({
    section: 'api-status',
    apisConfig: [{key: 'status', url: '/v1/status', method: 'GET'}],
  })

  public static status = true

  private static mainURL = '/down-time'

  private static isServer = typeof window === 'undefined'

  constructor() {}

  public static onSuccess = async (res: APIResponse) => {
    CheckStatus.status = true
    return res
  }

  public static onError = async (error: APIError) => {
    if (CheckStatus.isServer || window.location.href === CheckStatus.mainURL) {
      return Promise.reject()
    }
    await CheckStatus.checkStatus()
    return Promise.reject(error)
  }

  private static async checkStatus() {
    await CheckStatus.instance.requests
      .status<CheckStatusResponse>()
      .then(response => {
        if (isAPIResponse(response)) {
          const {isUp} = response.data
          CheckStatus.status = isUp
          if (!isUp) window.location.href = CheckStatus.mainURL
        } else throw 'api-error'
      })
      .catch(() => {
        CheckStatus.status = false
      })
  }
}
