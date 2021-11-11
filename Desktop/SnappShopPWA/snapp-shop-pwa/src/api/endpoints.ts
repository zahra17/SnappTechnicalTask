import APIFactory from './APIFactory'
import APISecurity from './APISecurity'
import {CheckStatus} from './CheckStatus'
import {SectionConfig} from './types'
import {i18nInterceptor} from '@i18n'

export const api = new APIFactory()
export const apiSecurity = new APISecurity()

const coreSection: SectionConfig = {
  section: 'base',
  interceptors: {
    force: true,
    response: [
      [apiSecurity.getInspector()],
      [CheckStatus.onSuccess, CheckStatus.onError],
    ],
    request: [[apiSecurity.getSetupHeaders()], [i18nInterceptor]],
  },
  defaults: {},
}

const creator = api.requestCreator(coreSection)

const requests = {
  load: creator({
    key: 'load',
    url: '/mobile/:version/user/load',
    method: 'POST',
  }),
  logout: creator({
    key: 'logout',
    url: '/mobile/:version/user/logout',
    method: 'POST',
  }),
}

export default requests
