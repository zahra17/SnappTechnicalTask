import {APIConfig} from '@api'

import i18n from './i18next'

const localeInterceptor = (apiConfig: APIConfig) => {
  apiConfig.params.locale = i18n.language
  return apiConfig
}

export default localeInterceptor
