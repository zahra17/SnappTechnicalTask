import {SectionConfig, api, simpleAPI} from '@api'

const login: SectionConfig = {
  section: 'login',
  interceptors: {
    response: [],
    request: [],
  },
}

const creator = api.requestCreator(login)

const requests = {
  /////////  login / signup / logout  /////////
  loginMobileWithNoPass: creator({
    key: 'loginMobileWithNoPass',
    url: '/mobile/v2/user/loginMobileWithNoPass',
    method: 'POST',
  }),
  loginMobileWithPass: creator({
    key: 'loginMobileWithPass',
    url: '/mobile/v2/user/loginMobileWithPass',
    method: 'POST',
  }),
  forgetPassword: creator({
    key: 'forgetPassword',
    url: '/mobile/v1/user/password/forget',
    method: 'POST',
  }),
  loginMobileWithToken: creator({
    key: 'loginMobileWithToken',
    url: '/mobile/v2/user/loginMobileWithToken',
    method: 'POST',
  }),
  registerWithOptionalPass: creator({
    key: 'registerWithOptionalPass',
    url: '/mobile/v1/user/registerWithOptionalPass',
    method: 'POST',
  }),

  /////////  Locations  /////////
  newAddress: creator({
    key: 'newAddress',
    url: '/mobile/v1/user/address/create',
    method: 'POST',
  }),
  editAddress: creator({
    key: 'editAddress',
    url: '/mobile/v1/user/address/edit',
    method: 'POST',
  }),
  deleteAddress: creator({
    key: 'deleteAddress',
    url: '/mobile/v1/user/address/delete',
    method: 'POST',
  }),

  /////////  Map  /////////
  mapReversAddress: simpleAPI({
    key: 'mapReversAddress',
    url: '/map/address/reverse',
    method: 'GET',
  }),
  mapSearchPlace: simpleAPI({
    key: 'mapSearchPlace',
    url: '/map/address/place',
    method: 'GET',
  }),
  cities: simpleAPI({
    key: 'cities',
    baseURL: `/static/cities.json`,
    method: 'GET',
  }),

  /////////  DownTime  /////////
  sendPhoneNumber: simpleAPI({
    key: 'sendPhoneNumber',
    baseURL: 'https://down.snappfood.ir/v1/user',
    method: 'POST',
  }),
}

export default requests
