import {SectionConfig, api} from '@api'

const basket: SectionConfig = {
  section: 'order',
  interceptors: {
    response: [],
    request: [],
  },
}

const creator = api.requestCreator(basket)

const fetchCredit = creator({
  key: 'fetchCredit',
  url: '/mobile/v1/user/credit/get',
  method: 'POST',
})

const increaseCredit = creator({
  key: 'increaseCredit',
  url: '/mobile/v2/user/credit/increase',
  method: 'POST',
})

const getDirectDebitInfo = creator({
  key: 'getDirectDebitInfo',
  url: '/mobile/v1/ap/get-direct-debit-bank',
  method: 'GET',
})

const getSnappCreditInfo = creator({
  key: 'getSnappCreditInfo',
  url: '/mobile/v1/snapp-credit/get-snapp-credit-bank',
  method: 'GET',
})

const submitNewOrder = creator({
  key: 'submitOrder',
  url: '/mobile/v1/order/new',
  method: 'POST',
})

const getOrderStatus = creator({
  key: 'orderStatus',
  url: '/mobile/v3/order/getOrderDetailData',
  method: 'GET',
})

const getPendingOrders = creator({
  key: 'pendingOrders',
  url: '/mobile/v1/order/userPendingOrders',
  method: 'GET',
})

const getReorders = creator({
  key: 'reorders',
  url: '/mobile/v1/order/reorder',
})
const setOrderDelay = creator({
  key: 'setOrderDelay',
  url: '/mobile/v1/order/setDelayedOrder',
  method: 'POST',
})

const setDeliverance = creator({
  key: 'setDeliverance',
  url: '/mobile/v1/order/setCustomerDeliveredAt',
  method: 'POST',
})

const getBikerLocation = creator({
  key: 'getBikerLocation',
  url: '/landing/biker-location',
  method: 'POST',
})

const getOrdersList = creator({
  key: 'ordersList',
  url: '/mobile/v1/order/reorder',
  method: 'GET',
})

const getTransactionsList = creator({
  key: 'transactionsList',
  url: '/mobile/v2/user/payments',
})

const directDebitPayment = creator({
  key: 'debitPayment',
  url: '/mobile/v1/ap/pay-direct-debit/:orderCode',
  method: 'GET',
})

const snappCreditPayment = creator({
  key: 'debitPayment',
  url: '/mobile/v1/snapp-credit/pay-snapp-credit/:orderCode',
  method: 'GET',
})

const requests = {
  fetchCredit,
  increaseCredit,
  submitNewOrder,
  getOrderStatus,
  getPendingOrders,
  getOrdersList,
  getTransactionsList,
  setOrderDelay,
  setDeliverance,
  getBikerLocation,
  getReorders,
  getDirectDebitInfo,
  getSnappCreditInfo,
  directDebitPayment,
  snappCreditPayment,
}

export default requests
