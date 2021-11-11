module.exports = new Set()
  .add({
    pattern: '/checkout/[basketCode]',
    page: 'checkout',
  })
  .add({
    pattern: '/follow-order/[orderCode]',
    page: 'follow-order',
  })
  .add({
    pattern: '/profile/orders',
    page: 'orders-list',
  })
  .add({
    pattern: '/order/failed/[orderCode]',
    page: 'order-invoice',
  })
  .add({
    pattern: '/order/success/[orderCode]',
    page: 'order-invoice',
  })
  .add({
    pattern: '/profile/transactions',
    page: 'transactions-list',
  })
