import {SectionConfig, api} from '@api'

const search: SectionConfig = {
  section: 'search',
  interceptors: {
    response: [],
    request: [],
  },
}

const creator = api.requestCreator(search)

const requests = {
  getHomeData: creator({
    key: 'getHomeData',
    url: '/search/api/v1/desktop/new-home',
    method: 'GET',
  }),
  vendorList: creator({
    key: 'vendorList',
    url: '/search/api/v1/desktop/vendors-list',
    method: 'GET',
  }),
  // vendorListTemp: creator({
  //   key: 'vendorListTemp',
  //   url: '/search/api/v1/desktop/vendors-list',
  //   method: 'GET',
  // }),
  productList: creator({
    key: 'productList',
    url: '/mobile/v1/product/product-list',
    method: 'GET',
  }),
  productListDesktop: creator({
    key: 'productListDesktop',
    url: '/search/api/v1/product/product-list',
    method: 'GET',
  }),
  searchVendors: creator({
    key: 'searchVendors',
    url: '/search/api/v1/desktop/vendor/search',
    method: 'GET',
  }),
  searchProducts: creator({
    key: 'searchVendors',
    url: '/search/api/v1/desktop/product-variation/search',
    method: 'GET',
  }),
  search: creator({
    key: 'search',
    url: '/search/api/v1/desktop/search',
    method: 'GET',
  }),
  services: creator({
    key: 'services',
    url: 'search/api/:version/desktop/service',
    method: 'GET',
  }),
  sendLinkSms: creator({
    key: 'sendLinkSms',
    url: '/customer/app-dl/send',
    method: 'POST',
  }),
  getCities: creator({
    key: 'getCities',
    url: '/search/api/v1/desktop/cities',
    method: 'GET',
  }),
  editUser: creator({
    key: 'editUser',
    url: '/mobile/v1/user/edit',
    method: 'POST',
  }),
  changePassword: creator({
    key: 'changePassword',
    url: '/mobile/v1/user/password/change',
    method: 'POST',
  }),
}

export default requests
