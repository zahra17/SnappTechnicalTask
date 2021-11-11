import {SectionConfig, api} from '@api'

const search: SectionConfig = {
  section: 'menu',
  interceptors: {
    response: [],
    request: [],
  },
}

const creator = api.requestCreator(search)

const requests = {
  vendorStaticDetails: creator({
    key: 'vendorStaticDetails',
    url: '/mobile/:version/:type/details/static',
    method: 'GET',
  }),
  vendorDynamicDetails: creator({
    key: 'vendorDynamicDetails',
    url: '/mobile/:version/:type/details/dynamic',
    method: 'GET',
  }),
  getVendorComments: creator({
    key: 'getVendorComments',
    url: '/mobile/:version/restaurant/vendor-comment',
    method: 'GET',
  }),
  getZooketDetail: creator({
    key: 'getZooketDetail',
    url: '/mobile/:version/restaurant/zooket-details',
    method: 'GET',
  }),
  getZooketProducts: creator({
    key: 'getZooketDetail',
    url: '/mobile/:version/product-variation/index',
    method: 'GET',
  }),
  getProductComments: creator({
    key: 'getProductComments',
    url: '/mobile/v2/restaurant/productReviews',
    method: 'GET',
  }),
  getZooketProductDetails: creator({
    key: 'getZooketProductDetails',
    url: '/mobile/v2/product-variation/view',
    method: 'GET',
  }),
  getCouponBasedOnBasket: creator({
    key: 'getCouponBasedOnBasket',
    url: '/mobile/:version/:type/coupons/:variable',
    method: 'POST',
  }),
}

export default requests
