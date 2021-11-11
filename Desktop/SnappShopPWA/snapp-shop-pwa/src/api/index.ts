import {simpleConfig} from './api.config'
import APIFactory from './APIFactory'
import endpoints from './endpoints'

export {APIFactory}
export {CheckStatus} from './CheckStatus'
export {apiSecurity, api} from './endpoints'

export const simpleAPI = new APIFactory(simpleConfig).requestCreator({
  section: 'simple',
})

export type {
  Endpoints,
  SectionConfig,
  APIConfig,
  APIError,
  APIResponse,
  APIPromise,
} from './types'

export {isAPIError, isAPIResponse} from './types'

export default endpoints
